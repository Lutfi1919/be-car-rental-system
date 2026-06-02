const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.controller')
const upload = require('../middlewares/upload')

router.get('/vehicles/excel', reportController.exportVehicles);
router.get('/payments/excel', reportController.exportUserPayments);

module.exports = router
