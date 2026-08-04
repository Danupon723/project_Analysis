<template>
  <v-app>
    <div class="page-bg">
      
      <!-- Header Section -->
      <div class="header-card elevation-0">
        <div class="shuttlecock-bg-icon">🏸</div>
        <v-container fluid>
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="mr-4">
              <div class="court-icon-bg">
                <v-icon color="white" size="28">mdi-badminton</v-icon>
              </div>
            </v-col>
            <v-col>
              <div class="title-font" style="color: white; font-size: 24px; font-weight: 700;">
               รายชื่อการจองสนามแบดมินตันทั้งหมด
              </div>
              <div style="color: rgba(255,255,255,0.7); font-size: 14px;">
                List of all badminton court bookings.
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="header-date">
                <div>{{ today }}</div>
                <div class="date-subtitle">อัปเดตล่าสุด</div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Main Content -->
      <v-container class="main-container">
        
        <!-- Statistics Cards -->
        <v-row class="mb-6" dense>
          <v-col cols="6" sm="3">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #1a3a4f;">
                  <v-icon color="#4fc3f7" size="24">mdi-calendar-check</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ bookings.length }}</div>
                  <div class="stats-label">การจองทั้งหมด</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #0d2e3e;">
                  <v-icon color="#81c784" size="24">mdi-check-circle</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ paidCount }}</div>
                  <div class="stats-label">ชำระแล้ว</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #1e3a3a;">
                  <v-icon color="#ffb74d" size="24">mdi-clock-outline</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ partialCount }}</div>
                  <div class="stats-label">ชำระบางส่วน</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="3">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #1a3a4f;">
                  <v-icon color="#ffd54f" size="24">mdi-currency-usd</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ totalRevenue.toLocaleString() }}</div>
                  <div class="stats-label">รายได้รวม (฿)</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Table Card -->
        <v-card class="main-table-card" elevation="4">
          
          <!-- Toolbar -->
          <div class="table-toolbar">
            <v-row align="center" no-gutters class="mb-3">
              <v-col>
                <span class="toolbar-title">
                  <v-icon size="20" class="mr-2">mdi-format-list-bulleted</v-icon>
                  รายการจองสนามทั้งหมด
                </span>
                <span class="toolbar-count">{{ filteredBookings.length }} รายการ</span>
              </v-col>
              <v-col cols="auto">
                <v-btn class="add-btn" prepend-icon="mdi-plus" @click="openAddDialog" :loading="loading">
                  เพิ่มการจอง
                </v-btn>
              </v-col>
            </v-row>

            <!-- Search & Filters -->
            <v-row align="center" dense>
              <v-col cols="12" sm="5" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="ค้นหาชื่อ, วันที่, สถานะ..."
                  density="compact"
                  variant="solo-filled"
                  hide-details
                  bg-color="rgba(0,0,0,0.3)"
                  class="search-field"
                />
              </v-col>
              <v-col class="filter-chips">
                <v-chip
                  v-for="f in filters"
                  :key="f.value"
                  size="small"
                  class="filter-chip"
                  :class="{ 'active-chip': activeFilter === f.value }"
                  variant="tonal"
                  @click="activeFilter = f.value"
                >
                  {{ f.label }}
                </v-chip>
              </v-col>
            </v-row>
          </div>

          <!-- Loading State -->
          <v-progress-linear v-if="loading" indeterminate color="#4fc3f7"></v-progress-linear>

          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="filteredBookings"
            :search="search"
            item-value="id"
            hover
            :items-per-page="10"
            :loading="loading"
            no-data-text=""
            class="booking-table"
          >
            <template v-slot:no-data>
              <div class="empty-state">
                <v-icon size="56" color="#4fc3f7">mdi-badminton</v-icon>
                <div class="empty-text">ไม่พบรายการจอง</div>
              </div>
            </template>

            <template v-slot:item.index="{ index }">
              <span class="row-badge">{{ index + 1 }}</span>
            </template>

            <template v-slot:item.customer_name="{ item }">
              <div class="customer-cell">
                <v-avatar size="32" :color="getAvatarColor(item.customer_name)" class="customer-avatar">
                  {{ item.customer_name?.charAt(0).toUpperCase() || '?' }}
                </v-avatar>
                <span class="customer-name">{{ item.customer_name }}</span>
              </div>
            </template>

            <template v-slot:item.booking_date="{ item }">
              <div class="date-cell">
                <v-icon size="14" color="#4fc3f7">mdi-calendar</v-icon>
                <span>{{ formatDateThai(item.booking_date) }}</span>
              </div>
            </template>

            <template v-slot:item.start_time="{ item }">
              <div class="time-cell">
                <span>{{ item.start_time }}</span>
                <span class="time-arrow">→</span>
                <span>{{ item.end_time }}</span>
              </div>
            </template>

            <template v-slot:item.duration="{ item }">
              <v-chip size="x-small" variant="tonal" class="duration-chip">
                <v-icon start size="12">mdi-timer-outline</v-icon>
                {{ item.duration }} ชม.
              </v-chip>
            </template>

            <template v-slot:item.quantity="{ item }">
              <div class="quantity-cell">
                <v-icon size="14" color="#4fc3f7">mdi-racket</v-icon>
                {{ item.quantity }}
              </div>
            </template>

            <template v-slot:item.total_price="{ item }">
              <span class="price-primary">฿{{ formatNumber(item.total_price) }}</span>
            </template>

            <template v-slot:item.paid_amount="{ item }">
              <span class="price-secondary">฿{{ formatNumber(item.paid_amount) }}</span>
            </template>

            <template v-slot:item.payment_status="{ item }">
              <v-chip size="small" :class="getStatusClass(item.payment_status)">
                <v-icon start size="14">{{ getStatusIcon(item.payment_status) }}</v-icon>
                {{ getStatusLabel(item.payment_status) }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon size="small" variant="text" class="action-edit" @click="openEditDialog(item)">
                <v-icon size="18">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" class="action-delete" @click="confirmDelete(item)">
                <v-icon size="18">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="600" persistent>
        <v-card class="dialog-card">
          <div class="dialog-header">
            <v-row align="center" no-gutters>
              <v-col>
                <v-icon color="white" class="mr-2">{{ editMode ? 'mdi-pencil-circle' : 'mdi-plus-circle' }}</v-icon>
                <span class="dialog-title">{{ editMode ? 'แก้ไขการจอง' : 'เพิ่มการจองใหม่' }}</span>
              </v-col>
              <v-col cols="auto">
                <v-btn icon variant="text" color="white" @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <v-card-text class="dialog-content">
            <v-form ref="form" v-model="valid">
              <v-row dense>
                <!-- ชื่อผู้จอง - เพิ่มเข้ามา -->
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.customer_name"
                    label="ชื่อผู้จอง"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณากรอกชื่อผู้จอง']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.booking_date"
                    label="วันที่จอง"
                    type="date"
                    prepend-inner-icon="mdi-calendar"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณาเลือกวันที่']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.duration"
                    label="ระยะเวลา (ชั่วโมง)"
                    type="number"
                    prepend-inner-icon="mdi-timer"
                    variant="outlined"
                    color="#2c7da0"
                    min="1"
                    :rules="[v => v > 0 || 'ระบุระยะเวลา']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.start_time"
                    label="เวลาเริ่ม"
                    type="time"
                    prepend-inner-icon="mdi-clock-start"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณาเลือกเวลาเริ่ม']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.end_time"
                    label="เวลาสิ้นสุด"
                    type="time"
                    prepend-inner-icon="mdi-clock-end"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณาเลือกเวลาสิ้นสุด']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.quantity"
                    label="จำนวนสนาม"
                    type="number"
                    prepend-inner-icon="mdi-racket"
                    variant="outlined"
                    color="#2c7da0"
                    min="1"
                    :rules="[v => v > 0 || 'ระบุจำนวนสนาม']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.total_price"
                    label="ราคารวม (บาท)"
                    type="number"
                    prepend-inner-icon="mdi-currency-usd"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => v >= 0 || 'ระบุราคา']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.paid_amount"
                    label="ยอดที่ชำระ (บาท)"
                    type="number"
                    prepend-inner-icon="mdi-cash"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => v >= 0 || 'ระบุยอดชำระ']"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.payment_status"
                    :items="paymentStatuses"
                    item-title="text"
                    item-value="value"
                    label="สถานะการชำระเงิน"
                    prepend-inner-icon="mdi-credit-card"
                    variant="outlined"
                    color="#2c7da0"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="dialog-actions">
            <v-btn variant="outlined" class="cancel-btn" @click="dialog = false">ยกเลิก</v-btn>
            <v-btn class="save-btn" @click="saveBooking" :loading="loading">
              <v-icon start>mdi-content-save</v-icon>
              {{ editMode ? 'บันทึก' : 'เพิ่มการจอง' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirm Dialog -->
      <v-dialog v-model="deleteDialog" max-width="380">
        <v-card class="delete-dialog-card">
          <v-card-text class="delete-dialog-text">
            <v-icon size="56" color="#e74c3c" class="mb-3">mdi-delete-alert</v-icon>
            <div class="delete-title">ยืนยันการลบ</div>
            <div class="delete-message">
              ต้องการลบการจองของ <strong class="delete-name">{{ deleteTarget?.customer_name }}</strong> ใช่หรือไม่?
            </div>
          </v-card-text>
          <v-card-actions class="delete-dialog-actions">
            <v-btn variant="outlined" class="cancel-delete-btn" @click="deleteDialog = false">ยกเลิก</v-btn>
            <v-btn color="#e74c3c" class="confirm-delete-btn" @click="deleteBooking" :loading="loading">ลบ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar Notification -->
      <v-snackbar v-model="snackbar" :color="snackColor" rounded="lg" location="bottom right" timeout="3000">
        <v-icon start>{{ snackIcon }}</v-icon>
        {{ snackMsg }}
      </v-snackbar>

    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// API Configuration
const API_URL = 'http://localhost:3000/api/bookings'

// State
const bookings = ref([])
const loading = ref(false)
const search = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const valid = ref(true)
const deleteTarget = ref(null)
const form = ref(null)

// Snackbar
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('')
const snackIcon = ref('')

// Today's date
const today = ref(new Date().toLocaleDateString('th-TH', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

// Form data
const formData = ref({
  id: null,
  customer_name: '',
  booking_date: '',
  start_time: '',
  end_time: '',
  duration: 1,
  quantity: 1,
  total_price: 0,
  paid_amount: 0,
  payment_status: 'pending'
})

// Payment status options
const paymentStatuses = [
  { text: 'ชำระแล้ว', value: 'paid' },
  { text: 'รอชำระเงิน', value: 'pending' },
  { text: 'ชำระบางส่วน', value: 'partial' }
]

// Filters
const filters = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'ชำระแล้ว', value: 'paid' },
  { label: 'ชำระบางส่วน', value: 'partial' },
  { label: 'ยังไม่ชำระ', value: 'pending' }
]
const activeFilter = ref('all')

// Table headers
const headers = [
  { title: 'ที่', key: 'index', sortable: false, width: '60px', align: 'center' },
  { title: 'ชื่อผู้จอง', key: 'customer_name', sortable: true },
  { title: 'วันที่จอง', key: 'booking_date', sortable: true },
  { title: 'เวลา', key: 'start_time', sortable: false },
  { title: 'ระยะเวลา', key: 'duration', sortable: true, align: 'center' },
  { title: 'สนาม', key: 'quantity', sortable: true, align: 'center' },
  { title: 'ราคารวม', key: 'total_price', sortable: true, align: 'end' },
  { title: 'ยอดชำระ', key: 'paid_amount', sortable: true, align: 'end' },
  { title: 'สถานะ', key: 'payment_status', sortable: true, align: 'center' },
  { title: 'จัดการ', key: 'actions', sortable: false, align: 'center', width: '90px' }
]

// Computed
const filteredBookings = computed(() => {
  let filtered = bookings.value
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(b => b.payment_status === activeFilter.value)
  }
  // เพิ่มการค้นหาด้วย customer_name
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(b => 
      b.customer_name?.toLowerCase().includes(searchLower) ||
      b.booking_date?.includes(searchLower) ||
      b.payment_status?.toLowerCase().includes(searchLower)
    )
  }
  return filtered
})

const paidCount = computed(() => bookings.value.filter(b => b.payment_status === 'paid').length)
const partialCount = computed(() => bookings.value.filter(b => b.payment_status === 'partial').length)
const totalRevenue = computed(() => {
  if (!bookings.value.length) return 0
  return bookings.value.reduce((sum, booking) => {
    const amount = typeof booking.paid_amount === 'string' 
      ? parseFloat(booking.paid_amount) 
      : (booking.paid_amount || 0)
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
})

// ============= Helper Functions =============

const formatNumber = (num) => {
  const number = typeof num === 'string' ? parseFloat(num) : (num || 0)
  if (isNaN(number)) return '0'
  return number.toLocaleString()
}

// แก้ไขฟังก์ชัน formatDateThai ให้รองรับหลายรูปแบบ
const formatDateThai = (dateStr) => {
  if (!dateStr) return '-'
  
  try {
    let year, month, day
    
    // กรณีที่มี T (ISO format: 2026-04-12T17:00:00.000Z)
    if (dateStr.includes('T')) {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      
      year = date.getUTCFullYear()
      month = date.getUTCMonth() + 1
      day = date.getUTCDate()
    }
    // กรณี YYYY-MM-DD
    else if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
      const parts = dateStr.split('-')
      year = parseInt(parts[0])
      month = parseInt(parts[1])
      day = parseInt(parts[2])
    }
    // กรณี DD/MM/YYYY อยู่แล้ว
    else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}/)) {
      return dateStr
    }
    else {
      return dateStr
    }
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr
    
    const buddhistYear = year + 543
    const dayStr = day.toString().padStart(2, '0')
    const monthStr = month.toString().padStart(2, '0')
    
    return `${dayStr}/${monthStr}/${buddhistYear}`
  } catch (error) {
    console.error('Date format error:', error)
    return dateStr
  }
}

// ฟังก์ชันจัดรูปแบบเวลา
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  
  if (timeStr.includes('T') || timeStr.includes('Z')) {
    try {
      const date = new Date(timeStr)
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      }
    } catch (e) {}
  }
  
  const timeMatch = timeStr.match(/^(\d{2}):(\d{2})/)
  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`
  }
  
  return timeStr
}

const getStatusClass = (status) => {
  const classes = {
    paid: 'status-paid',
    partial: 'status-partial',
    pending: 'status-unpaid'
  }
  return classes[status] || 'status-unpaid'
}

const getStatusLabel = (status) => {
  const labels = {
    paid: 'ชำระครบ',
    partial: 'บางส่วน',
    pending: 'ยังไม่ชำระ'
  }
  return labels[status] || status
}

const getStatusIcon = (status) => {
  const icons = {
    paid: 'mdi-check-circle',
    partial: 'mdi-clock-outline',
    pending: 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const avatarColors = ['#2c7da0', '#3498db', '#2e86c1', '#2874a6', '#1b4f72', '#0d3b4f', '#1abc9c', '#16a085']
const getAvatarColor = (name) => {
  if (!name) return '#2c7da0'
  const index = name.charCodeAt(0) % avatarColors.length
  return avatarColors[index]
}

const showSnack = (msg, color, icon) => {
  snackMsg.value = msg
  snackColor.value = color
  snackIcon.value = icon
  snackbar.value = true
}

// ============= API Functions =============

const fetchBookings = async () => {
  loading.value = true
  try {
    const response = await axios.get(API_URL)
    bookings.value = response.data.map(booking => ({
      ...booking,
      paid_amount: typeof booking.paid_amount === 'string' 
        ? parseFloat(booking.paid_amount) 
        : (booking.paid_amount || 0),
      total_price: typeof booking.total_price === 'string' 
        ? parseFloat(booking.total_price) 
        : (booking.total_price || 0),
      duration: typeof booking.duration === 'string' 
        ? parseInt(booking.duration) 
        : (booking.duration || 0),
      quantity: typeof booking.quantity === 'string' 
        ? parseInt(booking.quantity) 
        : (booking.quantity || 1)
    }))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    showSnack('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error', 'mdi-alert')
  } finally {
    loading.value = false
  }
}

const createBooking = async (data) => {
  loading.value = true
  try {
    await axios.post(API_URL, data)
    showSnack('เพิ่มการจองเรียบร้อย', 'success', 'mdi-check-circle')
    await fetchBookings()
  } catch (error) {
    console.error('Error creating booking:', error)
    showSnack('เกิดข้อผิดพลาดในการเพิ่มข้อมูล', 'error', 'mdi-alert')
    throw error
  } finally {
    loading.value = false
  }
}

const updateBooking = async (id, data) => {
  loading.value = true
  try {
    await axios.put(`${API_URL}/${id}`, data)
    showSnack('แก้ไขข้อมูลเรียบร้อย', 'success', 'mdi-check-circle')
    await fetchBookings()
  } catch (error) {
    console.error('Error updating booking:', error)
    showSnack('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error', 'mdi-alert')
    throw error
  } finally {
    loading.value = false
  }
}

const deleteBookingAPI = async (id) => {
  loading.value = true
  try {
    await axios.delete(`${API_URL}/${id}`)
    showSnack('ลบการจองเรียบร้อย', 'success', 'mdi-check-circle')
    await fetchBookings()
  } catch (error) {
    console.error('Error deleting booking:', error)
    showSnack('เกิดข้อผิดพลาดในการลบข้อมูล', 'error', 'mdi-alert')
    throw error
  } finally {
    loading.value = false
  }
}

// ============= UI Functions =============

const openAddDialog = () => {
  editMode.value = false
  formData.value = {
    id: null,
    customer_name: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    duration: 1,
    quantity: 1,
    total_price: 0,
    paid_amount: 0,
    payment_status: 'pending'
  }
  dialog.value = true
}

const openEditDialog = (item) => {
  editMode.value = true
  formData.value = { ...item }
  dialog.value = true
}

const saveBooking = async () => {
  if (!form.value) return
  
  const { valid: isValid } = await form.value.validate()
  if (!isValid) return
  
  try {
    if (editMode.value) {
      await updateBooking(formData.value.id, formData.value)
    } else {
      await createBooking(formData.value)
    }
    dialog.value = false
  } catch (error) {}
}

const confirmDelete = (item) => {
  deleteTarget.value = item
  deleteDialog.value = true
}

const deleteBooking = async () => {
  if (!deleteTarget.value) return
  try {
    await deleteBookingAPI(deleteTarget.value.id)
    deleteDialog.value = false
    deleteTarget.value = null
  } catch (error) {}
}

// Lifecycle
onMounted(() => {
  fetchBookings()
})
</script>

<style>
* {
  font-family: 'Sarabun', 'Kanit', sans-serif;
}

.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a1628 0%, #0d2137 30%, #0f2a3f 100%);
  position: relative;
}

/* Header */
.header-card {
  background: linear-gradient(135deg, #0f2a3f 0%, #1a3a4f 100%) !important;
  border-bottom: 3px solid #2c7da0;
  padding: 20px 0;
  position: relative;
  overflow: hidden;
}

.shuttlecock-bg-icon {
  position: absolute;
  right: 20px;
  bottom: -20px;
  font-size: 100px;
  opacity: 0.06;
  pointer-events: none;
}

.court-icon-bg {
  width: 56px;
  height: 56px;
  background: rgba(44, 125, 160, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(44, 125, 160, 0.5);
}

.title-font {
  font-family: 'Kanit', sans-serif !important;
  letter-spacing: -0.5px;
}

.header-date {
  text-align: right;
  color: rgba(255,255,255,0.85);
  font-size: 13px;
}

.date-subtitle {
  font-size: 11px;
  opacity: 0.6;
}

/* Main Container */
.main-container {
  padding: 24px 28px;
  max-width: 1400px;
}

/* Stats Cards */
.stats-card {
  background: rgba(15, 42, 63, 0.9) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px !important;
  border: 1px solid rgba(44, 125, 160, 0.3) !important;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-3px);
  border-color: rgba(44, 125, 160, 0.6) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  font-family: 'Kanit', sans-serif;
}

.stats-label {
  font-size: 12px;
  color: #88b4d4;
  margin-top: 4px;
}

/* Main Table Card */
.main-table-card {
  background: rgba(10, 22, 40, 0.95) !important;
  backdrop-filter: blur(8px);
  border-radius: 24px !important;
  border: 1px solid rgba(44, 125, 160, 0.3) !important;
  overflow: hidden;
}

.table-toolbar {
  background: linear-gradient(90deg, #0f2a3f, #1a3a4f);
  padding: 20px 24px;
  border-bottom: 1px solid rgba(44, 125, 160, 0.3);
}

.toolbar-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  font-family: 'Kanit', sans-serif;
}

.toolbar-count {
  margin-left: 10px;
  font-size: 13px;
  color: #4fc3f7;
  background: rgba(44, 125, 160, 0.3);
  padding: 2px 10px;
  border-radius: 20px;
}

.add-btn {
  background: linear-gradient(135deg, #2c7da0, #3498db) !important;
  color: white !important;
  border-radius: 12px !important;
  font-family: 'Kanit', sans-serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  box-shadow: 0 4px 15px rgba(44, 125, 160, 0.4) !important;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(44, 125, 160, 0.6) !important;
}

.search-field :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(0,0,0,0.4) !important;
}

.search-field :deep(.v-field__input) {
  color: white !important;
}

.search-field :deep(.v-field__input::placeholder) {
  color: rgba(255,255,255,0.5) !important;
}

.filter-chips {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.filter-chip {
  background: rgba(44, 125, 160, 0.2) !important;
  color: #88b4d4 !important;
  border-radius: 20px !important;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip.active-chip {
  background: #2c7da0 !important;
  color: white !important;
}

/* Data Table Styling */
.booking-table :deep(.v-data-table__wrapper) {
  background: rgba(10, 22, 40, 0.8);
}

.booking-table :deep(table) {
  background: transparent !important;
}

.booking-table :deep(thead tr th) {
  background: rgba(15, 42, 63, 0.8) !important;
  color: #4fc3f7 !important;
  font-family: 'Kanit', sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-bottom: 2px solid rgba(44, 125, 160, 0.4) !important;
  padding: 14px 12px !important;
}

.booking-table :deep(tbody tr) {
  transition: all 0.2s;
}

.booking-table :deep(tbody tr:hover td) {
  background: rgba(44, 125, 160, 0.1) !important;
}

.booking-table :deep(tbody tr td) {
  color: #e0e0e0 !important;
  border-bottom: 1px solid rgba(44, 125, 160, 0.2) !important;
  padding: 14px 12px !important;
}

.row-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(44, 125, 160, 0.3);
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  color: #4fc3f7;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  font-size: 13px;
  font-weight: 700;
}

.customer-name {
  font-weight: 600;
  color: #e0e0e0;
}

.date-cell, .time-cell, .quantity-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.time-arrow {
  color: rgba(79, 195, 247, 0.5);
  margin: 0 4px;
}

.duration-chip {
  background: rgba(44, 125, 160, 0.2) !important;
  color: #4fc3f7 !important;
}

.price-primary {
  font-weight: 700;
  color: #4fc3f7;
}

.price-secondary {
  font-weight: 600;
  color: #88b4d4;
}

/* Status Chips */
.status-paid {
  background: rgba(46, 204, 113, 0.2) !important;
  color: #81c784 !important;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-partial {
  background: rgba(255, 183, 77, 0.2) !important;
  color: #ffb74d !important;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.status-unpaid {
  background: rgba(231, 76, 60, 0.2) !important;
  color: #e74c3c !important;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

/* Action Buttons */
.action-edit {
  color: #4fc3f7 !important;
}

.action-delete {
  color: #e74c3c !important;
}

/* Empty State */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  color: #88b4d4;
  margin-top: 12px;
  font-size: 14px;
}

/* Dialog Styling */
.dialog-card {
  background: rgba(10, 22, 40, 0.98) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(44, 125, 160, 0.4);
  border-radius: 24px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #0f2a3f, #1a3a4f);
  padding: 20px 24px;
}

.dialog-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Kanit', sans-serif;
}

.dialog-content {
  padding: 28px 24px !important;
}

.dialog-content :deep(.v-label) {
  color: #88b4d4 !important;
}

.dialog-content :deep(.v-field__input) {
  color: #e0e0e0 !important;
}

.dialog-content :deep(.v-field--focused .v-field__outline) {
  color: #2c7da0 !important;
}

.dialog-actions {
  padding: 0 24px 24px !important;
  gap: 12px;
}

.cancel-btn {
  color: #88b4d4 !important;
  border-color: rgba(44, 125, 160, 0.5) !important;
}

.save-btn {
  background: linear-gradient(135deg, #2c7da0, #3498db) !important;
  color: white !important;
  border-radius: 12px !important;
  text-transform: none !important;
}

/* Delete Dialog */
.delete-dialog-card {
  background: rgba(10, 22, 40, 0.98) !important;
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 20px !important;
}

.delete-dialog-text {
  text-align: center;
  padding: 28px !important;
}

.delete-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  font-family: 'Kanit', sans-serif;
  margin-bottom: 8px;
}

.delete-message {
  color: #a0a0a0;
  font-size: 14px;
}

.delete-name {
  color: #e74c3c;
}

.delete-dialog-actions {
  padding: 0 20px 24px !important;
  justify-content: center;
  gap: 12px;
}

.cancel-delete-btn {
  color: #88b4d4 !important;
  border-color: rgba(44, 125, 160, 0.5) !important;
}

.confirm-delete-btn {
  border-radius: 10px !important;
  text-transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }
  
  .filter-chips {
    margin-top: 12px;
    justify-content: flex-start;
  }
  
  .table-toolbar {
    padding: 16px;
  }
}
</style>