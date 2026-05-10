const Validator = require("fastest-validator");
const v = new Validator();
const { User, Verification } = require('../models')
const { response } = require('../helpers/response.formatter');
const { Op } = require('sequelize');

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
    }
}