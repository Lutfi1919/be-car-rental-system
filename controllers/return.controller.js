const Validator = require("fastest-validator");
const v = new Validator();
const { Return, Booking, Booking_item, Vehicle, Payment } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createReturn: async (req, res) => {
        try {
            const { booking_id, returned_at, late_fee, damage_fee, notes } = req.body;

            const schema = {
                booking_id: { type: "number", positive: true, integer: true }, 
                returned_at: { type: "date" }, 
                late_fee: { type: "number", min: 0, integer: true }, 
                damage_fee: { type: "number", min: 0, integer: true }, 
                notes: { type: "string" }
            }

            const data = {
                booking_id: Number(booking_id),
                returned_at: new Date(returned_at),
                late_fee: Number(late_fee),
                damage_fee: Number(damage_fee),
                notes: notes ?? '-',
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const booking = await Booking.findByPk(booking_id)
            if (!booking) {
                return res.status(400).json(response(400, "Data booking not found, please check [booking_id] value"))
            }

            const bookingItems = await Booking_item.findAll({
                where: {
                    booking_id: data.booking_id
                }
            })
            if (bookingItems.length == 0) {
                return res.status(400).json(response(400, "Data booking items not found!"))
            }

            const returned = await Return.create(data);

            const additionalAmount = data.late_fee + data.damage_fee;

            await booking.update({
                status: 'completed'
            })

            return res.status(201).json(response(201, 'created', returned))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}