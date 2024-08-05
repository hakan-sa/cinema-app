const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class FilmRating extends Model {

    static async getFilmRating(id) {
        const filmRating = await this.findByPk(id);
        return filmRating ? filmRating.rating : null;
    }

}

FilmRating.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    rating: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'FilmRating',
    tableName: 'film_ratings',
    timestamps: false
});

module.exports = FilmRating;