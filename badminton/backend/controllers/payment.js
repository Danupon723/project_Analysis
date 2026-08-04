const db = require('../db')

exports.createBooking = (req, res) => {
  const {
    booking_date,
    start_time,
    end_time,
    duration,
    quantity,
    total_price,
    paid_amount = 0
  } = req.body

  // ✅ Validate
  if (!booking_date || !start_time || !end_time) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ' })
  }

  // ✅ คำนวณสถานะ
  let payment_status = 'pending'
  if (paid_amount > 0 && paid_amount < total_price) payment_status = 'partial'
  if (paid_amount >= total_price) payment_status = 'paid'

  // ✅ เช็คเวลาซ้ำ
  const checkSql = `
    SELECT * FROM bookings 
    WHERE booking_date = ?
    AND (start_time < ? AND end_time > ?)
  `

  db.query(checkSql, [booking_date, end_time, start_time], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'ตรวจสอบเวลาไม่สำเร็จ' })
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'ช่วงเวลานี้ถูกจองแล้ว' })
    }

    // ✅ insert
    const insertSql = `
      INSERT INTO bookings 
      (booking_date, start_time, end_time, duration, quantity, total_price, paid_amount, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.query(
      insertSql,
      [booking_date, start_time, end_time, duration, quantity, total_price, paid_amount, payment_status],
      (err, result) => {
        if (err) {
          console.log(err)
          return res.status(500).json({ message: 'สร้างการจองไม่สำเร็จ' })
        }

        res.json({ message: 'จองสำเร็จ', id: result.insertId })
      }
    )
  })
}