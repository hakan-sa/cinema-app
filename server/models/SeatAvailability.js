const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SeatAvailability extends Model {


}

SeatAvailability.init({
    show_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Show',
            key: 'id'
        }
    },
    seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'Seat',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('free', 'booked', 'unavailable'),
        allowNull: false
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
    modelName: 'SeatAvailability',
    tableName: 'seat_availability',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = SeatAvailability;