const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserStatus extends Model {

    static async getStatus(id) {
        const userStatus = await this.findByPk(id);
        return userStatus ? userStatus.status : null;
    }

}

UserStatus.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserStatus',
    tableName: 'user_statuses',
    timestamps: false
});

module.exports = UserStatus;