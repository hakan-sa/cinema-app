const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class EmailPromoStatus extends Model {

    static async getEmailPromoStatus(id) {
        const emailPromoStatus = await this.findByPk(id);
        return emailPromoStatus ? emailPromoStatus.status : null;
    }

}

EmailPromoStatus.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(3),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'EmailPromoStatus',
    tableName: 'promo_statuses',
    timestamps: false
});

module.exports = EmailPromoStatus;