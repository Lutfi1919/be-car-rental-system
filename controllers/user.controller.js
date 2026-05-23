const Validator = require("fastest-validator");
const v = new Validator();
const { User, Verification } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// CERUD user : done
// Create nya ada di register

module.exports = {
    getUser: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                include: { model: Verification }
            });

            return res.status(200).json(response(200, "Success get all users", users));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updateUser: async (req ,res) => {
        try {
            const { id } = req.params;
            const { name, phoneNum, email } = req.body;
            
            const schema = {
                name: { type: "string", min: 3 },
                phoneNum: { type: "string", positive: true },
                email: { type: "string", min: 10 },
            }
            
            const data = {
                name: name,
                phoneNum: phoneNum,
                email: email,
            }
            
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }
            
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(400).json(response(400, "Validasi Error", "Data user not found!"))
            }

            const updateProcess = await User.update({
                name: data.name ?? user.name,
                email: data.email ?? user.email,
                phoneNum: data.phoneNum ?? user.phoneNum,
            }, {
                where: { id: id }
            })

            const newUser = await User.findByPk(id);
            return res.status(200).json(response(200, "success", newUser));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    updateProfileImage: async (req, res) => {
        try {
            const { id } = req.params;
            const { profile_image } = req.file;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(400).json(response(400, "Validasi Error", "Data user not found!"))
            }

            if (req.file) {
                const imageName = user.getDataValue('profile_image');
                const filePath = path.join(__dirname, '../uploads', imageName);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            const updateProcess = await User.update({
                profile_image: (req.file ? req.file.filename : user.getDataValue("profile_image"))
            }, {
                where: { id: id }
            })
            
            const newUser = await User.findByPk(id);
            return res.status(200).json(response(200, "success", newUser));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(400).json(response(400, "Validasi Error", "Data user not found!"))
            }
            const imageName = user.getDataValue('profile_image');
            const filePath = path.join(__dirname, '../uploads', imageName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            const deteleProcess = await User.destroy({
                where: {id, id}
            });

            return res.status(200).json(response(200, "deleted"));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}