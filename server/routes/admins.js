const { Router } = require('express');
const router = Router();
const { createPromotion, getPromotions, deletePromotion } = require('../controllers/AdminsController');


router.route('/promotion/:id').delete(deletePromotion);
router.route('/promotion/')
    .post(createPromotion)
    .get(getPromotions)


module.exports = router;