const express = require('express');
const router = express.Router();
const { sendEmail, sendForgotPasswordEmail } = require('../controllers/EmailsController');

router.post('/send-email', sendEmail);
router.post('/send-forgot-password-email', sendForgotPasswordEmail);

module.exports = router;