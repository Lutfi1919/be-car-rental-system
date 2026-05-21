const Validator = require("fastest-validator");
const v = new Validator();
const { Vehicle, Vehicle_unit } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createVehicle: async (req, res) => {
        try {
            const { name, type, fuel_type, transmission, price_per_day, description } = req.body;

            const schema = {
                name: { type: "string", min: 3 },
                type: { type: "string", enum: ['sedan', 'SUV', 'hatchback', 'coupe', 'sport'] },
                fuel_type: { type: "string", enum: ['pertalite', 'pertamax', 'pertamax_turbo', 'diesel'] },
                transmission: { type: "string", enum: ['manual', 'automatic'] },
                // stock: { type: "number", positive: true, integer: true },
                price_per_day: { type: "number", positive: true, integer: true },
                description: { type: "string" },
            }

            const data = {
                name: name,
                type: type,
                fuel_type: fuel_type,
                transmission: transmission,
                // stock: Number(stock),
                price_per_day: Number(price_per_day),
                description: description,
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
 
            const vehicle = await Vehicle.create({
                name: data.name,
                type: data.type,
                fuel_type: data.fuel_type,
                transmission: data.transmission,
                stock: 0,
                price_per_day: data.price_per_day,
                description: data.description,
                status: 'unavailable'
            })
            
            return res.status(201).json(response(201, 'created', vehicle));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getVehicle: async (req, res) => {
        try {
            const vehicles = await Vehicle.findAll({
                include: { model: Vehicle_unit }
            });

            return res.status(200).json(response(200, "Success get all vehicles", vehicles));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}