const cron = require('node-cron');
const { Op } = require('sequelize');
const RefreshToken = require('../models/RefreshToken');

const schedulePattern = '0 * * * *';

const tokenCleanupJob = cron.schedule(schedulePattern, async () => {
    console.log('Cleaning up expired refresh tokens...');
    try {
        const now = new Date();
        const refreshTokens = await RefreshToken.destroy({
            where: {
                expires_at: {
                    [Op.lt]: now
                }
            }
        });
        console.log(`Cleaned up ${refreshTokens} expired refresh tokens`);
    } catch (error) {
        console.error(error);
    }
}, {
    scheduled: true,
    timezone: 'America/New_York'
});

module.exports = tokenCleanupJob;