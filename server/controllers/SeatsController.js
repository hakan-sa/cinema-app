const sequelize = require('../config/database.js');
const { Seat, SeatAvailability } = require('../models/index.js');

const SeatsController = {
    createSeatAvailability : async(req, res) => {
        console.log("Creating Seats Availability...")
        const { showId, showroomId } = req.body;

        if (!showroomId || !showId) {
            return res.status(400).json('Missing required parameters');
        }
        console.log("Parameters Ok")
    
        const transaction = await sequelize.transaction();
    
        console.log("Starting Transaction...")
        try {
            // Fetch all seats in the showroom
            const seats = await Seat.findAll({
                where: { showroom_id: showroomId },
                transaction
            });
            // Create seat availability entries for each seat
            const seatAvailabilityPromises = seats.map(seat => SeatAvailability.create({
                show_id: showId,
                seat_id: seat.id,
                status: 'free' 
            }, { transaction }));
            
    
            await Promise.all(seatAvailabilityPromises);
    
            await transaction.commit();
            console.log("Seats made available.");
            return res.status(201).json('Seat availability created successfully');
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating seat availability:', error);
            return res.status(500).send('Error creating seat availability: ' + error.message);
        }
    },
    

    getAllSeatsByShowId: async (req, res) => {
        const showId = req.params.showId;
        console.log("Fetching all seats by show id...")

        if (!showId) {
            return res.status(400).json('Missing required showId parameter');
        }

        console.log("Parameters Ok")
    
        try {
            // Fetch all seats and their availability for the given show
            const seats = await SeatAvailability.findAll({
                where: { show_id: showId },
                include: [
                    {
                        model: Seat,
                        as: 'seat',
                    }
                ]
            });
    
            if (seats.length === 0) {
                return res.status(404).json('No seats found for the specified show');
            }
            return res.status(200).json(seats);
        } catch (error) {
            console.error('Error fetching seats:', error);
            return res.status(500).send('Error fetching seats: ' + error.message);
        }
    },

    markSeatAsBooked: async (req, res) => {
        const { showId, seatId } = req.body;
    
        if (!showId || !seatId) {
            return res.status(400).json('Missing required parameters');
        }
    
        console.log("Parameters OK");
    
        try {
            const updated = await SeatAvailability.update({ status: 'booked' }, {
                where: {
                    show_id: showId,
                    seat_id: seatId
                }
            });
    
            if (updated > 0) {
                console.log("Seat marked as booked.");
                return res.status(200).json('Seat marked as booked successfully');
            } else {
                return res.status(404).json('Seat not found or already booked');
            }
        } catch (error) {
            console.error('Error marking seat as booked:', error);
            return res.status(500).send('Error marking seat as booked: ' + error.message);
        }
    },


}
module.exports = SeatsController;

