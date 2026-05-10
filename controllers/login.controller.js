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
                return res.status(400).json(response(400, "Validate Error", validate));
            }

            const user = await User.findOne({ where: { email: email } });
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    }
}