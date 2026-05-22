const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicle.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), vehicleController.createVehicle)
router.get('/', vehicleController.getVehicle)
router.put('/:id', upload.none(), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router