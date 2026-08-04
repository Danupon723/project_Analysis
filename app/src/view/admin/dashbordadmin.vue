<!-- src/views/admin/Dashboard.vue -->
<template>
  <div>
    <div class="stats-grid">
      <div class="stat-card" v-for="s in stats" :key="s.label" @click="handleStatClick(s)">
        <div class="stat-top">
          <div class="stat-icon" :class="s.iconClass">
            <i :class="['mdi', s.icon]"></i>
          </div>
          <span class="stat-badge" :class="s.badgeClass">{{ s.change }}</span>
        </div>
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>

    <div class="charts-row">
      <div class="card">
        <div class="card-title">แนวโน้มการจอง</div>
        <div class="chart-wrap">
          <canvas ref="lineCanvas"></canvas>
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="card">
        <div class="table-header">
          <div class="card-title" style="margin:0">Recent Bookings</div>
          <span class="view-all" @click="viewAllBookings">View All</span>
        </div>
        <table class="bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Court</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bookings" :key="b.customer" @click="viewBookingDetails(b)">
              <td>{{ b.customer }}</td>
              <td>
                <span class="court-tag" :class="b.tagClass">{{ b.court }}</span>
              </td>
              <td style="color: var(--col-muted); font-family: var(--font-mono); font-size:12px;">{{ b.time }}</td>
              <td>
                <span class="status-badge" :class="b.statusClass">{{ b.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-title">Court Status</div>
        <div class="court-list">
          <div class="court-item" v-for="c in courts" :key="c.name" @click="manageCourt(c)">
            <div class="court-left">
              <div class="status-dot" :class="c.dotClass"></div>
              <div>
                <div class="court-name">{{ c.name }}</div>
                <div class="court-sub">{{ c.sub }}</div>
              </div>
            </div>
            <span class="manage-btn">Manage</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import Chart from 'chart.js/auto'


const router = useRouter()
const showNotification = inject('showNotification', (msg, type) => {
  console.log(`[${type}] ${msg}`) // fallback กันพัง
})

const totalBookings = ref(0)


const lineCanvas = ref(null)
let lineChart = null

const stats = reactive([
  { label: 'ยอดจองทั้งหมด',value: '0', change: '+12%', icon: 'mdi-calendar-check', iconClass: 'icon-purple', badgeClass: 'badge-up' },
  { label: 'รายได้รวม', value: '0', change: '+8%', icon: 'mdi-currency-usd', iconClass: 'icon-mint', badgeClass: 'badge-up' },
  { label: 'ผู้ใช้ที่ใช้งานอยู่', value: '842', change: '-2%', icon: 'mdi-account-group', iconClass: 'icon-amber', badgeClass: 'badge-down' },
])

const bookings = reactive([
  { id: 1, customer: 'John Doe', court: 'Court #1 (Premium)', time: 'Today, 14:00', status: 'Confirmed', tagClass: 'tag-premium', statusClass: 'status-confirmed' },
  { id: 2, customer: 'Sarah Smith', court: 'Court #4 (Standard)', time: 'Today, 15:30', status: 'Pending', tagClass: 'tag-standard', statusClass: 'status-pending' },
  { id: 3, customer: 'Mike Johnson', court: 'Court #2 (Premium)', time: 'Today, 17:00', status: 'Confirmed', tagClass: 'tag-premium', statusClass: 'status-confirmed' },
  { id: 4, customer: 'Emily Brown', court: 'Court #3 (Standard)', time: 'Tomorrow, 09:00', status: 'Scheduled', tagClass: 'tag-standard', statusClass: 'status-scheduled' },
])

const courts = reactive([
  { name: 'Court 1', sub: 'Available', dotClass: 'dot-green' },
  { name: 'Court 2', sub: 'Occupied until 16:30', dotClass: 'dot-red' },
  { name: 'Court 3', sub: 'Maintenance', dotClass: 'dot-yellow' },
  { name: 'Court 4', sub: 'Available', dotClass: 'dot-green' },
])

const handleStatClick = (stat) => {
  if (stat.label === 'ยอดจองทั้งหมด') router.push('bookings')
  else if (stat.label === 'รายได้รวม') router.push('/admin/revenue')
  else if (stat.label === 'ผู้ใช้ที่ใช้งานอยู่') router.push('tables')
  showNotification(`Viewing ${stat.label} details`, 'info')
}


const viewAllBookings = () => router.push('/admin/bookings')
const viewBookingDetails = (booking) => showNotification(`Viewing booking for ${booking.customer}`, 'info')
const manageCourt = (court) => router.push('/admin/court-management')

const buildLineChart = (labels = [], data = []) => {
  if (!lineCanvas.value) return
  const ctx = lineCanvas.value.getContext('2d')

  if (lineChart) lineChart.destroy()
  lineChart = new Chart(ctx, {
    type: 'line', // 👈 เปลี่ยนจาก line เป็น bar
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: 'rgba(123, 104, 238, 0.7)',  // 👈 สีม่วง
        borderColor: '#7b68ee',
        borderWidth: 2,
        borderRadius: 6,        // 👈 มุมโค้งนิดนึง
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(123, 104, 238, 1)', // 👈 hover เข้มขึ้น
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#7a7a96' }
        },
        y: {
          grid: { color: 'rgba(122,122,150,0.1)' },
          ticks: { color: '#7a7a96' },
          beginAtZero: true
        }
      }
    }
  })
}
//การจองทั้งหมด
const fetchBookings = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/bookings-summary/count')
    const data = await res.json()

    // รวมยอดทั้งหมด
    const total = data.reduce((sum, item) => sum + Number(item.total_bookings), 0)

    totalBookings.value = total
    stats[0].value = Number(totalBookings.value).toLocaleString() // จะได้ "4" แทน "04"
  } catch (err) {
    console.error(err)
  }
}

// รายได้รวม
const fetchIncome = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/bookings-summary/income')
    const data = await res.json()

    const totalIncome = data.reduce((sum, item) => sum + Number(item.total_income), 0)

    stats[1].value = totalIncome.toLocaleString('en-US') + ' บาท'
  } catch (err) {
    console.error(err)
  }
}


// ผู้ใช้ที่ใช้งานอยู่
const fetchUsers = async () => {
  const token = localStorage.getItem('token') // 👈 ดึง token

  const res = await fetch('http://localhost:3000/api/users', {
    headers: {
      Authorization: `Bearer ${token}` // 👈 ใส่ตรงนี้
    }
  })

  const data = await res.json()

  console.log('Users:', data)

  stats[2].value = data.length.toLocaleString()
}

// ดึงข้อมูลการจองต่อวันมาแสดงในกราฟ
const fetchChartData = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/bookings-summary/daily')
    const data = await res.json()

    const labels = data.map(item => item.date)
    const values = data.map(item => item.total)

    buildLineChart(labels, values)

    console.log('Chart Data:', data)
  } catch (err) {
    console.error(err)
  }
}


onMounted(() => {
  fetchChartData()
  fetchBookings()
  fetchIncome()
  fetchUsers()
  
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* ✅ */
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--col-card);
  border: 1px solid var(--col-border);
  border-radius: var(--radius);
  padding: 18px 20px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: var(--radius) var(--radius) 0 0;
}

.stat-card:nth-child(1)::before {
  background: linear-gradient(90deg, var(--col-accent), transparent);
}

.stat-card:nth-child(2)::before {
  background: linear-gradient(90deg, var(--col-accent2), transparent);
}

.stat-card:nth-child(3)::before {
  background: linear-gradient(90deg, var(--col-accent3), transparent);
}

.stat-card:nth-child(4)::before {
  background: linear-gradient(90deg, #ff8fab, transparent);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.icon-purple {
  background: rgba(123, 104, 238, 0.12);
  color: var(--col-accent);
}

.icon-mint {
  background: rgba(86, 212, 160, 0.12);
  color: var(--col-accent2);
}

.icon-amber {
  background: rgba(247, 192, 92, 0.12);
  color: var(--col-accent3);
}

.icon-pink {
  background: rgba(255, 143, 171, 0.12);
  color: #ff8fab;
}

.stat-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
  font-family: var(--font-mono);
}

.badge-up {
  background: rgba(86, 212, 160, 0.12);
  color: var(--col-accent2);
}

.badge-down {
  background: rgba(255, 107, 107, 0.12);
  color: var(--col-danger);
}

.badge-neu {
  background: rgba(122, 122, 150, 0.12);
  color: var(--col-muted);
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--col-text);
  letter-spacing: -0.5px;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 12px;
  color: var(--col-muted);
  font-weight: 500;
}

.charts-row {
  grid-template-columns: 1fr; /* ✅ */
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 14px;
}

.card {
  background: var(--col-card);
  border: 1px solid var(--col-border);
  border-radius: var(--radius);
  padding: 20px 22px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--col-text);
  margin-bottom: 16px;
  letter-spacing: -0.2px;
}

.chart-wrap {
  position: relative;
  height: 220px;
}

.pie-legend {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--col-muted);
  font-weight: 500;
}

.leg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.view-all {
  font-size: 12px;
  color: var(--col-accent);
  cursor: pointer;
  font-weight: 600;
}

.view-all:hover {
  text-decoration: underline;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table th {
  font-size: 11px;
  font-weight: 600;
  color: var(--col-muted);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: 0 0 10px;
  text-align: left;
  border-bottom: 1px solid var(--col-border);
}

.bookings-table td {
  font-size: 13px;
  color: var(--col-text);
  padding: 12px 0;
  border-bottom: 1px solid rgba(42, 42, 56, 0.6);
}

.bookings-table tr:last-child td {
  border-bottom: none;
}

.bookings-table tr {
  cursor: pointer;
  transition: background 0.2s;
}

.bookings-table tr:hover td {
  background: rgba(123, 104, 238, 0.04);
}

.court-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 5px;
  font-weight: 600;
  white-space: nowrap;
}

.tag-premium {
  background: rgba(123, 104, 238, 0.12);
  color: var(--col-accent);
}

.tag-standard {
  background: rgba(86, 212, 160, 0.1);
  color: var(--col-accent2);
}

.status-badge {
  font-size: 11px;
  padding: 3px 9px;
  border-radius: 99px;
  font-weight: 600;
}

.status-confirmed {
  background: rgba(86, 212, 160, 0.1);
  color: var(--col-accent2);
}

.status-pending {
  background: rgba(247, 192, 92, 0.12);
  color: var(--col-accent3);
}

.status-scheduled {
  background: rgba(122, 122, 150, 0.1);
  color: var(--col-muted);
}

.court-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.court-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--col-surface);
  border: 1px solid var(--col-border);
  border-radius: 10px;
  padding: 11px 14px;
  transition: border-color 0.18s ease;
  cursor: pointer;
}

.court-item:hover {
  border-color: rgba(123, 104, 238, 0.3);
}

.court-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.status-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  opacity: 0.25;
}

.dot-green {
  background: #4ade80;
}

.dot-green::after {
  background: #4ade80;
}

.dot-red {
  background: var(--col-danger);
}

.dot-red::after {
  background: var(--col-danger);
}

.dot-yellow {
  background: var(--col-accent3);
}

.dot-yellow::after {
  background: var(--col-accent3);
}

.court-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--col-text);
}

.court-sub {
  font-size: 11px;
  color: var(--col-muted);
  margin-top: 1px;
}

.manage-btn {
  font-size: 11px;
  font-weight: 600;
  color: var(--col-accent);
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(123, 104, 238, 0.2);
  background: rgba(123, 104, 238, 0.06);
  transition: all 0.15s ease;
}

.manage-btn:hover {
  background: rgba(123, 104, 238, 0.15);
  border-color: rgba(123, 104, 238, 0.4);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeUp 0.4s ease both;
}

.stat-card:nth-child(1) {
  animation-delay: 0.06s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.12s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.18s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.24s;
}

.charts-row,
.bottom-row {
  animation: fadeUp 0.4s 0.28s ease both;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.dot-green {
  animation: pulse 2s ease-in-out infinite;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-row,
  .bottom-row {
    grid-template-columns: 1fr;
  }
}
</style>