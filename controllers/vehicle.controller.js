const Validator = require("fastest-validator");
const v = new Validator();
const { Vehicle } = require('../models')
const { response } = require('../helpers/response.formatter');
const fs = require('fs'); // file system, melakukan sesuai yg berhubungan dengan lokasi file / nyari lokasi terus mau diapain
const path = require('path');

// CERUD vehicle: done
module.exports = {
    createVehicle: async (req, res) => {
        try {
            const { name, type, transmission, passengers, fuel_type, price_per_day, description, plate_number } = req.body;
            const { image } = req.file;

            const schema = {
                name: { type: "string", min: 3 },
                type: { type: "string", enum: ['sedan', 'hatchback', 'coupe', 'sport', 'LCGC', 'SUV', 'MPV'] },
                transmission: { type: "string", enum: ['manual', 'automatic'] },
                passengers: { type: "number", positive: true, integer: true },
                fuel_type: { type: "string", enum: ['pertalite', 'pertamax', 'pertamax_turbo', 'diesel', 'electric'] },
                price_per_day: { type: "number", positive: true, integer: true },
                description: { type: "string" },
                plate_number: { type: "string", min: 3 },
            }

            const data = {
                name: name,
                type: type,
                transmission: transmission,
                passengers: Number(passengers),
                fuel_type: fuel_type,
                price_per_day: Number(price_per_day),
                description: description,
                plate_number: plate_number,
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
 
            const vehicle = await Vehicle.create({
                name: data.name,
                type: data.type,
                transmission: data.transmission,
                passengers: data.passengers,
                fuel_type: data.fuel_type,
                price_per_day: data.price_per_day,
                description: data.description,
                plate_number: data.plate_number,
                image: req.file.filename,
                status: 'available'
            })
            
            return res.status(201).json(response(201, 'created', vehicle));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updateVehicle: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, type, transmission, passengers, fuel_type, price_per_day, description, plate_number } = req.body;
 
            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) {
                return res.status(400).json(response(400, "Validasi Error", "Data vehicle not found!"))
            }
            
            const data = {
                name: name?.trim() ? name : vehicle.name,
                type: type?.trim() ? type : vehicle.type,
                transmission: transmission?.trim() ? transmission : vehicle.transmission,
                passengers: passengers ? Number(passengers) : vehicle.passengers,
                fuel_type: fuel_type?.trim() ? fuel_type : vehicle.fuel_type,
                price_per_day: price_per_day ? Number(price_per_day) : vehicle.price_per_day,
                description: description?.trim() ? description : vehicle.description,
                plate_number: plate_number ? plate_number : vehicle.plate_number,
            }
            
            const schema = {
                name: { type: "string", min: 3 },
                type: { type: "string", enum: ['sedan', 'hatchback', 'coupe', 'sport', 'LCGC', 'SUV', 'MPV'] },
                transmission: { type: "string", enum: ['manual', 'automatic'] },
                passengers: { type: "number", positive: true, integer: true },
                fuel_type: { type: "string", enum: ['pertalite', 'pertamax', 'pertamax_turbo', 'diesel', 'electric'] },
                price_per_day: { type: "number", positive: true, integer: true },
                description: { type: "string" },
                plate_number: { type: "string", min: 3 },
            }

            
            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                console.log(validate);
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            if (req.file) {
                // karna image udah diganti jadi link di getter model, jdi ambil yang aslinya pake getDataValue
                const imageName = vehicle.getDataValue('image');
                // cari image ke folder uploads
                const filePath = path.join(__dirname, '../uploads', imageName);
                // cek jika file ada di folder tsb
                if (fs.existsSync(filePath)) {
                    // hapus file
                    fs.unlinkSync(filePath);
                }
            }

            const updateProcess =  await Vehicle.update({
                name: data.name,
                type: data.type,
                transmission: data.transmission,
                passengers: data.passengers,
                fuel_type: data.fuel_type,
                price_per_day: data.price_per_day,
                description: data.description,
                plate_number: data.plate_number,
                image: (req.file ? req.file.filename : vehicle.getDataValue("image"))
            }, {
                where: { id: id }
            });

            const newVehicle = await Vehicle.findByPk(id);

            return res.status(200).json(response(200, "Success update vehicle", newVehicle));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const schema = {
                status: { type: "string", enum: ['available', 'maintenance'] }
            }

            const data = {
                status: status
            }

            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) {
                return res.status(400).json(response(400, "Validasi Error", "Vehicle data not found!"));
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }


            await vehicle.update({
                status: data.status
            });

            const newVehicle = await Vehicle.findByPk(id);

            return res.status(200).json(response(200, "Vehicle status has been changed!", newVehicle));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    deleteVehicle: async (req, res) => {
        try {
            const { id } = req.params;
            
            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) {
                return res.status(400).json(response(400, "Validasi Error", "Data Vehicle not found!"))
            }

            const imageName = vehicle.getDataValue('image');
            const filePath = path.join(__dirname, '../uploads', imageName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const deleteProcess = await Vehicle.destroy({
                where: { id: id }
            })

            return res.status(200).json(response(200, "deleted"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getVehicle: async (req, res) => {
        try {
            const vehicles = await Vehicle.findAll();

            return res.status(200).json(response(200, "Success get all vehicles", vehicles));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    showVehicle: async (req, res) => {
        try {
            const { id } = req.params;

            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) {
                return res.status(400).json(response(400, "Data [id] not found"));
            }
            return res.status(200).json(response(200, "Success show requested vehicle!", vehicle));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}