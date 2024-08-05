const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const tokenCleanup = require('./jobs/tokenCleanup');

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();
const sequelize = require('./config/database');

// Middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Import routes
const emailRoutes = require('./routes/emails');
const authRoutes = require('./routes/auths');
const movieRoutes = require('./routes/movies');

// Use routes
app.use('/auths', authRoutes);
app.use('/emails', emailRoutes);
app.use('/movies', movieRoutes);

app.use(verifyJWT);

// Import api routes
const userRoutes = require('./routes/users');
const addressRoutes = require('./routes/addresses');
const paymentCardRoutes = require('./routes/payment-cards');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admins');
const shows = require('./routes/shows');
const showrooms = require('./routes/showrooms');
const showTimes = require('./routes/show-times');
const seats = require('./routes/seats');

// Use api routes
app.use('/users', userRoutes);
app.use('/addresses', addressRoutes);
app.use('/payment-cards', paymentCardRoutes);
app.use('/bookings', bookingRoutes)
app.use('/admins', adminRoutes);
app.use('/shows', shows);
app.use('/showrooms', showrooms);
app.use('/show-times', showTimes);
app.use('/seats', seats);

// Listen on port 8080 or the port specified in the .env
console.log(sequelize.models);
sequelize.sync({ alter: false, force: false })
    .then(() => {
        console.log('Database established successfully...');
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.log('Database connection failed: ', err);
    });