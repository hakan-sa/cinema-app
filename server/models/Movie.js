const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Movie extends Model {

    static async createMovie(movieData) {
        return await this.create(movieData);
    }

    static async updateMovie(id, movieData) {
        return await this.update(movieData, { where: { id } });
    }

}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    trailer_link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    poster_link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    filmrating_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'FilmRating',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.FLOAT,
        validate: {
            min: 0,
            max: 10
        },
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Movie',
    tableName: 'movies',
    timestamps: false
});

module.exports = Movie;