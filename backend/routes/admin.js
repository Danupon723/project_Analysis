const express = require('express')
const router = express.Router()

const { verifyToken, isAdmin } = require('../mid/authMiddleware')
const adminController = require('../controllers/admin')

// เพิ่มผู้ใช้
router.post('/users', adminController.createUser)

// ดึงผู้ใช้ทั้งหมด 
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers)

router.get('/users-all', adminController.getAllUsers)

// แก้ไขผู้ใช้
router.put('/users/:id', adminController.updateUser)

// ลบผู้ใช้
router.delete('/users/:id', adminController.deleteUser)

module.exports = router