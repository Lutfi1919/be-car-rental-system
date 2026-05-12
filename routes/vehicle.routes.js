const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicle.controller')

router.post('/', vehicleController.createVehicle)

module.exports = router