const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), bookingController.createBooking)
router.get('/', bookingController.getBooking)

module.exports = router