const Validator = require("fastest-validator");
const v = new Validator();
const { User } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require('sequelize');
const passwordHash = require('password-hash');
const { auth_secret } = require('../config/base.config')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const schema = {
                email: { type: "string" },
                password: { type: "string" },
            }

            const data = {
                email: email,
                password: password
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(400).json(response(400, "Validasi Error", "Email not found. Try again!"))
            }

            const checkPassword = passwordHash.verify(password, user.password);
            if (!checkPassword) {
                return res.status(400).json(response(400, "Validasi Error", "Password incorrect. Try again!"));
            }

            const token = jwt.sign({ userId: user.id, email: user.email, password: user.password, name: user.name }, auth_secret);
            if (!token) {
                return res.status(400).json(responose(400, "Validasi Error", "Login failed!"));
            }

            const formatData = {
                data: user,
                token: token,
            }
            return res.status(200).json(response(200, 'success', formatData));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },
    register: async (req, res) => {
        try {
            const { name, phoneNum, email, newPassword } = req.body;

            const schema = {
                name: { type: "string", min: 3 },
                phoneNum: { type: "string", positive: true },
                email: { type: "string", min: 10 },
                newPassword: { type: "string", min: 3 },
            }

            const data = {
                name: name,
                phoneNum: phoneNum,
                email: email,
                newPassword: passwordHash.generate(newPassword)
            }

            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate))
            }

            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.newPassword,
                phoneNum: data.phoneNum,
            })
            return res.status(201).json(response(201, 'created', user));
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}