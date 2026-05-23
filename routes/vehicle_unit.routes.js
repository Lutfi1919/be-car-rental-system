const express = require('express');
const router = express.Router();

const vehicleUnitController = require('../controllers/vehicle_unit.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), vehicleUnitController.createVehicleUnit)
router.post('/:id', upload.none(), vehicleUnitController.updateVehicleUnit)
router.post('/:id', upload.none(), vehicleUnitController.changeStatus)
router.get('/', vehicleUnitController.getVehicleUnit)
router.delete('/:id', vehicleUnitController.deleteVehicleUnit);

module.exports = router