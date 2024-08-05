const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Booking extends Model {
    static async getBooking(id) {
        return await this.findOne({ where: { id } });
    }
}

Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    payment_card_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'PaymentCard',
            key: 'id'
        },
    },
}, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: false,
    createdAt: 'created_at',
});

module.exports = Booking;
