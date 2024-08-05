const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserAddress extends Model {

    static async getUserAddress(id) {
        return this.findOne({ where: { user_id: id } });
    }

    static async createUserAddress(userAddressData) {
        return await this.create(userAddressData);
    }

    static async updateUserAddress(id, userAddressData) {
        return await this.update(userAddressData, { where: { user_id: id } });
    }

    static async deleteUserAddress(id) {
        return await this.destroy({ where: { user_id: id } });
    }

}

UserAddress.init({
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
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'user_addresses',
    timestamps: false
});

module.exports = UserAddress;