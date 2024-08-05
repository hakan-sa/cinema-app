const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const BillingAddress = require('./BillingAddress');
const Booking = require('./Booking');
const Cast = require('./Cast');
const Category = require('./Category');
const Clearance = require('./Clearance');
const Director = require('./Director');
const EmailPromoStatus = require('./EmailPromoStatus');
const FilmRating = require('./FilmRating');
const Movie = require('./Movie');
const PaymentCard = require('./PaymentCard');
const PaymentCardJunction = require('./PaymentCardJunction');
const Producer = require('./Producer');
const Promotion = require('./Promotion');
const RefreshToken = require('./RefreshToken');
const Review = require('./Review');
const Showroom = require('./Showroom');
const Seat = require('./Seat');
const ShowTime = require('./ShowTime');
const Ticket = require('./Ticket');
const TicketPrice = require('./TicketPrice');
const User = require('./User');
const UserAddress = require('./UserAddress');
const UserPromotion = require('./UserPromotion');
const UserStatus = require('./UserStatus');
const Show = require('./Show');
const SeatAvailability = require('./SeatAvailability');

// Billing Address
BillingAddress.hasOne(PaymentCard, { foreignKey: 'billing_address_id' });

// Booking
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.hasOne(Ticket, { foreignKey: 'booking_id' });

// Cast
Cast.belongsToMany(Movie, {
    through: 'casts_junction',
    timestamps: false,
    foreignKey: 'cast_id',
    otherKey: 'movie_id',
    as: 'casts'
});

// Category
Category.belongsToMany(Movie, {
    through: 'categories_junction',
    timestamps: false,
    foreignKey: 'movie_id',
    otherKey: 'category_id',
    as: 'categories'
});

// Clearance
Clearance.hasMany(User, { foreignKey: 'clearance_id', sourceKey: 'id' });

// Director
Director.belongsToMany(Movie, {
    through: 'directors_junction',
    timestamps: false,
    foreignKey: 'director_id',
    otherKey: 'movie_id',
    as: 'directors'
});

// Email Promo Status
EmailPromoStatus.hasMany(User, { foreignKey: 'email_promo_status_id', sourceKey: 'id' });

// Film Rating
FilmRating.hasMany(Movie, { foreignKey: 'filmrating_id', sourceKey: 'id' });

// Movie
Movie.belongsTo(FilmRating, { foreignKey: 'filmrating_id', as: 'filmRating' });

Movie.belongsToMany(Category, {
    through: 'categories_junction',
    timestamps: false,
    foreignKey: 'movie_id',
    otherKey: 'category_id',
    as: 'categories'
});

Movie.belongsToMany(Cast, {
    through: 'casts_junction',
    timestamps: false,
    foreignKey: 'movie_id',
    otherKey: 'cast_id',
    as: 'castMembers'
});

Movie.belongsToMany(Director, {
    through: 'directors_junction',
    timestamps: false,
    foreignKey: 'movie_id',
    otherKey: 'director_id',
    as: 'directors'
});

Movie.belongsToMany(Producer, {
    through: 'producers_junction',
    timestamps: false,
    foreignKey: 'movie_id',
    otherKey: 'producer_id',
    as: 'producers'
});

Movie.hasMany(Review, { foreignKey: 'movie_id', as: 'reviews' });
Movie.hasMany(Show, { foreignKey: 'movie_id', as: 'shows' });
Movie.hasMany(Ticket, { foreignKey: 'movie_id', as: 'tickets' });

// Payment Card
PaymentCard.belongsTo(User, { foreignKey: 'customer_id', as: 'user' });
PaymentCard.belongsTo(BillingAddress, { foreignKey: 'billing_address_id', as: 'billingAddress' });
PaymentCard.hasMany(PaymentCardJunction, { foreignKey: 'payment_card_id', as: 'paymentCard' });

// Payment Card Junction
PaymentCardJunction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PaymentCardJunction.belongsTo(PaymentCard, { foreignKey: 'payment_card_id', as: 'paymentCard' });

// Producer
Producer.belongsToMany(Movie, {
    through: 'producers_junction',
    timestamps: false,
    foreignKey: 'producer_id',
    otherKey: 'movie_id',
    as: 'producers'
});

// Promotion
Promotion.hasOne(UserPromotion, { foreignKey: 'promo_id' });

// Refresh Token
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Review
Review.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });

// Show Room
Showroom.hasMany(Seat, { foreignKey: 'showroom_id', as: 'seats' });
Showroom.hasMany(Show, { foreignKey: 'showroom_id', as: 'shows' });
Showroom.hasMany(Ticket, { foreignKey: 'showroom_id', as: 'tickets' });

// Seat
Seat.belongsTo(Showroom, { foreignKey: 'showroom_id', as: 'showroom' });
Seat.hasMany(SeatAvailability, { foreignKey: 'seat_id' });
Seat.hasMany(Ticket, { foreignKey: 'ticket', as: 'tickets' });

// Seat Availability
SeatAvailability.belongsTo(Seat, { foreignKey: 'seat_id', as: 'seat' });
SeatAvailability.belongsTo(Show, { foreignKey: 'show_id', as: 'show' });

// Show
Show.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });
Show.belongsTo(Showroom, { foreignKey: 'showroom_id', as: 'showroom' });
Show.belongsTo(ShowTime, { foreignKey: 'show_times_id', as: 'showTime' });
Show.hasMany(SeatAvailability, { foreignKey: 'show_id' });
Show.hasMany(Ticket, { foreignKey: 'show_id', as: 'tickets' });


// Show Time
ShowTime.hasMany(Show, { foreignKey: 'show_times_id' });
ShowTime.hasMany(Ticket, { foreignKey: 'show_times_id' });

// Ticket
Ticket.belongsTo(Booking, { foreignKey: 'booking_id', sourceKey: 'id' });
Ticket.belongsTo(TicketPrice, { foreignKey: 'type_id', sourceKey: 'id' });
Ticket.belongsTo(Movie, { foreignKey: 'movie_id' });
Ticket.belongsTo(User, { foreignKey: 'user_id' });
Ticket.belongsTo(Showroom, { foreignKey: 'showroom_id' });
Ticket.belongsTo(ShowTime, { foreignKey: 'show_times_id' });
Ticket.belongsTo(Seat, { foreignKey: 'seat_id' });
Ticket.belongsTo(Show, { foreignKey: 'show_id' });

// Ticket Type Price
TicketPrice.hasMany(Ticket, { foreignKey: 'type_id', sourceKey: 'id' });

// Booking
Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.hasMany(Ticket, { foreignKey: 'booking_id', as: 'tickets' });

// User
User.belongsTo(Clearance, { foreignKey: 'clearance_id', as: 'clearance' });
User.belongsTo(UserStatus, { foreignKey: 'status_id', as: 'status' });
User.belongsTo(EmailPromoStatus, { foreignKey: 'email_promo_status_id', as: 'emailPromoStatus' });
User.hasMany(PaymentCardJunction, { foreignKey: 'user_id', as: 'paymentCards' });
User.hasOne(UserAddress, { foreignKey: 'user_id', as: 'userAddress' });
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
User.hasMany(Ticket, { foreignKey: 'user_id', as: 'tickets' });
User.hasMany(RefreshToken, { foreignKey: 'user_id' });

// User Address
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User Promotion
UserPromotion.belongsTo(User, { foreignKey: 'user_id', sourceKey: 'id' });
UserPromotion.belongsTo(Promotion, { foreignKey: 'promo_id', sourceKey: 'id' });

// User Status
UserStatus.hasMany(User, { foreignKey: 'status_id' });

module.exports = {
    sequelize,
    Sequelize,
    BillingAddress,
    Booking,
    Cast,
    Category,
    Clearance,
    Director,
    EmailPromoStatus,
    FilmRating,
    Movie,
    PaymentCard,
    PaymentCardJunction,
    Producer,
    Promotion,
    RefreshToken,
    Review,
    Showroom,
    Seat,
    SeatAvailability,
    ShowTime,
    Ticket,
    TicketPrice,
    User,
    UserAddress,
    UserPromotion,
    UserStatus,
    Show,
};