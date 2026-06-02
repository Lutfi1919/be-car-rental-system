const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller')
const upload = require('../middlewares/upload')

router.post('/settlement', upload.none(), paymentController.createSettlementPayment)
router.post('/additional', upload.none(), paymentController.createAdditionalPayment)
router.patch('/:id/status', upload.none(), paymentController.changeStatus)
router.get('/', paymentController.getPayment)
router.get('/profile', paymentController.getUserPayment)

module.exports = router