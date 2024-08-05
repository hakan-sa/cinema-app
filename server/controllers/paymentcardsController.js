const sequelize = require('../config/database.js');

const { PaymentCard, BillingAddress, PaymentCardJunction } = require('../models/index.js');

const PaymentCardsController = {

    createPaymentCard: async (req, res) => {
        const userId = req?.params.userId;
        const { cardNumber, firstName, lastName, city, state, street, zipCode, expirationDate } = req.body;

        // Validate all required fields
        if (!userId || !cardNumber || !firstName || !lastName || !city || !state || !street || !zipCode || !expirationDate) {
            return res.status(400).json('Missing required parameters');
        }

        try {
            await sequelize.transaction(async (transaction) => {
                // Check if user has a maximum of 3 cards
                const paymentCardCount = await PaymentCardJunction.countPaymentCards(userId);

                if (paymentCardCount >= 3) {
                    return res.status(403).json('Maximum number of payment cards already added');
                }

                // Parse expirationDate from JSON
                const [month, year] = expirationDate.split('/');
                const parsedExpirationDate = new Date(`20${year}`, month - 1);

                const billingAddress = await BillingAddress.create({
                    city, state, street, zip_code: zipCode
                }, { transaction });
                if (!billingAddress) return res.status(500).json('Failed to create billing address');

                // Create payment card with the billing address
                const paymentCard = await PaymentCard.create({
                    customer_id: userId,
                    card_number: cardNumber,
                    expiration_date: parsedExpirationDate,
                    first_name: firstName,
                    last_name: lastName,
                    billing_address_id: billingAddress.id
                }, { transaction });
                if (!paymentCard) return res.status(500).json('Failed to create payment card');

                // Link to payment card junction
                const paymentCardJunction = await PaymentCardJunction.create({
                    user_id: userId,
                    payment_card_id: paymentCard.id
                }, { transaction });
                if (!paymentCardJunction) return res.status(500).json('Failed to create payment card junction');

                return res.status(201).json(paymentCard);
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },


    getPaymentCard: async (req, res) => {
        const cardId = req?.params?.cardId;
        if (!cardId) return res.status(400).json('Missing required parameters');

        try {
            sequelize.transaction(async (transaction) => {
                // Get payment card
                const paymentCard = await PaymentCard.findOne({
                    where: { cardId },
                    include: [{ model: BillingAddress, as: 'billingAddress' }]
                }, { transaction });
                if (!paymentCard) return res.status(404).json('Payment card not found');

                return res.status(200).json(paymentCard);
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    getPaymentCards: async (req, res) => {
        const userId = req?.params?.userId;
        if (!userId) return res.status(400).json('Missing required parameter: userId');

        try {
            const paymentCards = await sequelize.transaction(async (transaction) => {
                const paymentCards = await PaymentCardJunction.findAll({
                    where: { user_id: userId },
                    include: [{
                        model: PaymentCard,
                        as: 'paymentCard',
                        include: [{
                            model: BillingAddress,
                            as: 'billingAddress'
                        }]
                    }],
                    transaction
                });

                if (!paymentCards || paymentCards.length === 0) {
                    throw new Error('Payment cards not found');
                }

                return paymentCards;
            });

            return res.status(200).json(paymentCards);
        } catch (error) {
            console.error(error.message);
            const status = error.message === 'Payment cards not found' ? 204 : 500;
            return res.status(status).json(error.message);
        }
    },

    updatePaymentCard: async (req, res) => {
        const cardId = req?.params.cardId;
        if (!cardId) return res.status(400).json('Missing required parameters');

        const { cardNumber, firstName, lastName, expirationDate, city, state, street, zipCode } = req?.body;

        try {
            await sequelize.transaction(async (transaction) => {
                // Get payment card
                const paymentCard = await PaymentCard.getCard(cardId);
                if (!paymentCard) return res.status(404).json('Payment card not found');
                let rowsAffected = null;

                // Update payment card
                if (cardNumber || firstName || lastName || expirationDate) {
                    rowsAffected = await PaymentCard.updatePaymentCard(
                        { cardId }, {
                        card_number: cardNumber || paymentCard.card_number,
                        first_name: firstName || paymentCard.first_name,
                        last_name: lastName || paymentCard.last_name,
                        expiration_date: expirationDate ?
                            new Date(`20${expirationDate.split('/')[1]}`, expirationDate.split('/')[0] - 1)
                            : paymentCard.expiration_date
                    }, { transaction });
                    if (rowsAffected[0] === 0) return res.status(404).json('Payment card failed to update');
                }

                // Update billing address
                if (city || state || street || zipCode) {
                    const billingAddress = await BillingAddress.getBillingAddress(paymentCard.billing_address_id);
                    if (!billingAddress) return res.status(404).json('Billing address not found');
                    rowsAffected = await BillingAddress.updateBillingAddress(
                        { id: billingAddress.id }, {
                        city: city || billingAddress.city,
                        state: state || billingAddress.state,
                        street: street || billingAddress.street,
                        zip_code: zipCode || billingAddress.zip_code
                    }, { transaction });
                    if (rowsAffected[0] === 0) return res.status(500).json('Billing address failed to update');
                }

                return res.status(200).json('Payment card and/or billing address updated successfully');
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    deletePaymentCard: async (req, res) => {
        const cardId = req.params.cardId;

        if (!cardId) {
            return res.status(400).json('Missing required parameter: cardId');
        }

        try {
            await sequelize.transaction(async (transaction) => {
                // // Delete junction
                // await PaymentCardJunction.destroy({
                //     where: { payment_card_id: cardId },
                //     transaction
                // });

                // Delete Card
                await PaymentCard.destroy({
                    where: { id: cardId },
                    transaction
                });

                return res.status(200).json('Payment card and associated data deleted successfully');
            });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

};

module.exports = PaymentCardsController;