const Validator = require("fastest-validator");
const v = new Validator();
const { Booking, Booking_item, Booking_package, Vehicle, Return, User, Payment } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createBooking: async (req, res) => {
        try {
            const { user_id, booking_package_id } = req.body;
            
            const schema = {
                user_id: { type: "number", positive: true, integer: true },
                booking_package_id: { type: "number", positive: true, integer: true }
            }
            
            const data = {
                user_id: Number(user_id),
                booking_package_id: Number(booking_package_id),
            }
            
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json(response(400, "Data user not found, please check [user_id] value!"))
            }
            
            const package = await Booking_package.findByPk(booking_package_id);
            if (!package) {
                return res.status(400).json(response(400, "Booking package not found, please check [booking_package_id] value!"))
            }

            if (user.is_verified == 'verified') {
                const booking = await Booking.create({
                    user_id: data.user_id,
                    booking_package_id: data.booking_package_id,
                    total_price: 0,
                    remaining_payment: 0,
                    payment_status: 'unpaid',
                    status: 'pending'
                })

                return res.status(201).json(response(201, 'created', booking));
            } else {
                return res.status(400).json(response(400, "Data user is not verified!"))
            }

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getBooking: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                include: [
                    { model: User },
                    { model: Booking_item, include: { model: Vehicle } },
                    { model: Return },
                ],
                order: [
                    ["createdAt", "DESC"]
                ]
            });

            return res.status(200).json(response(200, "Success get all bookings data", bookings));
            
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    showBooking: async (req, res) => {
        try {
            const { id } = req.params;

            const booking = await Booking.findByPk(id, {
                include: [
                    { model: User },
                    { model: Booking_item, include: { model: Vehicle } },
                    { model: Return },
                    { model: Booking_package },
                    { model: Payment },
                ]
            });
            if (!booking) {
                return res.status(400).json(response(400, "Data [id] not found"));
            }

            return res.status(200).json(response(200, "Success show requested booking!", booking));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getUserBooking: async (req, res) => {
        try {
            const booking = await Booking.findAll({
                where: {
                    user_id: req.user.userId
                },
                include: [
                    { model: Booking_item, include: [ { model: Vehicle } ] }, 
                    { model: Payment }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            if (booking.length === 0) {
                return res.status(400).json(response(400, "User booking not found!"));
            }

            return res.status(200).json(response(200, "Success get all user bookings data", booking));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const schema = {
                status: { type: "string", enum: ['completed', 'canceled', 'confirmed', 'on_rent'] }
            }

            const data = {
                status: status
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            
            const booking = await Booking.findByPk(id, {
                include: [
                    { model: Booking_package },
                    { model: Payment },
                ]
            });
            if (!booking) {
                return res.status(400).json(response(400, "Data booking not found, please check [booking_id] value"));
            }

            if (data.status === 'canceled') {
                const dpPayment = booking.Payments.find(payment => {
                    return (
                        payment.payment_type === 'dp' && payment.status === 'paid'
                    )
                })

                if (dpPayment) {
                    if (data.status === "canceled" && ["on_rent", "completed"].includes(booking.status)) {
                        return res.status(400).json(response(400, "Booking cannot be cancelled"));
                    }

                    if (booking.Booking_package.can_refund_dp === true) {
                        await Payment.create({
                            booking_id: booking.id,
                            method: dpPayment.method,
                            payment_type: 'refund',
                            amount: dpPayment.amount,
                            status: 'paid',
                            paid_at: new Date()
                        })

                        await booking.update({
                            payment_status: 'refunded'
                        });
                    }
                }
            }

            if (booking.status === data.status) {
                return res.status(400).json(response(400, `Booking already ${data.status}`));
            }

            await booking.update({
                status: data.status
            });

            const newBooking = await Booking.findByPk(id, {
                include: [
                    { model: Booking_item },
                    { model: Payment },
                    { model: Booking_package },
                ]
            })

            return res.status(200).json(response(200, "Success change booking status", newBooking));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}