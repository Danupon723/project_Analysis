const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const bookingRoutes = require('./routes/bookings')  
const paymentRoutes = require('./routes/Payment')
const courtRoutes = require('./routes/courts')  

app.use('/api', authRoutes)
app.use('/api', adminRoutes)
app.use('/api', bookingRoutes)
app.use('/api', paymentRoutes)
app.use('/api', courtRoutes)  

app.get('/', (req, res) => {
  res.send('API is running...')
})

module.exports = app