const sequelize = require('../config/database');
const { ShowTime } = require('../models');

const ShowTimesController = {
    getAllShowTimes: async (req, res) => {
        try {
            const showTimes = await ShowTime.findAll(); 
            res.json(showTimes);
        } catch (error) {
            console.error('Failed to retrieve show times:', error);
            res.status(500).json({ message: 'Failed to retrieve show times', error: error.message });
        }
    }
};

module.exports = ShowTimesController;
