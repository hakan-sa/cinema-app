const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Clearance extends Model {

    static async getClearance(id) {
        const clearance = await this.findByPk(id);
        return clearance ? clearance.role : null;
    }

}

Clearance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Clearance',
    tableName: 'clearances',
    timestamps: false
});

module.exports = Clearance;