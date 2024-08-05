const sequelize = require('../config/database.js');
const { Op } = require('sequelize');

const { Movie, Category, Cast, Director, Producer, Review, FilmRating } = require('../models/index.js');

const MoviesController = {

    createMovie: async (req, res) => {
        console.log("Received request: ", req.body);

        const {
            tmdbId, title, trailerLink, posterLink, duration, releaseDate, synopsis, filmRatingId, categories, castMembers, directors, producers, rating, reviews
        } = req.body;

        if (!title || !trailerLink || !posterLink || !releaseDate || !synopsis || !filmRatingId || !categories || !castMembers || !directors || !producers) {
            return res.status(400).json('Missing required parameters');
        }

        let transaction;

        try {
            transaction = await sequelize.transaction();
            // Create movie
            let movie = null;
            console.log("Creating movie");
            movie = await Movie.create({
                id: tmdbId, title, trailer_link: trailerLink, poster_link: posterLink, duration, release_date: releaseDate,
                synopsis, filmrating_id: filmRatingId, rating
            }, { transaction });
            if (!movie) return res.status(500).send('Failed to create movie');
            console.log("Movie created: ", movie);

            // Link movie categories
            const foundCategories = await Category.findAll({ where: { genre: categories } }, { transaction });
            console.log("Categories Result: ", foundCategories);
            const foundCategoryIds = foundCategories.map((category) => category.id);
            await movie.setCategories(foundCategoryIds, { transaction });
            console.log("Categories added: ", movie);

            // Create and link movie cast members
            const foundCastMembers = await Promise.all(castMembers.map(async (castMember) => {
                let foundCastMember = await Cast.findOne({ where: { cast_member: castMember } }, { transaction });
                if (!foundCastMember) {
                    foundCastMember = await Cast.create({ cast_member: castMember }, { transaction });
                }
                return foundCastMember;
            })).catch(error => { throw error; });
            await movie.setCastMembers(foundCastMembers, { transaction });
            console.log("Casts added: ", foundCastMembers);

            // Create and link movie directors
            const foundDirectors = await Promise.all(directors.map(async (director) => {
                let foundDirector = await Director.findOne({ where: { director_name: director } }, { transaction });
                if (!foundDirector) {
                    foundDirector = await Director.create({ director_name: director }, { transaction });
                }
                return foundDirector;
            })).catch(error => { throw error; });
            await movie.setDirectors(foundDirectors, { transaction });
            console.log("Directors added: ", foundDirectors);

            // Create and link movie producers
            const foundProducers = await Promise.all(producers.map(async (producer) => {
                let foundProducer = await Producer.findOne({ where: { producer_name: producer } }, { transaction });
                if (!foundProducer) {
                    foundProducer = await Producer.create({ producer_name: producer }, { transaction });
                }
                return foundProducer;
            })).catch(error => { throw error; });
            await movie.setProducers(foundProducers, { transaction });
            console.log("Producers added: ", foundProducers);

            // Create and link movie reviews
            if (reviews && reviews.length > 0) {
                for (const review of reviews) {
                    await Review.create({
                        author: review.author,
                        rating: review.rating,
                        content: review.content,
                        avatar_link: review.avatar_link,
                        movie_id: movie.id
                    }, { transaction });
                }
            }

            await transaction.commit();
            return res.status(201).json(movie);
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.log(error.message);
            return res.status(500).send(error.message);
        }
    },

    getComingSoonMovies: async (req, res) => {
        try {
            console.info("Fetching coming soon movies...");
            const movies = await Movie.findAll({
                where: { release_date: { [Op.gt]: new Date() } },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    { model: Category, through: { attributes: [] }, as: 'categories' },
                    { model: Cast, through: { attributes: [] }, as: 'castMembers' },
                    { model: Director, through: { attributes: [] }, as: 'directors' },
                    { model: Producer, through: { attributes: [] }, as: 'producers' },
                    { model: Review, as: 'reviews' }
                ],
                order: [['release_date', 'ASC']]
            });
            if (movies.length === 0) return res.status(404).send('No coming soon movies found');
            if (!movies) return res.status(500).send('Failed to get coming soon movies');
            return res.status(200).json(movies);
        } catch (error) {
            return res.status(500).json("Failed to get coming soon movies");
        }
    },

    getFeaturedMovies: async (req, res) => {
        try {
            console.info("Fetching featured movies...");
            const movies = await Movie.findAll({
                where: { release_date: { [Op.lte]: new Date() } },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    { model: Category, through: { attributes: [] }, as: 'categories' },
                ],
                order: [['release_date', 'DESC']],
            });

            if (!movies) return res.status(500).send('Failed to get featured movies');
            if (movies.length === 0) return res.status(404).send('No featured movies found');

            return res.status(200).json(movies);

        } catch (error) {
            console.error("Error fetching featured movies:", error);
            return res.status(500).json("Failed to get featured movies");
        }
    },

    getMovie: async (req, res) => {
        const id = req.params.id;
        if (!id) return res.status(400).send('Please provide a movie id');

        try {
            console.info("Fetching movie...");
            await sequelize.transaction(async ({ transaction }) => {
                const movie = await Movie.findOne({
                    where: { id },
                    include: [
                        { model: FilmRating, as: 'filmRating' },
                        { model: Category, through: { attributes: [] }, as: 'categories' },
                        { model: Cast, through: { attributes: [] }, as: 'castMembers' },
                        { model: Director, through: { attributes: [] }, as: 'directors' },
                        { model: Producer, through: { attributes: [] }, as: 'producers' },
                        { model: Review, as: 'reviews' }
                    ], transaction
                });
                if (!movie) {
                    console.log("No movie found with ID:", id);
                    return res.status(404).send('Movie not found');
                }
                return res.status(200).json(movie);
            });
        } catch (error) {
            console.error("Error fetching movie:", error.message);
            return res.status(500).send('Error fetching movie: ' + error.message);
        }
    },

    getMovieByCategory: async (req, res) => {
        const category = req.params.category;
        if (!category) return res.status(400).send('Please provide a category for search');

        try {
            console.info("Fetching movies by category...");
            const movies = await Movie.findAll({
                where: { '$categories.genre$': { [Op.like]: `%${category}%` } },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    {
                        model: Category,
                        as: 'categories',
                        attributes: [],
                        through: { attributes: [] }
                    }
                ]
            });
            return res.status(200).json(movies);
        } catch (error) {
            console.error('Failed to retrieve movies:', error);
            return res.status(500).json(error.message);
        }
    },

    getAllMovies: async (req, res) => {
        try {
            const movies = await Movie.findAll();
            return res.status(200).json(movies);
        } catch (error) {
            console.error('Failed to retrieve movies:', error);
            return res.status(500).json(error.message);
        }
    },

    searchMovie: async (req, res) => {
        const { query } = req.query;
        if (!query) return res.status(400).send('Please provide a query for search');
        if (query.length < 2) return res.status(400).send('Please provide a longer query to search for');
        try {
            const movies = await Movie.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { '$categories.genre$': { [Op.like]: `%${query}%` } }
                    ]
                },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    {
                        model: Category,
                        as: 'categories',
                        attributes: [],
                        through: { attributes: [] }
                    }
                ]
            });
            if (!movies) return res.status(500).send('Failed to search movies');
            if (movies.length === 0) return res.status(204).send('No movies found');
            return res.status(200).json(movies);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    searchSuggestions: async (req, res) => {
        const { query } = req.query;
        if (!query) return res.status(400).send('Please provide a query for search suggestions');
        if (query.length < 2) return res.status(400).send('Please provide a longer query to search for');
        try {
            const movies = await Movie.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${query}%` } },
                        { '$categories.genre$': { [Op.like]: `%${query}%` } }
                    ]
                },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    {
                        model: Category,
                        as: 'categories',
                        attributes: [],
                        through: { attributes: [] }
                    }
                ]
            });
            if (!movies) return res.status(500).send('Failed to search suggestions');
            if (movies.length === 0) return res.status(404).send('No search suggestions found');
            return res.status(200).json(movies);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    updateMovie: async (req, res) => {
        const id = req.params.id;
        if (!id) return res.status(400).send('Please provide a movie id to update');

        const {
            title, trailerLink, posterLink, duration, releaseDate, synopsis, rating, filmRatingId, categories, castMembers, directors, producers, reviews
        } = req.body;

        if (!title && !trailerLink && !posterLink && !duration && !releaseDate && !synopsis && !filmRatingId && !categories && !castMembers && !directors && !producers && !reviews) {
            return res.status(400).send('Please provide at least one field to update');
        }

        let transaction;

        try {
            transaction = await sequelize.transaction();
            // Get movie
            const movie = await Movie.findOne({
                where: { id },
                include: [
                    { model: FilmRating, as: 'filmRating' },
                    { model: Category, through: { attributes: [] }, as: 'categories' },
                    { model: Cast, through: { attributes: [] }, as: 'castMembers' },
                    { model: Director, through: { attributes: [] }, as: 'directors' },
                    { model: Producer, through: { attributes: [] }, as: 'producers' },
                    { model: Review, as: 'reviews' }
                ]
            }, { transaction });

            // Update movie
            if (movie) {
                const updateData = {
                    title: title || movie.title,
                    trailer_link: trailerLink || movie.trailer_link,
                    poster_link: posterLink || movie.poster_link,
                    duration: duration || movie.duration,
                    release_date: releaseDate || movie.release_date,
                    synopsis: synopsis || movie.synopsis,
                    rating: rating || movie.rating,
                    filmrating_id: filmRatingId || movie.filmrating_id
                };

                const result = await movie.update(updateData, { transaction });
                if (result) {
                    console.log('Update successful:', result);
                } else {
                    return res.status(301).send('Movie failed to update');
                }
            } else {
                return res.status(404).send('Movie not found');
            }

            // Update categories
            if (categories) {
                const foundCategories = await Category.findAll({ where: { genre: categories } }, { transaction });
                const foundCategoryIds = foundCategories.map((category) => category.id);
                await movie.setCategories(foundCategoryIds, { transaction });
            }

            // Update cast members
            if (castMembers) {
                const foundCastMembers = await Promise.all(castMembers.map(async (castMember) => {
                    let foundCastMember = await Cast.findOne({ where: { cast_member: castMember } }, { transaction });
                    if (!foundCastMember) {
                        foundCastMember = await Cast.create({ cast_member: castMember }, { transaction });
                    }
                    return foundCastMember;
                }));
                await movie.setCastMembers(foundCastMembers, { transaction });
            }

            // Update directors
            if (directors) {
                const foundDirectors = await Promise.all(directors.map(async (director) => {
                    director = await Director.findOne({ where: { director_name: director } }, { transaction });
                    if (!director) {
                        director = await Director.create({ director_name: director }, { transaction });
                    }
                    return director;
                }));
                await movie.setDirectors(foundDirectors, { transaction });
            }

            // Update producers
            if (producers) {
                const producerInstance = await Promise.all(producers.map(async (producer) => {
                    producer = await Producer.findOne({ where: { producer_name: producer } }, { transaction });
                    if (!producer) {
                        producer = await Producer.create({ producer_name: producer }, { transaction });
                    }
                    return producer;
                }));
                await movie.setProducers(producerInstance, { transaction });
            }

            if (reviews) {
                for (const review of reviews) {
                    if (review.id) {
                        // Try to find the review by ID
                        const existingReview = await Review.findOne({
                            where: { id: review.id, movie_id: movie.id },
                            transaction: transaction
                        });

                        if (existingReview) {
                            // Update the existing review
                            await existingReview.update(review, { transaction: transaction });
                        } else {
                            // Log if the review ID is given but no corresponding review is found
                            console.error('No existing review found with ID:', review.id);
                        }
                    }
                }
            }

            await transaction.commit();
            return res.status(201).send('Movie updated successfully');
        } catch (error) {
            console.error(error.message);
            if (transaction) await transaction.rollback();
            return res.status(500).json(error.message);
        }
    }

};

module.exports = MoviesController;