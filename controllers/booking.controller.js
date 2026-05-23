const Validator = require("fastest-validator");
const v = new Validator();
const { Booking, Booking_item, Booking_package, Vehicle_unit, Return, User } = require('../models')
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
                    { model: Booking_item },
                    { model: Return },
                ]
            });

            return res.status(200).json(response(200, "Success get all bookings data", bookings));
            
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const schema = {
                status: { type: "string", enum: ['completed', 'canceled'] }
            }

            const data = {
                status: status
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            
            const booking = await Booking.findByPk(id);
            if (!booking) {
                return res.status(400).json(response(400, "Data booking not found, please check [booking_id] value"));
            }

            await booking.update({
                status: data.status
            });

            if (booking.status === 'canceled' || booking.status === 'completed') {
                const bookingItems = await Booking_item.findAll({
                    where: {
                        booking_id: id
                    }
                })

                const vehicleUnitsId = bookingItems.map(item => {
                    return item.vehicle_unit_id
                })

                await Vehicle_unit.update(
                    { status: 'available' },
                    { where: { id: vehicleUnitsId } }
                )
            }

            const newBooking = await Booking.findByPk(id, {
                include: { model: Booking_item }
            })

            return res.status(200).json(response(200, "Success change booking status", newBooking));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}