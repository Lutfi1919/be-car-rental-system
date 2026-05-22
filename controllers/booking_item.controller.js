const Validator = require("fastest-validator");
const v = new Validator();
const { Booking_item, Booking, Vehicle, Vehicle_unit } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createBookingItem: async (req, res) => {
        try {
            const { booking_id, vehicle_unit_id, start_date, end_date } = req.body;

            const schema = {
                booking_id: { type: "number", positive: true, integer: true },
                vehicle_unit_id: { type: "number", positive: true, integer: true },
                start_date: { type: "date" },
                end_date: { type: "date" },
            }

            const data = {
                booking_id: Number(booking_id),
                vehicle_unit_id: Number(vehicle_unit_id),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const booking = await Booking.findByPk(booking_id)
            if (!booking) {
                return res.status(400).json(response(400, "Data booking not found, please check [booking_id] value"));
            }

            const vehicleUnit = await Vehicle_unit.findByPk(vehicle_unit_id, { include: [{ model: Vehicle }] })
            if (!vehicleUnit) {
                return res.status(400).json(response(400, "Data vehicle unit not found, please check [vehicle_unit_id] value"));
            }
            if (vehicleUnit.status !== 'available') {
                return res.status(400).json(response(400, "Vehicle unit is not available"))
            }

            const pricePerDay = vehicleUnit.Vehicle.price_per_day;

            const diffTime = data.end_date.getTime() - data.start_date.getTime();

            const totalDays = Math.ceil( diffTime / (1000 * 60 * 60 * 24) );
            if (totalDays <= 0) {
                return res.status(400).json(response(400, "End date must be greater than start date"))
            }

            const subtotal = pricePerDay * totalDays; 

            const bookingItem = await Booking_item.create({
                booking_id: data.booking_id,
                vehicle_unit_id: data.vehicle_unit_id,
                price_per_day: pricePerDay,
                start_date: data.start_date,
                end_date: data.end_date,
                subtotal: subtotal, 
            })

            await vehicleUnit.update({
                status: 'on_rent'
            });

            const allBookingItems = await Booking_item.findAll({
                where: {
                    booking_id: data.booking_id
                }
            });

            const totalPrice = allBookingItems.reduce((acc, item) => {
                return acc + item.subtotal;
            }, 0);

            await booking.update({
                total_price: totalPrice
            });

            return res.status(201).json(response(201, 'created', bookingItem));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getBookingItem: async (req, res) => {
        try {
            const bookingItems = await Booking_item.findAll({
                include: [
                    { model: Booking }, 
                    { model: Vehicle_unit }
                ]
            })

            return res.status(200).json(response(200, 'Success get all booking items data', bookingItems));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
}