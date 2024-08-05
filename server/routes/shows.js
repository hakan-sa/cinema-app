const { Router } = require('express');
const router = Router();
const {createShow, deleteShow, getAllShowsByMovieId} = require('../controllers/ShowsController');

router.route('/movies/:movieId').get(getAllShowsByMovieId);
router.route('/:showId').delete(deleteShow);
router.route('/').post(createShow);

module.exports = router;
