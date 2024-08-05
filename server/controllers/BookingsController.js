const sequelize = require('../config/database.js');
const { Op } = require('sequelize');

const { Booking, Ticket, TicketPrice, Promotion } = require('../models/index.js');

const BookingsController = {
    getTicketPrices : async (req, res) => {
        try {
            const ticketPrices = await TicketPrice.findAll();

            if (ticketPrices.length === 0 ) {
                return res.status(404).json("No ticket pricing available");
            }
            return res.status(200).json(ticketPrices);
        } catch (error) {
            console.error('Error fetching ticket prices:', error);
            return res.status(500).send('Error fetching ticket prices: ' + error.message);
        }
    },

    
    applyPromoCode: async (req, res) => {
        const { promoCode } = req.body;
        try {
            const promo = await Promotion.findOne({ 
                where: {
                    promo_code: promoCode,
                    end_date: { [Op.gte]: new Date() }
                }
            });

            if (!promo) {
                return res.status(404).json({ message: "Invalid or expired promo code." });
            }

            return res.status(200).json({ discount: promo.discount });
        } catch (error) {
            console.error('Error applying promo code:', error);
            return res.status(500).send('Error applying promo code: ' + error.message);
        }
    },

    createBooking: async(req, res) => {
        const {userId, totalPrice, paymentCardId} = req.body;

        if (!userId || !totalPrice || !paymentCardId) {
            return res.status(400).json('Missing required parameters');
        }

        let transaction;
        try {
            transaction = await sequelize.transaction();
            let booking = null;
            booking = await Booking.create({
                user_id: userId,
                total_price: totalPrice,
                payment_card_id: paymentCardId
            }, {transaction});

            if (!booking) return res.status(500).send('Failed to create booking');
            
            await transaction.commit();
            return res.status(201).json(booking);
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.log(error.message);
            return res.status(500).send(error.message);
        }
    },

    getUserBookingHistory: async (req, res) => {
        try {
            const userId = req.params.userId;
            const bookings = await Booking.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });
            res.json(bookings);
        } catch (error) {
            console.error('Failed to retrieve bookings:', error);
            res.status(500).send('Server error');
        }
    },

    getTicketsForBookingHistory: async (req, res) => {
        try {
            const bookingId = req.params.bookingId;
            const tickets = await Ticket.findAll({
                where: { booking_id: bookingId },
                include: [{ all: true }] 
            });
            res.json(tickets);
        } catch (error) {
            console.error('Failed to retrieve tickets:', error);
            res.status(500).send('Server error');
        }
    },

    createTicket: async (req, res) => {
        const { movieId, userId, bookingId, showroomId, showDate, showTimeId, seatId, ticketPricesId, showId} = req.body;
        if (!movieId || !userId || !bookingId || !showroomId || !showDate || !showTimeId || !seatId || !ticketPricesId || !showId) {
            console.log('Missing parameters!');
            console.log({
                movieId: movieId,
                userId: userId,
                bookingId: bookingId,
                showroomId: showroomId,
                showDate: showDate,
                showTimeId: showTimeId,
                seatId: seatId,
                ticketPricesId: ticketPricesId,
                showId: showId
            });
            return res.status(400).json('Missing required parameters');
        }

        console.log('Parameters OK');

        let transaction;

        try {
            transaction = await sequelize.transaction();

            let ticket = null;
            ticket = await Ticket.create({
                movie_id: movieId,
                user_id: userId,
                booking_id: bookingId,
                showroom_id: showroomId,
                show_date: showDate,
                show_time_id: showTimeId,
                seat_id: seatId,
                ticket_prices_id: ticketPricesId,
                show_id: showId
            })

            await transaction.commit();
            return res.status(201).json(ticket);
        } catch (error) {
            if (transaction) await transaction.rollback();
            console.log(error.message);
            return res.status(500).send(error.message);
        }
    }

};

module.exports = BookingsController;