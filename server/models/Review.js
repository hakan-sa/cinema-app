const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Review extends Model {

    static async getReviewsByMovieId(movieId) {
        return await this.findAll({ where: { movie_id: movieId } });
    }

    static async getReview(id) {
        return await this.findOne({ where: { id } });
    }

    static async createReview(reviewData) {
        return await this.create(reviewData);
    }

    static async updateReview(id, reviewData) {
        return await this.update(reviewData, { where: { id } });
    }

    static async deleteReview(id) {
        return await this.destroy({ where: { id } });
    }

}

Review.init({
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 10
        },
        allowNull: true
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    avatar_link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false
});

module.exports = Review;