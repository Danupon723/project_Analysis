const db = require('../db')

// CREATE BOOKING
exports.createBooking = (req, res) => {
  const {
    booking_date,
    start_time,
    end_time,
    duration,
    quantity,
    total_price,
    paid_amount
  } = req.body

  // ✅ เช็คเวลาซ้ำก่อน
  db.query(
    `SELECT * FROM bookings 
     WHERE booking_date = ?
     AND (start_time < ? AND end_time > ?)`,
    [booking_date, end_time, start_time],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ตรวจสอบเวลาไม่สำเร็จ' })
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'เวลานี้ถูกจองแล้ว' })
      }

      // ✅ คำนวณสถานะ
      let payment_status = 'pending'
      if (paid_amount > 0 && paid_amount < total_price) payment_status = 'partial'
      if (paid_amount >= total_price) payment_status = 'paid'

      // ✅ บันทึกข้อมูล
      db.query(
        `INSERT INTO bookings 
        (booking_date, start_time, end_time, duration, quantity, total_price, paid_amount, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [booking_date, start_time, end_time, duration, quantity, total_price, paid_amount, payment_status],
        (err, result) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ message: 'สร้างการจองไม่สำเร็จ' })
          }
          res.json({ message: 'จองสำเร็จ', id: result.insertId })
        }
      )
    }
  )
}

// GET ALL BOOKINGS
exports.getAllBookings = (req, res) => {
  db.query(
    'SELECT * FROM bookings ORDER BY booking_date DESC',
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })
      }
      res.json(results)
    }
  )
}

// GET BY DATE
exports.getBookingsByDate = (req, res) => {
  const { date } = req.params

  db.query(
    'SELECT * FROM bookings WHERE booking_date = ?',
    [date],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })
      }
      res.json(results)
    }
  )
}

// COUNT PER DAY
exports.getBookingCount = (req, res) => {
  db.query(
    `SELECT booking_date, COUNT(*) as total_bookings
     FROM bookings
     GROUP BY booking_date`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })
      }
      res.json(results)
    }
  )
}

// INCOME PER DAY
exports.getIncome = (req, res) => {
  db.query(
    `SELECT booking_date, SUM(paid_amount) as total_income
     FROM bookings
     GROUP BY booking_date`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })
      }
      res.json(results)
    }
  )
}

exports.getDailyBookings = (req, res) => {
  db.query(
    `SELECT 
      DATE_FORMAT(booking_date, '%a') AS date,
      COUNT(*) AS total
    FROM bookings
    WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY booking_date
    ORDER BY booking_date ASC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })
      }
      res.json(results)
    }
  )
}



// GET BOOKED SLOTS BY DATE (สำหรับแสดงช่วงเวลาที่จองแล้ว)
exports.getBookedSlots = (req, res) => {
  const { date } = req.params

  db.query(
    `SELECT start_time, end_time FROM bookings WHERE booking_date = ?`,
    [date],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'ดึงข้อมูลไม่สำเร็จ' })

      // แปลงเป็น array ของ slot ที่ถูกจองแล้ว เช่น ['09:00', '10:00']
      const slots = []
      results.forEach(row => {
        const [sh] = row.start_time.split(':').map(Number)
        const [eh] = row.end_time.split(':').map(Number)
        for (let h = sh; h < eh; h++) {
          slots.push(`${String(h).padStart(2, '0')}:00`)
        }
      })

      res.json({ slots })
    }
  )
}

