const db = require('../db')



// ดึงผู้ใช้ทั้งหมด โดยไม่ต้องมีการตรวจสอบ token (สำหรับ local/dev)
exports.getAllUsers = (req, res) => {
  
  db.query('SELECT id, `name`, email, role, created_at FROM users', (err, results) => {
    if (err) {
      console.error('getAllUsers DB error:', err)
      return res.status(500).json({ message: err.message })
    }
    res.json(results)
  })
}


//เพิ่มผู้ใช้ใหม่ โดยรับข้อมูลจาก body ของ request และบันทึกลงฐานข้อมูล
exports.createUser = (req, res) => {
  if (!req.body) {
    console.error('createUser: req.body is undefined. headers:', req.headers)
    return res.status(400).json({ message: 'Request body is required' })
  }

  const { name, email, password, role } = req.body
  db.query(
    'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
    [name, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json({ message: 'User added', id: result.insertId })
    }
  )
}

// แก้ไขผู้ใช้
exports.updateUser = (req, res) => {
  const { id } = req.params
  const { name, email, password, role } = req.body

  let query = 'UPDATE users SET name=?, email=?, role=?'
  const params = [name, email, role]

  if (password) { // ถ้ามี password ใหม่
    query += ', password=?'
    params.push(password)
  }

  query += ' WHERE id=?'
  params.push(id)

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ message: err.message })
    res.json({ message: 'User updated' })
  })
}

// ลบผู้ใช้
exports.deleteUser = (req, res) => {
  const { id } = req.params
  db.query('DELETE FROM users WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ message: err.message })
    res.json({ message: 'User deleted' })
  })
}