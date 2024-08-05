const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class BillingAddress extends Model {

    static async getBillingAddress(id) {
        return await this.findOne({ where: { user_id: id } });
    }

    static async createBillingAddress(billingData) {
        return await this.create(billingData);
    }

    static async updateBillingAddress(id, billingData) {
        return await this.update(billingData, { where: { id } });
    }

    static async deleteBillingAddress(id) {
        return await this.destroy({ where: { id } });
    }

}

BillingAddress.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    modelName: 'BillingAddress',
    tableName: 'billing_addresses',
    timestamps: false
});

module.exports = BillingAddress;
