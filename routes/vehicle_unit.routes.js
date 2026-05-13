const express = require('express');
const router = express.Router();

const vehicleUnitController = require('../controllers/vehicle_unit.controller')

router.post('/', vehicleUnitController.createVehicleUnit)
router.get('/', vehicleUnitController.getVehicleUnit)

module.exports = router