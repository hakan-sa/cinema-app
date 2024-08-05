const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class PaymentCardJunction extends Model {

    static async createPaymentCardJunction(paymentCardJunctionData) {
        return await this.create(paymentCardJunctionData);
    }

    static async countPaymentCards(userId) {
        return await this.count({
            where: { user_id: userId }
        });
    }

}

PaymentCardJunction.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        },
        primaryKey: true
    },
    payment_card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PaymentCard',
            key: 'id'
        },
        primaryKey: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'PaymentCardJunction',
    tableName: 'payment_cards_junction',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = PaymentCardJunction;