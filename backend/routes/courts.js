const express = require('express')
const router = express.Router()
const courtController = require('../controllers/courts')
const { verifyToken, isAdmin } = require('../mid/authMiddleware')

// Public routes (ไม่ต้องล็อกอิน)
router.get('/courts/active', courtController.getActiveCourts)

// 🔥 ชั่วคราว: เอา middleware ออกเพื่อทดสอบ
router.get('/courts', courtController.getAllCourts)  // เอา verifyToken, isAdmin ออก
router.get('/courts/:id', courtController.getCourtById)
router.post('/courts', courtController.createCourt)
router.put('/courts/:id', courtController.updateCourt)
router.delete('/courts/:id', courtController.deleteCourt)
router.patch('/courts/:id/status', courtController.toggleCourtStatus)

module.exports = router