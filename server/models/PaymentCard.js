const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { hash } = require('bcrypt');
const saltRounds = 8;

class PaymentCard extends Model {

    static async createPaymentCard(paymentCardData) {
        return await this.create(paymentCardData);
    }

    static async updatePaymentCard(id, paymentCardData) {
        return await this.update(paymentCardData, { where: { id } });
    }

    static async deletePaymentCard(id) {
        return await this.destroy({ where: { id } });
    }

}

PaymentCard.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    card_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    billing_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'BillingAddress',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'PaymentCard',
    tableName: 'payment_cards',
    timestamps: false,
});

module.exports = PaymentCard;