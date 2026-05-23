const express = require('express');
const router = express.Router();

const vehicleImageController = require('../controllers/vehicle_image.controller')
const upload = require('../middlewares/upload')

router.post(
    '/', 
    upload.fields([
        { name: 'vehicle_images', maxCount: 3 },
    ]), 
    vehicleImageController.createVehicleImage
);
router.patch('/:id', upload.single('vehicle_images'), vehicleImageController.updateVehicleImage);
router.delete('/:id', vehicleImageController.deleteVehicleImage);

module.exports = router