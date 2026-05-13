const Validator = require("fastest-validator");
const v = new Validator();
const { Vehicle_unit, Vehicle } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createVehicleUnit: async (req, res) => {
        try {
            const { vehicle_id, plate_number } = req.body;

            const schema = {
                vehicle_id: { type: "number", positive: true, integer: true },
                plate_number: { type: "string", min: 3 },
            }

            const data = {
                vehicle_id: Number(vehicle_id),
                plate_number: plate_number,
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const vehicleUnit = await Vehicle_unit.create({
                vehicle_id: data.vehicle_id,
                plate_number: data.plate_number,
                status: 'available',
            })

            const count = await Vehicle_unit.count({
                where: {
                    vehicle_id: vehicle_id
                }
            })

            await Vehicle.update({
                stock: count,
                status: count > 0 ? 'available' : 'unavailable'
            }, {
                where: { id: vehicle_id }
            })

            return res.status(201).json(response(201, 'created', vehicleUnit));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getVehicleUnit: async (req, res) => {
        try {
            const vehicleUnits = await Vehicle_unit.findAll({
                include: { model: Vehicle }
            })

            return res.status(200).json(response(200, "Success get all vehicle units", vehicleUnits))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const schema = {
                status: { type: "string", enum: ['available', 'on_rent', 'maintenance'] }
            }

            const data = {
                status: status
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const vehicleUnit = await Vehicle_unit.findByPk(id);
            if (!vehicleUnit) {
                return res.status(400).json(response(400, "Validasi Error", "Vehicle unit data not found"))
            }

            const updateProcess = await Vehicle_unit.update({
                status: data.status
            }, {
                where: {id: id}
            })

            const newVehicleUnit = await Vehicle_unit.findByPk(id)
            return res.status(200).json(response(200, "success", newVehicleUnit));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}