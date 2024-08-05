const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Show extends Model {
    static async getShow(id) {
        return await this.findOne({ where: { id } });
    }
}

Show.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Movie',
            key: 'id'
        }
    },
    showroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ShowRoom',
            key: 'id'
        }
    },
    show_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    show_times_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ShowTime',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Show',
    tableName: 'shows',
    timestamps: false
});

module.exports = Show;
