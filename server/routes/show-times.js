const { Router } = require('express');
const ShowTimesController = require('../controllers/ShowTimesController');
const router = Router();

router.get('/', ShowTimesController.getAllShowTimes);

module.exports = router;
