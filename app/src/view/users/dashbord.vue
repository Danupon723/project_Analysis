<!-- src/views/user/UserDashboard.vue -->
<template>
  <div>
    <!-- สถานะสนามที่ว่าง -->
    <div class="section-header">
      <h3>สถานะสนามวันนี้</h3>
      <span class="date-badge">{{ todayDate }}</span>
    </div>
    <div class="courts-grid">
      <div 
        class="court-card" 
        v-for="court in courts" 
        :key="court.id"
        @click="navigateToBooking(court)"
      >
        <div class="court-header">
          <span class="court-name">{{ court.name }}</span>
          <div class="status-dot" :class="court.statusClass"></div>
        </div>
        <div class="court-status-text" :class="court.statusTextClass">
          {{ court.statusText }}
        </div>
        <div class="court-price">{{ court.price }} บาท/ชม.</div>
        <button class="book-btn">จองเลย</button>
      </div>
    </div>

    <!-- รายการจองของฉันวันนี้ -->
    <div class="section-header" style="margin-top: 28px;">
      <h3>การจองของฉันวันนี้</h3>
      <span class="view-all" @click="viewAllMyBookings">ดูทั้งหมด</span>
    </div>

    <div class="card">
      <div v-if="todayBookings.length === 0" class="empty-state">
        <i class="mdi mdi-calendar-blank"></i>
        <p>ไม่มีรายการจองในวันนี้</p>
        <button class="primary-btn" @click="navigateToBooking">จองสนามเลย</button>
      </div>
      <div v-else class="bookings-list">
        <div class="booking-item" v-for="booking in todayBookings" :key="booking.id">
          <div class="booking-info">
            <div class="booking-court">{{ booking.court_name }}</div>
            <div class="booking-time">
              <i class="mdi mdi-clock-outline"></i>
              {{ booking.time }}
            </div>
            <div class="booking-duration">
              <i class="mdi mdi-timer-outline"></i>
              {{ booking.duration }} ชั่วโมง
            </div>
            <div class="booking-price">
              <i class="mdi mdi-currency-usd"></i>
              {{ booking.price }} บาท
            </div>
            <div class="status-badge" :class="booking.statusClass">
              {{ booking.status }}
            </div>
          </div>
          <div class="booking-actions">
            <button class="action-btn edit-btn" @click="editBooking(booking)">
              <i class="mdi mdi-pencil"></i>
              แก้ไข
            </button>
            <button class="action-btn cancel-btn" @click="confirmCancel(booking)">
              <i class="mdi mdi-close"></i>
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { inject } from 'vue'

const router = useRouter()
const showNotification = inject('showNotification', (msg, type) => {
  console.log(`[${type}] ${msg}`)
})

// วันที่วันนี้
const todayDate = computed(() => {
  const today = new Date()
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`
})

// สนามที่ว่าง (ข้อมูลจำลอง - จะถูกแทนที่ด้วย API จริง)
const courts = ref([
  { id: 1, name: 'สนามที่ 1', status: 'available', statusText: 'ว่าง', statusClass: 'status-available', statusTextClass: 'text-available', price: 300 },
  { id: 2, name: 'สนามที่ 2', status: 'busy', statusText: 'ไม่ว่าง 16:30 น.', statusClass: 'status-busy', statusTextClass: 'text-busy', price: 300 },
  { id: 3, name: 'สนามที่ 3', status: 'maintenance', statusText: 'ปิดซ่อมบำรุง', statusClass: 'status-maintenance', statusTextClass: 'text-maintenance', price: 300 },
  { id: 4, name: 'สนามที่ 4', status: 'available', statusText: 'ว่าง', statusClass: 'status-available', statusTextClass: 'text-available', price: 250 },
])

// การจองของฉันวันนี้
const todayBookings = ref([
  { 
    id: 1, 
    court_name: 'สนามที่ 1', 
    date: '2026-04-14',
    time: '14:00 - 15:00',
    duration: 1,
    price: 300,
    status: 'confirmed',
    statusClass: 'status-confirmed'
  },
  { 
    id: 2, 
    court_name: 'สนามที่ 4', 
    date: '2026-04-14',
    time: '17:00 - 19:00',
    duration: 2,
    price: 500,
    status: 'pending',
    statusClass: 'status-pending'
  },
])

// ดึงข้อมูลสนามจาก API
const fetchCourtsStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3000/api/courts/status', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      courts.value = data
    }
  } catch (err) {
    console.error('Error fetching courts:', err)
  }
}

// ดึงการจองของวันนี้
const fetchTodayBookings = async () => {
  try {
    const token = localStorage.getItem('token')
    const today = new Date().toISOString().split('T')[0]
    
    const res = await fetch(`http://localhost:3000/api/bookings/my-today?date=${today}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      todayBookings.value = data
    }
  } catch (err) {
    console.error('Error fetching today bookings:', err)
  }
}

// นำทางไปหน้าจอง
const navigateToBooking = (court = null) => {
  if (court) {
    router.push({ path: '/user/booking', query: { court: court.id } })
  } else {
    router.push('/user/booking')
  }
}

// ดูการจองทั้งหมด
const viewAllMyBookings = () => {
  router.push('/user/my-bookings')
}

// แก้ไขรายละเอียดการจอง
const editBooking = (booking) => {
  router.push({ 
    path: '/user/edit-booking', 
    query: { id: booking.id }
  })
  showNotification(`กำลังแก้ไขการจอง ${booking.court_name}`, 'info')
}

// ยืนยันการยกเลิก
const confirmCancel = (booking) => {
  if (confirm(`คุณต้องการยกเลิกการจอง ${booking.court_name} เวลา ${booking.time} ใช่หรือไม่?`)) {
    cancelBooking(booking)
  }
}

// ยกเลิกการจอง
const cancelBooking = async (booking) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3000/api/bookings/${booking.id}/cancel`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (res.ok) {
      showNotification(`ยกเลิกการจอง ${booking.court_name} เรียบร้อย`, 'success')
      // อัปเดตข้อมูลใหม่
      await fetchTodayBookings()
      await fetchCourtsStatus()
    } else {
      const error = await res.json()
      showNotification(error.message || 'ยกเลิกไม่สำเร็จ', 'error')
    }
  } catch (err) {
    console.error('Error canceling booking:', err)
    showNotification('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error')
  }
}

onMounted(() => {
  fetchCourtsStatus()
  fetchTodayBookings()
})
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--col-text);
  margin: 0;
}

.date-badge {
  font-size: 12px;
  padding: 4px 12px;
  background: rgba(123, 104, 238, 0.12);
  color: var(--col-accent);
  border-radius: 20px;
  font-weight: 600;
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

/* สนามที่ว่าง Grid */
.courts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 8px;
}

.court-card {
  background: var(--col-card);
  border: 1px solid var(--col-border);
  border-radius: var(--radius);
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.court-card:hover {
  transform: translateY(-2px);
  border-color: rgba(123, 104, 238, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.court-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.court-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--col-text);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-available {
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
}

.status-busy {
  background: var(--col-danger);
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
}

.status-maintenance {
  background: var(--col-accent3);
  box-shadow: 0 0 0 3px rgba(247, 192, 92, 0.2);
}

.court-status-text {
  font-size: 12px;
  margin-bottom: 10px;
}

.text-available {
  color: #4ade80;
}

.text-busy {
  color: var(--col-danger);
}

.text-maintenance {
  color: var(--col-accent3);
}

.court-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--col-accent2);
  margin-bottom: 12px;
}

.book-btn {
  width: 100%;
  padding: 8px;
  background: var(--col-accent);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn:hover {
  background: #8b7aee;
  transform: scale(1.02);
}

/* Card */
.card {
  background: var(--col-card);
  border: 1px solid var(--col-border);
  border-radius: var(--radius);
  padding: 20px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-state i {
  font-size: 48px;
  color: var(--col-muted);
  margin-bottom: 16px;
  display: inline-block;
}

.empty-state p {
  color: var(--col-muted);
  margin-bottom: 20px;
}

.primary-btn {
  padding: 10px 24px;
  background: var(--col-accent);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #8b7aee;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--col-surface);
  border: 1px solid var(--col-border);
  border-radius: 12px;
  transition: all 0.2s;
}

.booking-item:hover {
  border-color: rgba(123, 104, 238, 0.3);
}

.booking-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.booking-court {
  font-size: 15px;
  font-weight: 700;
  color: var(--col-text);
  min-width: 100px;
}

.booking-time, .booking-duration, .booking-price {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--col-muted);
}

.booking-time i, .booking-duration i, .booking-price i {
  font-size: 14px;
}

.status-badge {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 99px;
  font-weight: 600;
}

.status-confirmed {
  background: rgba(86, 212, 160, 0.12);
  color: var(--col-accent2);
}

.status-pending {
  background: rgba(247, 192, 92, 0.12);
  color: var(--col-accent3);
}

.booking-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  background: rgba(123, 104, 238, 0.12);
  color: var(--col-accent);
  border: 1px solid rgba(123, 104, 238, 0.2);
}

.edit-btn:hover {
  background: rgba(123, 104, 238, 0.2);
}

.cancel-btn {
  background: rgba(255, 107, 107, 0.12);
  color: var(--col-danger);
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.cancel-btn:hover {
  background: rgba(255, 107, 107, 0.2);
}

/* Animation */
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

.courts-grid > *,
.card {
  animation: fadeUp 0.3s ease both;
}

/* Responsive */
@media (max-width: 768px) {
  .booking-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .booking-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .booking-actions {
    justify-content: flex-end;
  }
  
  .courts-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .courts-grid {
    grid-template-columns: 1fr;
  }
}
</style>