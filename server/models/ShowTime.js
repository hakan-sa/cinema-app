const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ShowTime extends Model {

    static async getShowTime(id) {
        return await this.findOne({ where: { id } });
    }

}

ShowTime.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    show_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ShowTime',
    tableName: 'show_times',
    timestamps: false
});

module.exports = ShowTime;