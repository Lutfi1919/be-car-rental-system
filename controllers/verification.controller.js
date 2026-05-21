const Validator = require("fastest-validator");
const v = new Validator();
const { Verification, User } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

module.exports = {
    createVerification: async (req, res) => {
        try {
            const { user_id } = req.body;
            const ktp_image = req.files.ktp_image?.[0];
            const sim_image = req.files.sim_image?.[0];

            const schema = {
                user_id: { type: "number", positive: true, integer: true },
            }

            const data = {
                user_id: Number(user_id)
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            if (!ktp_image || !sim_image) {
                return res.status(400).json(response(400, "Validasi Error", "Image not found"));
            }

            const user = await User.findByPk(user_id);
            if (!user) {
                return res.status(400).json(response(400, "Data user not found, please check [user_id] value"));
            }

            const verification = await Verification.create({
                user_id: data.user_id,
                ktp_image: ktp_image.filename,
                sim_image: sim_image.filename,
            })

            await user.update({
                is_verified: 'pending'
            })
            
            return res.status(201).json(response(201, 'created', verification))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updateVerification: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const schema = {
                status: { type: "string", enum: ['verified', 'rejected'] }
            }

            const data = {
                status: status
            }
            
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const verification = await Verification.findByPk(id)
            if (!verification) {
                return res.status(400).json(response(400, "Validasi Error", "Verification data not found"));
            }

            if (status === 'verified') {
                await User.update(
                    { is_verified: 'verified' },
                    { where: { id: verification.user_id } }
                );
            } else if (status === 'rejected') {
                await User.update(
                    { is_verified: 'rejected' },
                    { where: { id: verification.user_id } }
                );
            }

            const updateProcess = await Verification.update({
                status: data.status
            }, {
                where: {id: id}
            })

            const newVerification = await Verification.findByPk(id);
            return res.status(200).json(response(200, "success", newVerification));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    getVerification: async (req, res) => {
        try {
            const verifications = await Verification.findAll({
                include: { model: User }
            })

            return res.status(200).json(response(200, "Success get verification data!", verifications))
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}