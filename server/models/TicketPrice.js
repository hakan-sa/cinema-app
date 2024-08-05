const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TicketPrice extends Model {

    static async getTicketTypePriceById(id) {
        return await this.findOne({ where: { id } });
    }

    static async getTicketPriceByType(type_name) {
        return await this.findOne({ where: { type_name } });
    }

}

TicketPrice.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type_name: {
        type: DataTypes.ENUM,
        values: ['Adult', 'Child', 'Senior'],
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TicketPrice',
    tableName: 'ticket_prices',
    timestamps: false
});

module.exports = TicketPrice;