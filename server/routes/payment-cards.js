const { Router } = require('express');
const router = Router();
const {
	createPaymentCard,
	getPaymentCard,
	getPaymentCards,
	updatePaymentCard,
	deletePaymentCard
} = require('../controllers/PaymentCardsController');

router.route('/get-all/:userId').get(getPaymentCards);
router.route('/:userId').post(createPaymentCard);

router.route('/:cardId')
	.get(getPaymentCard)
	.put(updatePaymentCard)
	.delete(deletePaymentCard);

module.exports = router;