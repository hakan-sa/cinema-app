const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Promotion extends Model {

    static async getPromotion(id) {
        return await this.findOne({ where: { id } });
    }

    static async createPromotion(promotionData) {
        return await this.create(promotionData);
    }

    static async updatePromotion(id, promotionData) {
        return await this.update(promotionData, { where: { id } });
    }

}

Promotion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    promo_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions',
    timestamps: false
});

module.exports = Promotion;