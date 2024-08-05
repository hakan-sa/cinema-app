const sequelize = require('../config/database.js');
const { UserAddress } = require('../models/index.js');

const AddressesController = {

    getAddressByUserId: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        try {
            const address = await UserAddress.getUserAddress({ id });
            if (!address) return res.status(404).json('Address not found');
            return res.status(200).json('Address found', address);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    deleteAddress: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        try {
            // Retrieve address
            const address = await UserAddress.getUserAddress(id);
            if (!address) return res.status(404).json('Address not found');

            // Delete address
            await UserAddress.deleteUserAddress(id);
            return res.status(200).json(address);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    updateAddress: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        const { city, state, street, zipCode } = req?.body;
        if (!city || !state || !street || !zipCode) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const [rowsAffected] = await UserAddress.update(
                    {
                        city,
                        state,
                        street,
                        zip_code: zipCode
                    }, { where: { user_id: id } },
                    { transaction });
                console.log(rowsAffected);
                if (rowsAffected === 0) return res.status(404).json('User address not found or unchanged');

                const updatedAddress = await UserAddress.getUserAddress(id);
                if (!updatedAddress) return res.status(404).json('Updated user address not found');

                return res.status(200).json(updatedAddress);
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },


    createAddress: async (req, res) => {
        const id = req?.params?.id;
        if (!id) return res.status(400).json('Missing user id');

        const { city, state, street, zipCode } = req.body;
        if (!city || !state || !street || !zipCode) return res.status(400).json('Missing required parameters');

        try {
            await sequelize.transaction(async (transaction) => {
                const address = await UserAddress.createUserAddress({
                    user_id: id,
                    city,
                    state,
                    street,
                    zip_code: zipCode
                }, { transaction });

                if (!address) return res.status(404).json('User address failed to create');

                return res.status(200).json(address);
            });
        } catch (error) {
            return res.status(500).send(error.message);
        }
    }

}

module.exports = AddressesController;