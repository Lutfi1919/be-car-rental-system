const Validator = require("fastest-validator");
const v = new Validator();
const { Payment, Booking, Booking_item, Vehicle, Booking_package, User, Return } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createSettlementPayment: async (req, res) => {
        try {
            const { booking_id, method } = req.body;

            const schema = {
                booking_id: { type: "number", positive: true, integer: true },
                method: { type: "string", enum: ['cash', 'online_payment'] },
            }

            const data = {
                booking_id: Number(booking_id),
                method: method
            }

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const booking = await Booking.findByPk(booking_id);
            if (!booking) {
                return res.status(400).json(response(400, "Booking data not found"))
            }

            if (booking.payment_status !== 'partial') {
                return res.status(400).json(response(400, "Booking has not paid DP!"))
            }

            const payment = await Payment.create({
                booking_id: booking.id,
                method: data.method,
                payment_type: 'settlement',
                amount: booking.remaining_payment,
                status: 'pending',
                paid_at: null
            })

            await booking.update({
                paid_amount: booking.paid_amount + booking.remaining_payment,
                remaining_payment: 0,
                payment_status: 'paid'
            })

            return res.status(201).json(response(201, 'Success create settlement payment', payment))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    createAdditionalPayment: async (req, res) => {
        try {
            const { booking_id, method } = req.body;
            const schema = {
                booking_id: { type: "number", positive: true, integer: true },
                method: { type: "string", enum: ['cash', 'online_payment'] },
            }

            const data = {
                booking_id: Number(booking_id),
                method: method
            }

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const booking = await Booking.findByPk(booking_id);
            if (!booking) {
                return res.status(400).json(response(400, "Booking data not found"))
            }

            if (booking.status !== 'completed') {
                return res.status(400).json(response(400, "Booking has not completed yet!"))
            }

            const returnBooking = await Return.findOne({
                where: { booking_id: booking_id }
            });
            if (!returnBooking) {
                return res.status(404).json(response(404, "Return data not found for this booking"))
            }

            const additionalAmount = returnBooking.late_fee + returnBooking.damage_fee;

            const existingPayment = await Payment.findOne({
                where: {
                    booking_id: booking_id,
                    payment_type: "additional_fee",
                    status: "pending"
                }
            });

            if (existingPayment) {
                return res.status(400).json(
                    response(400, "Additional payment already exists")
                );
            }
            
            const payment = await Payment.create({
                booking_id: booking.id,
                method: data.method,
                payment_type: 'additional_fee',
                amount: additionalAmount,
                status: 'pending',
                paid_at: null
            })

            return res.status(201).json(response(201, 'Success create additional payment', payment))

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, paid_at } = req.body;

            const schema = {
                status: { type: "string", enum: ['paid', 'failed'] },
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

            const booking = await Booking.findByPk(payment.booking_id)
            if (!booking) {
                return res.status(400).json(response(400, "Validasi Error", "Booking data not found"));
            }

            if (status == 'paid') {
                await booking.update({
                    status: 'confirmed'
                }, {
                    where: { id: payment.booking_id }
                })
            } else {
                await booking.update({
                    status: 'canceled'
                }, {
                    where: { id: payment.booking_id }
                })
            }

            await payment.update({
                status: data.status,
                paid_at: data.paid_at,
            })

            const newPayment = await Payment.findByPk(id);
            return res.status(200).json(response(200, "success", newPayment));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getPayment: async (req, res) => {
        try {
            const { status, sortBy, order, page, limit } = req.query;
        
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            const { count, rows } = await Payment.findAndCountAll({
                include: [
                    {
                        model: Booking,
                        include: [
                            {
                                model: Booking_item,
                                include: [
                                    { model: Vehicle }
                                ]
                            },
                            { 
                                model: User,
                                attributes: { exclude: ['password'] }
                            }
                        ]
                    },
                ],
                where: status ? {
                    status: {
                        [Op.like]: `%${status}%`
                    }
                } : {},
                order: sortBy && order  ? [[sortBy, order]]  : [['createdAt', 'DESC']],
                offset: offset,
                limit: limitNum,
            });

            if (rows.length === 0) {
                return res.status(400).json(response(400, "Payment data empty or not found"));
            }

            const formatPagination = {
                data: rows,
                limit: limitNum,
                rows: (offset + 1) + " to " + (offset + rows.length), 
                total: count,
                page: pageNum,
            };

            return res.status(200).json(response(200, "Success get all payment data", formatPagination))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getUserPayment: async (req, res) => {
        try {
            const payment = await Payment.findAll({
                include: [
                    {
                        model: Booking,
                        where: { user_id: req.user.userId },
                        include: [
                            {
                                model: Booking_item,
                                include: [
                                    { model: Vehicle }
                                ]
                            }
                        ]
                    } 
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            if (!payment) {
                return res.status(400).json(response(400, "Payment not found"));
            }

            return res.status(200).json(response(200, "Success get all this user payment data", payment))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}