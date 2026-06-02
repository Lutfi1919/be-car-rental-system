const Validator = require("fastest-validator");
const v = new Validator();
const { sequelize, Booking, Booking_item, Booking_package, Vehicle, Payment, User } = require("../models");
const { Op } = require("sequelize");
const { response } = require("../helpers/response.formatter");

function generateBookingCode() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `BKG-${year}${month}${day}-${random}`;
}

module.exports = {
    checkout: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { vehicle_id, booking_package_id, start_date, end_date, method, payment_type } = req.body;
            const user_id = req.user.userId;
            
            const schema = {
                vehicle_id: { type: "number", positive: true, integer: true },
                booking_package_id: { type: "number", positive: true, integer: true },
                start_date: { type: "date", empty: false },
                end_date: { type: "date", empty: false },
                method: { type: "enum", values: ["cash", "online_payment"] },
                payment_type: { type: "enum", values: ["dp", "full_payment"] }
            };

            const data = {
                vehicle_id: Number(vehicle_id),
                booking_package_id: Number(booking_package_id),
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                method: method,
                payment_type: payment_type
            };

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                await transaction.rollback();

                return res.status(400).json(response(400, "Validation Error", validate));
            }


            const parsedStartDate = new Date(start_date);
            const parsedEndDate = new Date(end_date);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (parsedStartDate < today) {
                await transaction.rollback();

                return res.status(400).json(response(400, "Start date cannot be in the past"));
            }

            if (parsedEndDate <= parsedStartDate) {
                await transaction.rollback();

                return res.status(400).json(response(400, "End date must be greater than start date"));
            }


            const user = await User.findByPk(user_id, {
                transaction
            });

            if (!user) {
                await transaction.rollback();

                return res.status(404).json(response(404, "User not found"));
            }

            if (user.is_verified !== "verified") {
                await transaction.rollback();

                return res.status(400).json(response(400, "User is not verified"));
            }


            const vehicle = await Vehicle.findByPk(vehicle_id, {
                transaction
            });

            if (!vehicle) {
                await transaction.rollback();

                return res.status(404).json(response(404, "Vehicle not found"));
            }

            if (vehicle.status === "maintenance") {
                await transaction.rollback();

                return res.status(400).json(response(400, "Vehicle is under maintenance"));
            }


            const bookingPackage = await Booking_package.findByPk(
                booking_package_id,
                { transaction }
            );

            if (!bookingPackage) {
                await transaction.rollback();

                return res.status(404).json(response(404, "Booking package not found"));
            }


            const overlappingBooking = await Booking_item.findOne({
                where: {
                    vehicle_id: vehicle_id,
                    [Op.and]: [
                        {
                            start_date: {
                                [Op.lt]: parsedEndDate
                            }
                        },
                        {
                            end_date: {
                                [Op.gt]: parsedStartDate
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: Booking,
                        where: {
                            status: {
                                [Op.notIn]: [ "canceled", "completed" ]
                            }
                        }
                    }
                ],
                transaction
            });

            if (overlappingBooking) {
                await transaction.rollback();

                return res.status(400).json(response(400, "Vehicle already booked on selected dates"));
            }


            const diffTime = parsedEndDate.getTime() - parsedStartDate.getTime();
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 

            const basePrice = vehicle.price_per_day * totalDays;

            const totalPrice = basePrice * bookingPackage.price_multiplier;


            let paidAmount = 0;
            let remainingPayment = 0;
            let paymentStatus = "unpaid";


            if (payment_type === "dp") {
                paidAmount = Math.round(totalPrice * 0.3);

                remainingPayment = totalPrice - paidAmount;

                paymentStatus = "partial";
            }


            if (payment_type === "full_payment") {
                paidAmount = totalPrice;

                remainingPayment = 0;

                paymentStatus = "paid";
            }


            const booking = await Booking.create({
                booking_code: generateBookingCode(),
                user_id: user_id,
                booking_package_id: booking_package_id,

                total_price: totalPrice,
                paid_amount: paidAmount,
                remaining_payment: remainingPayment,

                payment_status: paymentStatus,
                status: "pending",
            }, { transaction });


            const bookingItem =await Booking_item.create({
                booking_id: booking.id,
                vehicle_id: vehicle_id,

                price_per_day: vehicle.price_per_day,
                start_date: parsedStartDate,
                end_date: parsedEndDate,
                subtotal: totalPrice
            }, { transaction });


            const payment = await Payment.create({
                booking_id: booking.id,
                method: method,
                payment_type: payment_type,
                amount: paidAmount,
                status: method === "cash" ? "paid" : "pending",
                paid_at: method === "online_payment" ? null : new Date()
            }, { transaction });


            await transaction.commit();

            return res.status(201).json(response(201, "Checkout success", { booking, booking_item: bookingItem, payment }));

        } catch (error) {
            await transaction.rollback();

            return res.status(500).json(response(500, "Server Error", error.message));

        }
    }
};