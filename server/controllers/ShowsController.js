const sequelize = require('../config/database.js');
const { Show, Seat, Movie, Showroom, ShowTime } = require('../models/index.js');

const ShowsController = {
    createShow: async (req, res) => {
        const { movieId, showroomId, showDate, showTimesId } = req.body;

        if (!movieId || !showroomId || !showTimesId || !showDate) {
            console.log("Missing parameters");
            return res.status(400).json('Missing required parameters');
        }

        console.log("Querying with", showroomId, showDate, showTimesId);

        let transaction = await sequelize.transaction();

        try {
            let existingShows = null;
            existingShows = await Show.findAll({
                where: {
                    showroom_id: showroomId,
                    show_date: showDate + 'T00:00:00.000Z',
                    show_times_id: showTimesId
                }
            });

            console.log(existingShows);

            if (existingShows.length > 0) {
                return res.status(409).json('Show already exists at this same room, time, or date');
            }

            let show = null;
            show = await Show.create({
                movie_id: movieId,
                showroom_id: showroomId,
                show_date: showDate,
                show_times_id: showTimesId
            })

            console.log("Created show", show);

            await transaction.commit();
            return res.status(201).json(show);
        } catch (error) {
            console.log(error.message);
            if (transaction) await transaction.rollback();
            return res.status(500).send(error.message);
        }
    },

    deleteShow: async (req, res) => {
        const showId = req.params.showId;

        if (!showId) {
            console.log("Missing show ID parameter");
            return res.status(400).json('Missing show ID parameter');
        }

        let transaction = await sequelize.transaction();

        try {
            const show = await Show.findByPk(showId);
            if (!show) {
                console.log("Show not found");
                return res.status(404).json('Show not found');
            }

            console.log("Deleting show...");
            await show.destroy();

            await transaction.commit();
            return res.status(200).json('Show deleted successfully');
        } catch (error) {
            console.error(error.message);
            if (transaction) await transaction.rollback();
            return res.status(500).send(error.message);
        }
    },

    getAllShowsByMovieId: async (req, res) => {
        const movieId = req.params.movieId;

        if (!movieId) {
            console.log("Missing movieId parameter");
            return res.status(400).json('Missing required movieId parameter');
        }

        try {
            console.log("Fetching shows for movieId:", movieId);
            const shows = await Show.findAll({
                where: { movie_id: movieId },
                include: [
                    { model: Showroom, as: 'showroom' },
                    { model: ShowTime, as: 'showTime' }
                ]
            });

            if (shows.length > 0) {
                console.log("Shows found:", shows.length);
                return res.status(200).json(shows);
            } else {
                console.log("No shows found for the movieId:", movieId);
                return res.status(404).json('No shows found for the specified movieId');
            }
        } catch (error) {
            console.log("Error fetching shows:", error.message);
            return res.status(500).send('Error fetching shows: ' + error.message);
        }
    },

};

module.exports = ShowsController;

