const sequelize = require('../config/database');
const { Showroom } = require('../models/index.js');

const ShowroomsController = {
    getAllShowrooms: async (req, res) => {
        try {
            await sequelize.transaction(async (transaction) => {
                const showrooms = await Showroom.findAll();
                transaction

                if (!showrooms) return res.status(404).send('Showrooms not found');
                return res.status(200).json(showrooms);
            })
        } catch (error) {
            console.error('Failed to retrieve show rooms:', error);
            return res.status(500).send(error.message);
        }
    },
};

module.exports = ShowroomsController;
