
const { Router } = require('express');
const router = Router();
const ShowroomsController = require('../controllers/ShowroomsController');

router.get('/', ShowroomsController.getAllShowrooms);

module.exports = router;
