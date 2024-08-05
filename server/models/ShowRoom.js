const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ShowRoom extends Model {

    static async getShowRooms(id) {
        return await this.findOne({ where: { id } });
    }

}

ShowRoom.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Normal', 'IMAX', 'IMAX 3D', 'Dolby', 'Dolby 3D'),
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Showroom',
    tableName: 'showrooms',
    timestamps: false
});

module.exports = ShowRoom;