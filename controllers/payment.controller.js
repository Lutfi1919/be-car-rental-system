const Validator = require("fastest-validator");
const v = new Validator();
const { Payment, Booking } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createPayment: async (req, res) => {
        try {
            const { booking_id } = req.body;

            const schema = {
                booking_id: { type: "number", positive: true, integer: true },
            }

            const data = {
                booking_id: Number(booking_id),
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const booking = await Booking.findByPk(booking_id)
            if (!booking) {
                return res.status(400).json(response(400, "Booking data not found!, please check [booking_id] value!"))
            }

            const payment = await Payment.create({
                booking_id: data.booking_id,
                amount: booking.total_price,
                status: 'pending',
                paid_at: null
            })

            // await Booking.update({
            //     status: 'paid'
            // })

            return res.status(201).json(response(201, 'created', payment))

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, paid_at } = req.body;

            const schema = {
                status: { type: "string", enum: ['pending', 'paid'] },
                paid_at: { type: "date" }
            }

            const data = {
                status: status,
                paid_at: new Date(paid_at)
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const payment = await Payment.findByPk(id)
            if (!payment) {
                return res.status(400).json(response(400, "Validasi Error", "Payment data not found"));
            }

            if (status === 'paid') {
                await Booking.update(
                    { status: 'paid' },
                    { where: { id: payment.booking_id } },
                )
            } else if (status === 'pending') {
                await Booking.update(
                    { status: 'pending' },
                    { where: { id: payment.booking_id } },
                )
            }

            const updateProcess = await Payment.update({
                status: data.status,
                paid_at: data.paid_at
            }, {
                where: {id: id}
            });

            const newPayment = await Payment.findByPk(id);
            return res.status(200).json(response(200, "success", newPayment));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getPayment: async (req, res) => {
        try {
            const payment = await Payment.findAll({
                include: { model: Booking }
            })

            return res.status(200).json(response(200, "Success get all payment data", payment))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}