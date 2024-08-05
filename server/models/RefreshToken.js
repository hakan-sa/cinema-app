const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class RefreshToken extends Model {

    static async createRefreshToken(refreshTokenData) {
        return await this.create(refreshTokenData);
    }

    static async updateRefreshToken(id, refreshTokenData) {
        return await this.update(refreshTokenData, { where: { id } });
    }

    static async deleteRefreshToken(id) {
        return await this.destroy({ where: { id } });
    }

}

RefreshToken.init({
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
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = RefreshToken;