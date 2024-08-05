const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database.js');

const { RefreshToken, User, UserAddress, BillingAddress, PaymentCard, PaymentCardJunction } = require('../models/index.js');

const AuthsController = {

    userRegister: async (req, res) => {
        let { firstName, lastName, email, password, phoneNumber, promoStatus, verificationCode } = req?.body;
        let { street, city, state, zipCode } = req?.body;
        let { paymentFirstName, paymentLastName, paymentStreet, paymentCity,
            paymentState, paymentZipCode, cardNumber, expirationDate } = req?.body;

        if (!(firstName && lastName && email && password && phoneNumber && promoStatus)) {
            return res.status(400).json('Missing required parameters');
        }

        try {
            await sequelize.transaction(async (transaction) => {
                const existingUser = await User.isEmailTaken(email);
                if (existingUser) return res.status(409).json('User with that email already exists');

                // Create user
                const user = await User.createUser({
                    clearance_id: 2,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                    status_id: 2,
                    phone_number: phoneNumber,
                    email_promo_status_id: promoStatus,
                    verification_code: verificationCode
                }, { transaction });
                if (!user) return res.status(500).json('Failed to create user');

                // Create address
                let address = null;
                if (street && city && state && zipCode) {
                    address = await UserAddress.createUserAddress({
                        user_id: user.id,
                        city,
                        state,
                        street,
                        zip_code: zipCode
                    }, { transaction });
                    if (!address) return res.status(500).json('Failed to create address');
                }

                // Handle payment card, billing address, and payment card junction
                if (paymentFirstName && paymentLastName && paymentStreet && paymentCity
                    && paymentState && paymentZipCode && cardNumber && expirationDate) {
                    // Parse expirationDate from JSON
                    const [month, year] = expirationDate.split('/');
                    const parsedExpirationDate = new Date(`20${year}`, month - 1);

                    const billingAddress = await BillingAddress.create({
                        city: paymentCity, state: paymentState, street: paymentStreet, zip_code: paymentZipCode
                    }, { transaction });
                    if (!billingAddress) return res.status(500).json('Failed to create billing address');

                    // Create payment card with the billing address
                    const paymentCard = await PaymentCard.create({
                        customer_id: user.id,
                        card_number: cardNumber,
                        expiration_date: parsedExpirationDate,
                        first_name: paymentFirstName,
                        last_name: paymentLastName,
                        billing_address_id: billingAddress.id
                    }, { transaction });
                    if (!paymentCard) return res.status(500).json('Failed to create payment card');

                    // Link to payment card junction
                    const paymentCardJunction = await PaymentCardJunction.create({
                        user_id: user.id,
                        payment_card_id: paymentCard.id
                    }, { transaction });
                    if (!paymentCardJunction) return res.status(500).json('Failed to create payment card junction');
                }

                return res.sendStatus(201);
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    isEmailTaken: async (req, res) => {
        const email = req?.params.email;
        if (!email) return res.status(400).json('Missing email parameter');

        try {
            const emailTaken = await User.isEmailTaken(email);
            return res.status(200).json(emailTaken);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    verificationCodeMatch: async (req, res) => {
        const verificationCode = req?.params?.verificationCode;
        if (!verificationCode) return res.status(400).json('Missing verificationCode parameter');

        const { email } = req?.body;
        if (!email) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findOne({ where: { email } }, transaction);
                if (!user) return res.status(404).json('User not found');

                if (user.verification_code === verificationCode) {
                    const [updatedStatus] = await User.update({ verification_code: '', status_id: 1 }, { where: { id: user.id }, transaction });
                    if (updatedStatus[0] === 0) return res.status(500).json('Failed to update user status');
                } else {
                    return res.status(403).json('Verification code does not match');
                }

                return res.sendStatus(200);
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    refreshAccessToken: async (req, res) => {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json('No refresh token');

        try {
            const result = await sequelize.transaction(async (transaction) => {
                const verifiedRefreshToken = await RefreshToken.findOne({
                    where: { token: refreshToken },
                    include: { model: User, as: 'user' },
                }, { transaction });
                if (!verifiedRefreshToken) return res.status(403).json('User does not have a refresh token');

                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                if (verifiedRefreshToken.user.id !== decoded.userId) {
                    return { status: 403, message: 'Token user does not match the decoded user in JWT' };
                }

                const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
                res.setHeader('authorization', `Bearer ${accessToken}`);

                return { status: 200, user: verifiedRefreshToken.user };
            });

            if (result.status !== 200) {
                return res.status(result.status).json(result.message);
            }

            return res.status(200).json(result.user.toJSON());
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(403).json('Invalid refresh token');
            }
            // Log and respond with a generic server error for any other issues
            console.error('Error refreshing access token:', error);
            return res.status(500).json('Failed to refresh access token')
        }
    },

    login: async (req, res) => {
        const { email, password } = req?.body;
        if (!email || !password) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findOne({ where: { email } }, { transaction });
                if (!user) return res.status(401).json('No user with that email');
                const userId = user.id;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return res.status(401).json('Password does not match');

                // User authenticated
                const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
                const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

                // Create expires at date
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 1); // Refresh token expires in 1 days

                // Check to see if user already has an existing refresh token
                const existingRefreshToken = await RefreshToken.findOne({
                    where: { user_id: userId },
                    include: [{ model: User, as: 'user' }]
                }, { transaction });

                if (existingRefreshToken) {
                    // Update refresh token
                    const rowsAffected = await RefreshToken.updateRefreshToken(
                        existingRefreshToken.id,
                        { token: refreshToken, expires_at: expiresAt },
                        { transaction });
                    if (rowsAffected[0] === 0) return res.status(500).json('Failed to update refresh token');
                } else {
                    // Store refresh token
                    const storedRefreshToken = await RefreshToken.createRefreshToken({
                        user_id: userId,
                        token: refreshToken,
                        expires_at: expiresAt
                    });
                    if (!storedRefreshToken) return res.status(500).json('Failed to store refresh token');
                }

                // Send refresh token as a secure, HTTP-only, strict, 1 day max age cookie
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

                // Send access token through header
                res.setHeader('authorization', `Bearer ${accessToken}`);

                return res.status(201).json(user.toJSON());
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    logout: async (req, res) => {
        const refreshToken = req?.cookies?.refreshToken;
        if (!refreshToken) return res.status(401).json('No refresh token');

        try {
            await sequelize.transaction(async (transaction) => {
                // Verify refresh token exists
                const verifiedRefreshToken = await RefreshToken.findOne({ where: { token: refreshToken } }, { transaction });
                if (!verifiedRefreshToken) return res.status(204).json('User does not have a refresh token');

                // Delete refresh token from database
                const rowsAffected = await RefreshToken.deleteRefreshToken(verifiedRefreshToken.id, { transaction });
                if (rowsAffected[0] === 0) return res.status(500).json('Failed to delete refresh token');

                // Clear cookie
                res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
                res.cookie('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'None', maxAge: 0 });

                return res.sendStatus(204);
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    resetPassword: async (req, res) => {
        const id = req?.params.id;
        if (!id) return res.status(400).json('Missing user id');

        const newPassword = req?.headers?.password;
        if (!id || !newPassword) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const rowsAffected = await User.updateUser({ id }, { password: newPassword }, transaction);
                if (rowsAffected[0] === 0) return res.status(404).send('User not found');
                return res.status(201).send('Password reset successfully');
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

}

module.exports = AuthsController;