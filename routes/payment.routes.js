const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), paymentController.createPayment)
router.post('/:id', upload.none(), paymentController.changeStatus)
router.get('/', paymentController.getPayment)

module.exports = router