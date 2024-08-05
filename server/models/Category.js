const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {

    static async getCategory(id) {
        return await this.findOne({ where: { id } });
    }

}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;