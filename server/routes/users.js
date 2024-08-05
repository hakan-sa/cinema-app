const { Router } = require('express');
const router = Router();
const {
    getUserById, deleteUser, updateUser,
    updatePassword, getPromoEmailSubscribedUsers, getUserByEmail
} = require('../controllers/UsersController');

// This needs to be placed before /:id (the parameterized url)
// Otherwise will treat "promo-emails" as an "id"
// Route order is important! Specific First -> Generic Last
router.route('/promo-emails').get(getPromoEmailSubscribedUsers);

router.route('/update-password/:id').patch(updatePassword);
router.route('/email/:email').get(getUserByEmail);

router.route('/:id')
    .get(getUserById)
    .patch(updateUser) // Needs testing
    .delete(deleteUser); // Needs testing

module.exports = router;