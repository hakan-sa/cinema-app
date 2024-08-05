const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Cast extends Model {

    static async getCast(id) {
        return await this.findOne({ where: { id } });
    }

}

Cast.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cast_member: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Cast',
    tableName: 'casts',
    timestamps: false
});

module.exports = Cast;