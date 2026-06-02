const ExcelJS = require('exceljs');
const { Vehicle, Booking, Booking_item, Payment } = require('../models');

module.exports = {
    exportVehicles: async (req, res) => {
        try {
            const vehicles = await Vehicle.findAll();

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Vehicles');

            worksheet.columns = [
                { header: 'Vehicle ID', key: 'id', width: 15 },
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Type', key: 'type', width: 30 },
                { header: 'Transmission', key: 'transmission', width: 30 },
                { header: 'Passengers', key: 'passengers', width: 30 },
                { header: 'Fuel Type', key: 'fuel_type', width: 30 },
                { header: 'Price Per Day', key: 'price_per_day', width: 30 },
                { header: 'Description', key: 'description', width: 50 },
                { header: 'Plate Number', key: 'plate_number', width: 30 },
                { header: 'Image', key: 'image', width: 30 },
                { header: 'Status', key: 'status', width: 30 },
            ];

            vehicles.forEach(vehicle => {
                worksheet.addRow({
                    id: vehicle.id,
                    name: vehicle.name,
                    type: vehicle.type,
                    transmission: vehicle.transmission,
                    passengers: vehicle.passengers,
                    fuel_type: vehicle.fuel_type,
                    price_per_day: vehicle.price_per_day,
                    description: vehicle.description,
                    plate_number: vehicle.plate_number,
                    image: vehicle.image,
                    status: vehicle.status
                })
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=bookings.xlsx'
            );

            await workbook.xlsx.write(res);

            res.end();
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    exportUserPayments: async (req, res) => {
        try {
            console.log("export user payment masuk");
            const userId = req.user.userId;
            const payments = await Payment.findAll({
                include: [
                    {
                        model: Booking,
                        where: {
                            user_id: req.user.userId
                        },
                        required: true,
                        include: [
                            {
                                model: Booking_item,
                                include: [Vehicle]
                            }
                        ]
                    }
                ]
            });
            console.log(payments);
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Payments');

            worksheet.columns = [
                { header: 'Payment ID', key: 'id', width: 15 },
                { header: 'Booking Code', key: 'booking_code', width: 20 },
                { header: 'Vehicle', key: 'vehicle', width: 30 },
                { header: 'Amount', key: 'amount', width: 20 },
                { header: 'Method', key: 'method', width: 20 },
                { header: 'Payment Type', key: 'payment_type', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Date', key: 'date', width: 20 }
            ];

            payments.forEach(payment => {
                const booking = payment.Booking;
                const bookingItem = booking?.Booking_items?.[0];
                const vehiclePayment = bookingItem?.Vehicle;

                worksheet.addRow({
                    id: payment.id,
                    booking_code: booking?.booking_code || "-",
                    vehicle: vehiclePayment?.name || "-",
                    amount: payment.amount,
                    method: payment.method,
                    payment_type: payment.payment_type,
                    status: payment.status,
                    date: new Date(payment.createdAt)
                        .toLocaleDateString("id-ID")
                })
            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=bookings.xlsx'
            );

            await workbook.xlsx.write(res);

            res.end();
        } catch (error) {
            console.log(error);
            
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}