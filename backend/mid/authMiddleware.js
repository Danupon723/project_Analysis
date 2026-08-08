const jwt = require('jsonwebtoken')

const SECRET = 'mysecretkey' // 👈 ต้องเหมือน login

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'ไม่มี token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'token ไม่ถูกต้อง' })
  }
}
exports.isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'ไม่มีข้อมูลผู้ใช้' })
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'คุณไม่ได้รับอนุญาต' })
  }
  next()
}