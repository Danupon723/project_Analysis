// controllers/courtController.js
const db = require('../db')

// ดึงข้อมูลสนามทั้งหมด
exports.getAllCourts = (req, res) => {
  // ใช้ TIME_FORMAT เพื่อจัดรูปแบบเวลา
  const query = `
    SELECT 
      id, 
      name, 
      price, 
      TIME_FORMAT(start_time, '%H:%i') as start_time,
      TIME_FORMAT(end_time, '%H:%i') as end_time,
      status,
      created_at,
      updated_at
    FROM courts 
    ORDER BY id ASC
  `
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: err.message 
      })
    }
    
    res.json({
      success: true,
      data: results,
      total: results.length
    })
  })
}

// ดึงข้อมูลสนามตาม ID
exports.getCourtById = (req, res) => {
  const { id } = req.params
  
  const query = `
    SELECT 
      id, 
      name, 
      price, 
      TIME_FORMAT(start_time, '%H:%i') as start_time,
      TIME_FORMAT(end_time, '%H:%i') as end_time,
      status,
      created_at,
      updated_at
    FROM courts 
    WHERE id = ?
  `
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: err.message 
      })
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลสนาม'
      })
    }
    
    res.json({
      success: true,
      data: results[0]
    })
  })
}

// เพิ่มสนามใหม่
exports.createCourt = (req, res) => {
  const { name, price, start_time, end_time, status } = req.body
  
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อสนาม'
    })
  }
  
  const query = `
    INSERT INTO courts (name, price, start_time, end_time, status, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `
  
  const courtPrice = price || 0
  const courtStartTime = start_time || '08:00:00'
  const courtEndTime = end_time || '22:00:00'
  const courtStatus = status || 'active'
  
  db.query(query, [name, courtPrice, courtStartTime, courtEndTime, courtStatus], (err, result) => {
    if (err) {
      console.error('Error creating court:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการเพิ่มสนาม',
        error: err.message 
      })
    }
    
    res.json({
      success: true,
      message: 'เพิ่มสนามสำเร็จ',
      data: { id: result.insertId }
    })
  })
}

// แก้ไขข้อมูลสนาม
exports.updateCourt = (req, res) => {
  const { id } = req.params
  const { name, price, start_time, end_time, status } = req.body

  
  const query = `
    UPDATE courts 
    SET name = ?, 
        price = ?, 
        start_time = ?, 
        end_time = ?, 
        status = ?,
        updated_at = NOW()
    WHERE id = ?
  `
  
  db.query(query, [name, price, start_time, end_time, status, id], (err, result) => {
    if (err) {
      console.error('Error updating court:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
        error: err.message 
      })
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลสนามที่ต้องการแก้ไข'
      })
    }
    
    res.json({
      success: true,
      message: 'แก้ไขข้อมูลสำเร็จ'
    })
  })
}

// ลบสนาม
exports.deleteCourt = (req, res) => {
  const { id } = req.params
  
  
  const query = 'DELETE FROM courts WHERE id = ?'
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting court:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        error: err.message 
      })
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลสนามที่ต้องการลบ'
      })
    }
    
    res.json({
      success: true,
      message: 'ลบข้อมูลสำเร็จ'
    })
  })
}

// ดึงเฉพาะสนามที่เปิดให้บริการ
exports.getActiveCourts = (req, res) => {
  const query = `
    SELECT 
      id, 
      name, 
      price, 
      TIME_FORMAT(start_time, '%H:%i') as start_time,
      TIME_FORMAT(end_time, '%H:%i') as end_time,
      status
    FROM courts 
    WHERE status = 'active' 
    ORDER BY id ASC
  `
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching active courts:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: err.message 
      })
    }
    
    res.json({
      success: true,
      data: results,
      total: results.length
    })
  })
}

// เปลี่ยนสถานะสนาม
exports.toggleCourtStatus = (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุสถานะเป็น active หรือ inactive'
    })
  }
  
  const query = 'UPDATE courts SET status = ?, updated_at = NOW() WHERE id = ?'
  
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error toggling status:', err)
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ',
        error: err.message 
      })
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลสนาม'
      })
    }
    
    res.json({
      success: true,
      message: `เปลี่ยนสถานะเป็น ${status === 'active' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'} สำเร็จ`
    })
  })
}