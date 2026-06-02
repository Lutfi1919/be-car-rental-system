const Validator = require("fastest-validator");
const v = new Validator();
const { Booking_package } = require('../models')
const { response } = require('../helpers/response.formatter');

// CERUD booking_package : done
module.exports = {
    createPackage: async (req, res) => {
        try {
            const { name, price_multiplier, can_refund_dp, description } = req.body;

            const schema = {
                name: { type: "string", min: 3 },
                price_multiplier: { type: "number", positive: true },
                can_refund_dp: { type: "boolean" },
                description: { type: "string" }
            }

            const data = {
                name: name,
                price_multiplier: Number(price_multiplier),
                can_refund_dp: can_refund_dp === 'true' ? true : false,
                description: description
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const bookingPackage = await Booking_package.create(data);
            return res.status(201).json(response(201, "Success create booking package", bookingPackage));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updatePackage: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price_multiplier, can_refund_dp, description } = req.body;

            const bookingPackage = await Booking_package.findByPk(id);
            if (!bookingPackage) {
                return res.status(400).json(response(400, "Booking package not found!"));
            }
            
            const schema = {
                name: { type: "string", min: 3 },
                price_multiplier: { type: "number", positive: true },
                can_refund_dp: { type: "boolean" },
                description: { type: "string" }
            };

            const data = {
                name:name ? name : bookingPackage.name,
                price_multiplier: price_multiplier !== undefined && price_multiplier !== '' ? Number(price_multiplier) : bookingPackage.price_multiplier,
                can_refund_dp: can_refund_dp !== undefined ? can_refund_dp === 'true' ? true : false : bookingPackage.can_refund_dp,
                description: description ? description : bookingPackage.description
            };

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validation Error", validate));
            }

            await bookingPackage.update(data);
            const newBookingPackage = await Booking_package.findByPk(id);

            return res.status(200).json(response(200, "Success update booking package", newBookingPackage));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    deletePackage: async (req, res) => {
        try {
            const { id } = req.params;
            const bookingPackage = await Booking_package.findByPk(id);

            if (!bookingPackage) {
                return res.status(400).json(response(400, "Booking package not found!"));
            }

            await bookingPackage.destroy();

            return res.status(200).json(response(200, "Success delete booking package"));
            
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
    getPackage: async (req, res) => {
        try {
            const bookingPackages = await Booking_package.findAll();

            return res.status(200).json(response(200, "Success get booking packages", bookingPackages));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },
}