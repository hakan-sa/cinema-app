const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserPromotion extends Model {

    /*
    static async getUsedPromotions(id) {
        return await this.findAll({
            where: { user_id: id },
            include: [{ model: Promotion, as: 'promotion' }]
        });
    }
    */

}

UserPromotion.init({
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
    promo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Promotion',
            key: 'id'
        }
    },
    used_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserPromotion',
    tableName: 'user_promotions',
    timestamps: false
});

module.exports = UserPromotion;