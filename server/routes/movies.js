const { Router } = require('express');
const router = Router();
const {
    getAllMovies, createMovie, getComingSoonMovies, getFeaturedMovies, getMovie,
    getMovieByCategory, updateMovie, searchMovie, searchSuggestions
} = require('../controllers/MoviesController');

router.route('/').get(getAllMovies);
router.route('/add-movie').post(createMovie)

router.route('/coming-soon').get(getComingSoonMovies);
router.route('/featured').get(getFeaturedMovies);

router.route('/search').get(searchMovie);
router.route('/search-suggestions').get(searchSuggestions);

router.route('/category/:category').get(getMovieByCategory);

router.route('/:id')
    .get(getMovie)
    .put(updateMovie);


module.exports = router;