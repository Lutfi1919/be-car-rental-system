const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicle.controller')
const upload = require('../middlewares/upload')
const { checkToken } = require('../middlewares/auth')

router.post('/', checkToken, upload.single('image'), vehicleController.createVehicle);

router.put('/:id', checkToken, upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', checkToken, vehicleController.deleteVehicle);

router.get('/', vehicleController.getVehicle)
router.get('/:id', vehicleController.showVehicle);

module.exports = router