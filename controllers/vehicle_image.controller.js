const Validator = require("fastest-validator");
const v = new Validator();
const { Vehicle_image, Vehicle_unit, sequelize } = require('../models')
const { response } = require('../helpers/response.formatter');

module.exports = {
    createVehicleImage: async (req, res) => {
        const t = await sequelize.transaction()

        try {
            const { vehicle_unit_id } = req.body;
            const vehicle_images = req.files.vehicle_images;

            const schema = {
                vehicle_unit_id: { type: "number", positive: true, integer: true },
            }

            const data = {
                vehicle_unit_id: Number(vehicle_unit_id)
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                await t.rollback();
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            
            if (!vehicle_images) {
                await t.rollback();
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }
            
            const vehicleUnit = await Vehicle_unit.findByPk(vehicle_unit_id);
            if (!vehicleUnit) {
                await t.rollback();
                return res.status(400).json(response(400, "Data vehicle unit not found, please check [vehicle_unit_id] value"));
            }
            
            const createImages = await Promise.all(
                vehicle_images.map(async (image) => {
                    return await Vehicle_image.create({
                        vehicle_unit_id,
                        vehicle_images: image.filename
                    }, { transaction: t });
                })
            )

            await t.commit();
            
            return res.status(201).json(response(201, 'created', createImages))
        } catch (error) {
            await t.rollback();
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}