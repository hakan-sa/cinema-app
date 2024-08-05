const { Router } = require('express');
const router = Router();
const {
    userRegister, refreshAccessToken, verificationCodeMatch,
    login, logout, resetPassword, isEmailTaken
} = require('../controllers/AuthsController');

router.route('/signup').post(userRegister);
router.route('/refresh-token').get(refreshAccessToken);
router.route('/login').post(login);
router.route('/logout').delete(logout);
router.route('/reset-password/:id').put(resetPassword);
router.route('/is-email-taken/:email').get(isEmailTaken);
router.route('/verification-match/:verificationCode').put(verificationCodeMatch);

module.exports = router;