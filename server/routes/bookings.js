const { Router } = require('express');
const router = Router();
const { getTicketPrices, createTicket, createBooking, applyPromoCode, getUserBookingHistory, getTicketsForBookingHistory } = require('../controllers/BookingsController');

router.route('/ticket-prices').get(getTicketPrices);
router.route('/tickets').post(createTicket);
router.route('/tickets/:bookingId').get(getTicketsForBookingHistory);
router.route('/apply-promo').post(applyPromoCode);
router.route('/history/:userId').get(getUserBookingHistory);
router.route('/').post(createBooking);



module.exports = router;
