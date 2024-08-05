const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Director extends Model {

    static async getDirector(id) {
        return await this.findOne({ where: { id } });
    }

}

Director.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    director_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Director',
    tableName: 'directors',
    timestamps: false
});

module.exports = Director;