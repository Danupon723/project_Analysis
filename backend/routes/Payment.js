const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking')

// ใช้งาน
router.post('/bookings', bookingController.createBooking)

module.exports = router