const sequelize = require('../config/database.js');
const { Promotion } = require('../models/index.js');

const AdminsController = {

    createPromotion: async (req, res) => {
        const { promoCode, discount, startDate, endDate } = req?.body;
        if (!promoCode || !discount || !startDate || !endDate) {
            return res.status(400).json('Missing required parameters');
        }
        try {
            await sequelize.transaction(async (transaction) => {
                const existingPromotion = await Promotion.findOne({ where: { promo_code: promoCode } });
                if (existingPromotion) {
                    return res.status(409).json('Promotion with this promo code already exists');
                }

                const promotion = await Promotion.createPromotion({
                    promo_code: promoCode,
                    discount: discount,
                    start_date: startDate,
                    end_date: endDate
                }, transaction);
                if (!promotion) return res.status(404).json('Promotion failed to create');

                return res.status(200).json(promotion);
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error.message);
        }
    },

    getPromotions: async (req, res) => {
        try {
            await sequelize.transaction(async (transaction) => {
                const promotions = await Promotion.findAll({ transaction });
    


                return res.status(200).json(promotions);
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error.message);
        }
    },

    deletePromotion: async (req, res) => {
        const { id } = req.params;
        try {
            await sequelize.transaction(async (transaction) => {
                const promotion = await Promotion.findByPk(id, { transaction });
                if (!promotion) {
                    return res.status(404).json('Promotion not found');
                }
                await promotion.destroy({ transaction });
                return res.status(200).json('Promotion deleted successfully');
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error.message);
        }
    }
}

module.exports = AdminsController;