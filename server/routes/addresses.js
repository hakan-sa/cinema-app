const { Router } = require('express');
const router = Router();
const { getAddressByUserId, updateAddress, createAddress, deleteAddress } = require('../controllers/AddressesController');

router.route('/:id')
    .post(createAddress)
    .get(getAddressByUserId)
    .patch(updateAddress)
    .delete(deleteAddress);

module.exports = router;