const express = require('express');
const router = express.Router();

const vehicleUnitController = require('../controllers/vehicle_unit.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), vehicleUnitController.createVehicleUnit)
router.get('/', vehicleUnitController.getVehicleUnit)
router.post('/:id', upload.none(), vehicleUnitController.changeStatus)

module.exports = router