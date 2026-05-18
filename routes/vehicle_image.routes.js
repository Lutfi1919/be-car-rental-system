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
// router.post('/:id', upload.none(), vehicleImageController.updateVerification);
// router.get('/', vehicleImageController.getVerification);

module.exports = router