const bcrypt = require('bcrypt');
const sequelize = require('../config/database.js');

const { User, EmailPromoStatus, UserStatus, PaymentCardJunction, Clearance, UserAddress } = require('../models/index.js');

const UsersController = {

    getUserById: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        try {
            const user = await User.findOne({
                where: { id },
                include: [
                    { model: UserAddress, as: 'userAddress' },
                    { model: EmailPromoStatus, as: 'emailPromoStatus' },
                    { model: UserStatus, as: 'status' },
                    { model: PaymentCardJunction, as: 'paymentCards' },
                    { model: Clearance, as: 'clearance', attributes: ['role'] }
                ]
            });

            if (!user) return res.status(404).send('User not found');
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    getUserByEmail: async (req, res) => {
        const email = req?.params?.email;
        if (!email) return res.status(400).json('Missing user email');

        try {
            const user = await User.findOne({
                where: { email },
                include: [
                    { model: UserAddress, as: 'userAddress' },
                    { model: EmailPromoStatus, as: 'emailPromoStatus' },
                    { model: UserStatus, as: 'status' },
                    { model: PaymentCardJunction, as: 'paymentCards' },
                    { model: Clearance, as: 'clearance', attributes: ['role'] }
                ]
            });
            if (!user) return res.status(404).send('User not found');
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    /* NOT WORKING
    updateUser: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');
 
        const { firstName, lastName, phoneNumber, emailPromoStatus, clearanceId, status } = req?.body;
        if (!(firstName || lastName || phoneNumber || emailPromoStatus || clearanceId || status))
            return res.status(400).json('Missing required parameters');
 
        try {
            await sequelize.transaction(async (transaction) => {
                // Get user
                const user = await User.findOne({ where: { id }, transaction });
                if (!user) return res.status(404).send('User not found');
 
                // Update user
                const rowsAffected = await User.updateUser(
                    { id }, {
                    first_name: firstName || user.first_name,
                    last_name: lastName || user.last_name,
                    phone_number: phoneNumber || user.phone_number,
                    email_promo_status_id: emailPromoStatus || user.email_promo_status_id,
                    clearance_id: clearanceId || user.clearance_id,
                    status_id: status || user.status_id
                }, transaction);
                if (rowsAffected[0] === 0) return res.status(404).send('Error updating user');
                return res.status(200).send('User updated successfully');
            });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).send(error.message);
        }
    },
    */

    updateUser: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        const { firstName, lastName, phoneNumber, emailPromoStatus, clearanceId, status, avatarLink } = req?.body;

        const updateData = {};
        if (firstName !== undefined) updateData.first_name = firstName;
        if (lastName !== undefined) updateData.last_name = lastName;
        if (phoneNumber !== undefined) updateData.phone_number = phoneNumber;
        if (emailPromoStatus !== undefined) {
            if (emailPromoStatus) {
                updateData.email_promo_status_id = 1;
            } else {
                updateData.email_promo_status_id = 2;
            }
        }
        if (clearanceId !== undefined) updateData.clearance_id = clearanceId;
        if (status !== undefined) updateData.status_id = status;
        if (avatarLink !== undefined) updateData.avatar_link = avatarLink;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        try {
            await sequelize.transaction(async (transaction) => {
                // Get user
                const user = await User.findOne({ where: { id }, transaction });
                if (!user) return res.status(404).send('User not found');

                // Update user
                const [rowsAffected] = await User.update(updateData, { where: { id }, transaction });
                if (rowsAffected[0] === 0) return res.status(404).send('Error updating user');

                const updatedUser = await User.findOne({ where: { id }, transaction });
                if (!user) return res.status(404).send('User not found');

                return res.status(200).send(updatedUser);
            });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).send(error.message);
        }
    },

    /**
     * Retrieves a list of emails from all users who are subscribed to promotional emails.
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns The response object containing the list of subscribers email addresses.
     */
    getPromoEmailSubscribedUsers: async (req, res) => {
        try {
            // Wrapping the query in sequelize.transaction ensures "all or nothing" integrity
            // If any part of the transaction fails, then sequelize will roll back, preserving
            // the data before the changes are made.
            await sequelize.transaction(async (transaction) => {
                // Fetch all users objects that matches the query 
                const users = await User.findAll({
                    // Find all users where there email promo status = 1 (subscribed)
                    where: { email_promo_status_id: 1 }, transaction
                });

                // If there are no users that is subscribed
                if (!users || users.length === 0) {
                    return res.status(404).send('No promo email subscribers found.');
                }
                // Extract email addresses from the user objects
                const emails = users.map(user => user.email);
                // Return an array of emails in the response body 
                return res.status(200).json(emails);
            });
        } catch (error) {
            console.error("Error in fetching emails:", error);
            return res.status(500).send(error.message);
        }
    },

    deleteUser: async (req, res) => {
        const id = req?.params.id;
        if (!id) return res.status(400).json('Missing user id');

        try {
            await sequelize.transaction(async (transaction) => {
                const rowsAffected = await User.deleteUser({ id }, transaction);
                if (rowsAffected[0] === 0) return res.status(404).send('User not found');
                return res.status(201).send('Account deleted successfully');
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    updatePassword: async (req, res) => {
        const id = req?.params.id;
        if (!id) return res.status(400).json('Missing user id');

        let { currentPassword, newPassword } = req?.body;
        if (!currentPassword || !newPassword) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const user = await User.findOne({ where: { id }, transaction });
                if (!user) return res.status(404).send('User not found');
                const isMatch = await bcrypt.compare(currentPassword, user.password);
                if (!isMatch) return res.status(401).send('Old password does not match current password');

                const rowsAffected = await User.updateUser(
                    id,
                    { password: await bcrypt.hash(newPassword, 8) },
                    { fields: ['password'] },
                    { individualHooks: true },
                    transaction);
                if (rowsAffected[0] === 0) return res.status(404).send('User not found');
                return res.status(201).send('Password updated successfully');
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

};

module.exports = UsersController;