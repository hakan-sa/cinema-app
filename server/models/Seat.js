const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Seat extends Model {
    static async getSeat(id) {
        return await this.findOne({ where: { id } });
    }
}

Seat.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    showroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Showroom',
            key: 'id'
        }
    },
    seat_number: {
        type: DataTypes.STRING(4),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Seat',
    tableName: 'seats',
    timestamps: false
});

module.exports = Seat;
