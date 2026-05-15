const Validator = require("fastest-validator");
const v = new Validator();
const { Booking, Booking_item } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createBooking: async (req, res) => {
        try {
            const { user_id } = req.body;

            const schema = {
                user_id: { type: "number", positive: true, integer: true }
            }

            const data = {
                user_id: Number(user_id),
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const booking = await Booking.create({
                user_id: data.user_id,
                total_price: 0,
                status: 'pending'
            })

            return res.status(201).json(response(201, 'created', booking));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getBooking: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                include: { model: Booking_item }
            });

            return res.status(200).json(response(200, "Success get all bookings data", bookings));
            
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}