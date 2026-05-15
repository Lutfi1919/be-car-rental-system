const express = require('express');
const router = express.Router();

const bookingItemController = require('../controllers/booking_item.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), bookingItemController.createBookingItem)
router.get('/', bookingItemController.getBookingItem)

module.exports = router