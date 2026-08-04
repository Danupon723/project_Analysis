const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET = 'mysecretkey'

// ==============================================
// REGISTER - สมัครสมาชิก
// ==============================================
/**
 * @route   POST /api/register
 * @desc    สมัครสมาชิกใหม่
 * @body    { name, email, phone, password }
 * @returns {Object} { success, message, data }
 */
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body  // ✅ เพิ่ม phone ด้วย

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, อีเมล, เบอร์โทร, รหัสผ่าน)' 
    })
  }

  // ตรวจสอบรูปแบบอีเมล
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'รูปแบบอีเมลไม่ถูกต้อง' 
    })
  }

  // ตรวจสอบเบอร์โทร (ตัวเลข 10-15 หลัก)
  const phoneRegex = /^[0-9]{10,15}$/
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false,
      message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10-15 หลัก' 
    })
  }

  // ตรวจสอบความยาวรหัสผ่าน
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' 
    })
  }

  try {
    const hash = await bcrypt.hash(password, 10)

    // ถ้าตาราง users มีคอลัมน์ phone ให้ใส่ด้วย
    const query = `INSERT INTO users (name, email, phone, password, role, created_at) 
                   VALUES (?, ?, ?, ?, ?, NOW())`
    
    db.query(query, [name, email, phone, hash, 'user'], (err, result) => {
      if (err) {
        console.error('Register error:', err)
        
        // ตรวจสอบว่าเป็น error จาก email ซ้ำหรือไม่
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ 
            success: false,
            message: 'อีเมลนี้ถูกใช้งานแล้ว' 
          })
        }
        
        return res.status(400).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
          error: err.message 
        })
      }
      
      res.json({ 
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        data: {
          id: result.insertId,
          name: name,
          email: email,
          phone: phone,
          role: 'user'
        }
      })
    })
  } catch (err) {
    console.error('Hash error:', err)
    res.status(500).json({ 
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ',
      error: err.message 
    })
  }
}

// ==============================================
// LOGIN - เข้าสู่ระบบ
// ==============================================
/**
 * @route   POST /api/login
 * @desc    เข้าสู่ระบบ
 * @body    { email, password }
 * @returns {Object} { message, token, role, user }
 */
exports.login = (req, res) => {
  const { email, password } = req.body

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
    })
  }

  db.query(
    'SELECT id, name, email, phone, password, role, created_at FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Login DB error:', err)
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในระบบ',
          error: err.message 
        })
      }

      // ตรวจสอบว่ามีผู้ใช้หรือไม่
      if (!results || results.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'ไม่พบผู้ใช้ในระบบ' 
        })
      }

      const user = results[0]

      console.log('User login attempt:', { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      })

      // ตรวจสอบรหัสผ่าน
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(400).json({ 
          success: false,
          message: 'รหัสผ่านไม่ถูกต้อง' 
        })
      }

      // สร้าง JWT Token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          name: user.name,
          role: user.role 
        },
        SECRET,
        { expiresIn: '7d' }  // Token หมดอายุใน 7 วัน
      )

      // ส่งข้อมูลกลับ
      res.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        token: token,
        role: user.role,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      })
    }
  )
}

// ==============================================
// GET ME - ดึงข้อมูลผู้ใช้ปัจจุบัน (จาก token)
// ==============================================
/**
 * @route   GET /api/me
 * @desc    ดึงข้อมูลผู้ใช้ปัจจุบัน
 * @access  Private (ต้องมี token)
 * @returns {Object} { success, data }
 */
exports.getMe = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'ไม่พบ Token' 
    })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    
    db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [decoded.id],
      (err, results) => {
        if (err) {
          console.error('Get me error:', err)
          return res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในระบบ' 
          })
        }

        if (!results || results.length === 0) {
          return res.status(404).json({ 
            success: false,
            message: 'ไม่พบข้อมูลผู้ใช้' 
          })
        }

        res.json({
          success: true,
          data: results[0]
        })
      }
    )
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Token ไม่ถูกต้องหรือหมดอายุ' 
    })
  }
}

// ==============================================
// UPDATE PROFILE - อัปเดตข้อมูลผู้ใช้
// ==============================================
/**
 * @route   PUT /api/profile
 * @desc    อัปเดตข้อมูลผู้ใช้
 * @access  Private (ต้องมี token)
 * @body    { name, phone, password }
 * @returns {Object} { success, message }
 */
exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'ไม่พบ Token' 
    })
  }

  try {
    const decoded = jwt.verify(token, SECRET)
    const { name, phone, password } = req.body

    let query = 'UPDATE users SET name = ?, phone = ?'
    const params = [name, phone]

    // ถ้ามีการเปลี่ยนรหัสผ่าน
    if (password && password.length >= 6) {
      const hash = await bcrypt.hash(password, 10)
      query += ', password = ?'
      params.push(hash)
    }

    query += ', updated_at = NOW() WHERE id = ?'
    params.push(decoded.id)

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Update profile error:', err)
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' 
        })
      }

      res.json({
        success: true,
        message: 'อัปเดตข้อมูลสำเร็จ'
      })
    })
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Token ไม่ถูกต้องหรือหมดอายุ' 
    })
  }
}