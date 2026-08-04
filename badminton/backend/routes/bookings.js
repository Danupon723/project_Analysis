const express = require('express')
const router = express.Router()

const bookingController = require('../controllers/booking')

// CREATE
router.post('/bookings', bookingController.createBooking)

// GET ALL
router.get('/bookings', bookingController.getAllBookings)

// GET BY DATE
router.get('/bookings/:date', bookingController.getBookingsByDate)

// จำนวนการจองต่อวัน
router.get('/bookings-summary/count', bookingController.getBookingCount)

// รายได้
router.get('/bookings-summary/income', bookingController.getIncome)

// รายละเอียดการจองต่อวัน ✅ แก้ path และใช้ผ่าน bookingController
router.get('/bookings-summary/daily', bookingController.getDailyBookings)

// รายละเอียดการจองต่อวัน (รวมเวลาที่จองแล้ว) ✅ เพิ่ม route สำหรับ booked slots
router.get('/bookings/booked-slots/:date', bookingController.getBookedSlots)

module.exports = router