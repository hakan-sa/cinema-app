const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Producer extends Model {

    static async getProducer(id) {
        return await this.findOne({ where: { id } });
    }

}

Producer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    producer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Producer',
    tableName: 'producers',
    timestamps: false
});

module.exports = Producer;