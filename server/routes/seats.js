const { Router } = require('express');
const router = Router();
const {createSeatAvailability, getAllSeatsByShowId, markSeatAsBooked} = require('../controllers/SeatsController');

router.route('/create-availability').post(createSeatAvailability);
router.route('/book').patch(markSeatAsBooked);
router.route('/:showId').get(getAllSeatsByShowId);


module.exports = router;
