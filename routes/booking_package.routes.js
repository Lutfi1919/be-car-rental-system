const express = require('express');
const router = express.Router();

const bookingPackageController = require('../controllers/booking_package.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), bookingPackageController.createPackage)
router.put('/:id', upload.none(), bookingPackageController.updatePackage)
router.delete('/:id', bookingPackageController.deletePackage)
router.get('/', bookingPackageController.getPackage)

module.exports = router