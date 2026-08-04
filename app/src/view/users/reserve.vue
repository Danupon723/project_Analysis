<template>
  
  <div class="booking-page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="hero-badge">
          <i class="mdi mdi-badminton"></i>
          <span>จองออนไลน์ 24/7</span>
        </div>
        <h1 class="page-title">จองสนามแบดมินตัน</h1>
        <p class="page-sub">เลือกวันเวลาและสนามที่ต้องการ พร้อมรับส่วนลดพิเศษ</p>
      </div>
      <div class="header-badge">
        <i class="mdi mdi-badminton"></i>
        <div class="badge-content">
          <span class="badge-value">{{ availableCourts }}</span>
          <span class="badge-label">สนามว่าง</span>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="steps">
      <div class="step" :class="{ active: step >= 1, done: step > 1 }">
        <div class="step-circle">
          <i v-if="step > 1" class="mdi mdi-check"></i>
          <span v-else>1</span>
        </div>
        <div class="step-info">
          <span class="step-label">เลือกวันที่</span>
          <span class="step-desc">ระบุวันจอง</span>
        </div>
      </div>
      <div class="step-line" :class="{ active: step > 1 }"></div>
      <div class="step" :class="{ active: step >= 2, done: step > 2 }">
        <div class="step-circle">
          <i v-if="step > 2" class="mdi mdi-check"></i>
          <span v-else>2</span>
        </div>
        <div class="step-info">
          <span class="step-label">เลือกเวลา</span>
          <span class="step-desc">ช่วงเวลาที่ต้องการ</span>
        </div>
      </div>
      <div class="step-line" :class="{ active: step > 2 }"></div>
      <div class="step" :class="{ active: step >= 3 }">
        <div class="step-circle"><span>3</span></div>
        <div class="step-info">
          <span class="step-label">ยืนยัน</span>
          <span class="step-desc">ตรวจสอบ & ชำระ</span>
        </div>
      </div>
    </div>

    <div class="booking-body">

      <!-- LEFT: Calendar + Time -->
      <div class="left-panel">

        <!-- Step 1: Date Card -->
        <div class="card" :class="{ 'card-active': step === 1 }">
          <div class="card-head">
            <div class="card-icon icon-purple">
              <i class="mdi mdi-calendar-month"></i>
            </div>
            <div class="card-title-wrapper">
              <div class="card-title">เลือกวันที่</div>
              <div class="card-sub" v-if="selectedDate">
                <i class="mdi mdi-check-circle" style="color:var(--color-success)"></i>
                {{ formatDateThai(selectedDate) }}
              </div>
              <div class="card-sub" v-else>กรุณาเลือกวันที่ต้องการจอง</div>
            </div>
            <div class="card-badge" v-if="selectedDate">เลือกแล้ว</div>
          </div>

          <!-- Compact Calendar -->
          <div class="calendar">
            <div class="cal-nav">
              <button class="cal-btn" @click="prevMonth">
                <i class="mdi mdi-chevron-left"></i>
              </button>
              <span class="cal-month">{{ currentMonthLabel }}</span>
              <button class="cal-btn" @click="nextMonth">
                <i class="mdi mdi-chevron-right"></i>
              </button>
            </div>
            <div class="cal-days-header">
              <span v-for="d in dayNames" :key="d">{{ d }}</span>
            </div>
            <div class="cal-grid">
              <div
                v-for="(day, i) in calendarDays"
                :key="i"
                class="cal-cell"
                :class="{
                  'other-month': !day.currentMonth,
                  'today': day.isToday,
                  'selected': day.dateStr === selectedDate,
                  'past': day.isPast,
                }"
                @click="selectDate(day)"
              >
                <span class="day-num">{{ day.date }}</span>
                <span v-if="day.isToday" class="today-dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Time Card -->
        <div class="card" :class="{ 'card-active': step === 2, 'card-disabled': step < 2 }">
          <div class="card-head">
            <div class="card-icon icon-mint">
              <i class="mdi mdi-clock-outline"></i>
            </div>
            <div class="card-title-wrapper">
              <div class="card-title">เลือกช่วงเวลา</div>
              <div class="card-sub" v-if="selectedStart && selectedEnd">
                <i class="mdi mdi-clock-check" style="color:var(--color-success)"></i>
                {{ selectedStart }} – {{ selectedEnd }} น.
              </div>
              <div class="card-sub" v-else>เลือกเวลาเริ่มต้นและสิ้นสุด</div>
            </div>
          </div>

          <div v-if="step >= 2">
            <div class="time-label">
              <i class="mdi mdi-play-circle-outline"></i>
              เวลาเริ่มต้น
            </div>
            <div class="time-grid">
              <button
                v-for="t in timeSlots"
                :key="t"
                class="time-btn"
                :class="{
                  selected: selectedStart === t,
                  booked: bookedSlots.includes(t),
                }"
                :disabled="bookedSlots.includes(t)"
                @click="selectStart(t)"
              >
                <span class="time-text">{{ t }}</span>
                <span v-if="bookedSlots.includes(t)" class="booked-tag">จองแล้ว</span>
              </button>
            </div>

            <template v-if="selectedStart">
              <div class="time-label" style="margin-top:20px">
                <i class="mdi mdi-stop-circle-outline"></i>
                เวลาสิ้นสุด
              </div>
              <div class="time-grid">
                <button
                  v-for="t in endTimeSlots"
                  :key="t"
                  class="time-btn"
                  :class="{ selected: selectedEnd === t }"
                  @click="selectEnd(t)"
                >{{ t }}</button>
              </div>
            </template>

            <div v-if="selectedStart && selectedEnd" class="duration-preview">
              <div class="dur-left">
                <i class="mdi mdi-timer-sand"></i>
                <span>{{ duration }} ชั่วโมง</span>
              </div>
              <div class="dur-right">
                <span class="dur-price">{{ totalPrice.toLocaleString() }} ฿</span>
              </div>
            </div>
          </div>
          <div v-else class="disabled-msg">
            <i class="mdi mdi-calendar-alert"></i>
            <p>กรุณาเลือกวันที่ก่อน</p>
          </div>
        </div>

      </div>

      <!-- RIGHT: Summary + Form -->
      <div class="right-panel">

        <!-- Pricing Card -->
        <div class="card pricing-card">
          <div class="card-head">
            <div class="card-icon icon-amber">
              <i class="mdi mdi-tag-outline"></i>
            </div>
            <div class="card-title">อัตราค่าบริการ</div>
          </div>
          <div class="pricing-list">
            <div class="pricing-item">
              <div class="pricing-left">
                <span class="pricing-dot dot-purple"></span>
                <span>สนามทั่วไป</span>
              </div>
              <span class="pricing-price">100 ฿/ชม.</span>
            </div>
            <div class="pricing-item">
              <div class="pricing-left">
                <span class="pricing-dot dot-mint"></span>
                <span>ช่วงเย็น (17:00+)</span>
              </div>
              <span class="pricing-price">150 ฿/ชม.</span>
            </div>
          </div>
          <div class="pricing-note">
            <i class="mdi mdi-information-outline"></i>
            <span>ราคาคิดตามช่วงเวลาเริ่มต้น</span>
          </div>
        </div>

        <!-- Step 3: Summary Card -->
        <div class="card summary-card" :class="{ 'card-active': step === 3, 'card-disabled': step < 3 }">
          <div class="card-head">
            <div class="card-icon icon-purple">
              <i class="mdi mdi-clipboard-text-outline"></i>
            </div>
            <div class="card-title">สรุปการจอง</div>
          </div>

          <div v-if="step >= 3">
            <div class="summary-rows">
              <div class="summary-row">
                <span class="summary-key"><i class="mdi mdi-calendar"></i>วันที่</span>
                <span class="summary-val">{{ formatDateThai(selectedDate) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-key"><i class="mdi mdi-clock-outline"></i>เวลา</span>
                <span class="summary-val">{{ selectedStart }} – {{ selectedEnd }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-key"><i class="mdi mdi-timer-outline"></i>ระยะเวลา</span>
                <span class="summary-val">{{ duration }} ชม.</span>
              </div>
              <div class="summary-row">
                <span class="summary-key"><i class="mdi mdi-cash"></i>ราคา/ชม.</span>
                <span class="summary-val">{{ pricePerHour }} ฿</span>
              </div>
              <div class="summary-row total-row">
                <span class="summary-key total-key"><i class="mdi mdi-wallet-outline"></i>รวมทั้งหมด</span>
                <span class="summary-val total-price">{{ (totalPrice * qty).toLocaleString() }} ฿</span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-group">
              <label><i class="mdi mdi-credit-card-outline"></i>วิธีการชำระเงิน</label>
              <div class="payment-method-selector">
                <button type="button" class="method-btn" :class="{ active: paymentMethod === 'cash' }" @click="selectPaymentMethod('cash')">
                  <i class="mdi mdi-cash"></i>
                  <span>เงินสด</span>
                </button>
                <button type="button" class="method-btn" :class="{ active: paymentMethod === 'transfer' }" @click="selectPaymentMethod('transfer')">
                  <i class="mdi mdi-bank-transfer"></i>
                  <span>โอนเงิน</span>
                </button>
              </div>
            </div>

            <!-- QR Code -->
            <div v-if="paymentMethod === 'transfer'" class="qr-section">
              <div class="qr-header">
                <i class="mdi mdi-qrcode"></i>
                <span>ชำระผ่าน PromptPay</span>
              </div>
              <div class="qr-container">
                <div v-if="qrCodeImage" class="qr-code-wrapper">
                  <img :src="qrCodeImage" alt="QR Code" class="qr-image"/>
                  <div class="qr-amount">
                    <span>จำนวนเงิน</span>
                    <strong>{{ (totalPrice * qty).toLocaleString() }} ฿</strong>
                  </div>
                </div>
                <div v-else class="qr-loading">
                  <div class="spinner-small"></div>
                  <span>กำลังสร้าง QR Code...</span>
                </div>
              </div>
              <div class="qr-info">
                <i class="mdi mdi-phone"></i>
                <span>PromptPay: 063-592-0439</span>
              </div>
              <div class="qr-note">
                <i class="mdi mdi-alert-circle-outline"></i>
                <span>ชำระตามจำนวนที่กำหนดเท่านั้น</span>
              </div>
            </div>

            <div class="form-section">
              <div class="form-group">
                <label><i class="mdi mdi-badminton"></i>จำนวนสนาม</label>
                <div class="qty-ctrl">
                  <button @click="qty > 1 && qty--" :disabled="qty <= 1"><i class="mdi mdi-minus"></i></button>
                  <span>{{ qty }}</span>
                  <button @click="qty < 4 && qty++" :disabled="qty >= 4"><i class="mdi mdi-plus"></i></button>
                </div>
                <span class="hint-text">สูงสุด 4 สนาม</span>
              </div>

              <div class="form-group">
                <label><i class="mdi mdi-currency-thb"></i>ชำระแล้ว (฿)</label>
                <input
                  v-model.number="paidAmount"
                  type="number"
                  class="form-input"
                  :placeholder="`จำนวนเงินที่ชำระ`"
                  :max="totalPrice * qty"
                  :disabled="paymentMethod === 'transfer'"
                />
              </div>

              <div class="payment-status-badge" :class="paymentStatusClass">
                <i class="mdi" :class="paymentStatusIcon"></i>
                <span>{{ paymentStatusLabel }}</span>
              </div>
            </div>

            <button class="confirm-btn" :class="{ 'loading': isSubmitting }" :disabled="isSubmitting" @click="submitBooking">
              <div class="btn-content" v-if="!isSubmitting">
                <i class="mdi mdi-check-circle-outline"></i>
                <span>ยืนยันการจอง</span>
              </div>
              <div class="btn-content" v-else>
                <div class="spinner"></div>
                <span>กำลังบันทึก...</span>
              </div>
            </button>
          </div>
          <div v-else class="disabled-msg">
            <i class="mdi mdi-clock-alert-outline"></i>
            <p>กรุณาเลือกวันที่และเวลาก่อน</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="modal-overlay" @click.self="showSuccess = false">
      <div class="modal-box">
        <div class="modal-icon">
          <i class="mdi mdi-check-circle"></i>
        </div>
        <h3>จองสำเร็จ!</h3>
        <p>หมายเลขการจอง <strong>#{{ bookingId }}</strong></p>
        <div class="modal-detail">
          <div class="modal-detail-item"><i class="mdi mdi-calendar"></i><span>{{ formatDateThai(selectedDate) }}</span></div>
          <div class="modal-detail-item"><i class="mdi mdi-clock-outline"></i><span>{{ selectedStart }} – {{ selectedEnd }} น.</span></div>
          <div class="modal-detail-item"><i class="mdi mdi-cash"></i><span>{{ (totalPrice * qty).toLocaleString() }} ฿</span></div>
        </div>
        <div class="modal-actions">
          <button class="modal-btn-secondary" @click="showSuccess = false"><i class="mdi mdi-close"></i>ปิด</button>
          <button class="confirm-btn" @click="resetBooking"><i class="mdi mdi-plus-circle-outline"></i>จองใหม่</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ========== Payment ==========
const paymentMethod = ref('cash')
const qrCodeImage = ref('')
const PROMPTPAY_NUMBER = '0635920439'

// ========== State ==========
const step = ref(1)
const selectedDate = ref('')
const selectedStart = ref('')
const selectedEnd = ref('')
const qty = ref(1)
const paidAmount = ref(0)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const bookingId = ref(null)
const bookedSlots = ref([])
const availableCourts = ref(4)

// ========== Calendar ==========
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

const currentMonthLabel = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
)

const calendarDays = computed(() => {
  const days = []
  const first = new Date(currentYear.value, currentMonth.value, 1)
  const last = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDay = first.getDay()

  for (let i = 0; i < startDay; i++) {
    const d = new Date(currentYear.value, currentMonth.value, -startDay + i + 1)
    days.push({ date: d.getDate(), currentMonth: false, dateStr: '', isPast: true })
  }
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value, d)
    const dateStr = date.toISOString().split('T')[0]
    const isToday = dateStr === today.toISOString().split('T')[0]
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    days.push({ date: d, currentMonth: true, dateStr, isToday, isPast })
  }
  return days
})

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
const selectDate = (day) => {
  if (!day.currentMonth || day.isPast) return
  selectedDate.value = day.dateStr
  selectedStart.value = ''
  selectedEnd.value = ''
  step.value = 2
  fetchBooked(day.dateStr)
}

// ========== Time ==========
const timeSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
const endTimeSlots = computed(() => {
  if (!selectedStart.value) return []
  return timeSlots.slice(timeSlots.indexOf(selectedStart.value) + 1)
})
const selectStart = (t) => { selectedStart.value = t; selectedEnd.value = ''; step.value = 2 }
const selectEnd = (t) => { selectedEnd.value = t; step.value = 3 }

// ========== Pricing ==========
const duration = computed(() => {
  if (!selectedStart.value || !selectedEnd.value) return 0
  const [sh, sm] = selectedStart.value.split(':').map(Number)
  const [eh, em] = selectedEnd.value.split(':').map(Number)
  return (eh * 60 + em - sh * 60 - sm) / 60
})
const pricePerHour = computed(() => parseInt(selectedStart.value) >= 17 ? 150 : 100)
const totalPrice = computed(() => duration.value * pricePerHour.value)

const paymentStatusClass = computed(() => {
  const paid = paidAmount.value, total = totalPrice.value * qty.value
  if (paid <= 0) return 'ps-pending'
  if (paid >= total) return 'ps-paid'
  return 'ps-partial'
})
const paymentStatusIcon = computed(() => {
  const paid = paidAmount.value, total = totalPrice.value * qty.value
  if (paid <= 0) return 'mdi-clock-outline'
  if (paid >= total) return 'mdi-check-circle-outline'
  return 'mdi-minus-circle-outline'
})
const paymentStatusLabel = computed(() => {
  const paid = paidAmount.value, total = totalPrice.value * qty.value
  if (paid <= 0) return 'รอชำระเงิน'
  if (paid >= total) return 'ชำระครบแล้ว'
  return `ชำระบางส่วน (${paid.toLocaleString()}/${total.toLocaleString()} ฿)`
})

// ========== API ==========
const fetchBooked = async (date) => {
  try {
    const res = await fetch(`http://localhost:3000/api/bookings/booked-slots/${date}`)
    const data = await res.json()
    bookedSlots.value = data.slots || []
  } catch { bookedSlots.value = [] }
}

const selectPaymentMethod = (method) => {
  paymentMethod.value = method
  if (method === 'cash') { paidAmount.value = 0; qrCodeImage.value = '' }
  else { paidAmount.value = totalPrice.value * qty.value; generateQRCode() }
}

const generateQRCode = async () => {
  try {
    qrCodeImage.value = `https://promptpay.io/${PROMPTPAY_NUMBER}/${totalPrice.value * qty.value}.png`
  } catch (e) { console.error(e) }
}

const submitBooking = async () => {
  if (!selectedDate.value || !selectedStart.value || !selectedEnd.value) return
  isSubmitting.value = true
  const paymentStatus = paymentMethod.value === 'transfer' ? 'paid'
    : paidAmount.value >= (totalPrice.value * qty.value) ? 'paid' : 'pending'
  try {
    const res = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_date: selectedDate.value,
        start_time: selectedStart.value + ':00',
        end_time: selectedEnd.value + ':00',
        duration: duration.value,
        quantity: qty.value,
        total_price: totalPrice.value * qty.value,
        paid_amount: paymentMethod.value === 'transfer' ? (totalPrice.value * qty.value) : paidAmount.value,
        payment_method: paymentMethod.value,
        payment_status: paymentStatus
      })
    })
    const data = await res.json()
    if (res.ok) { bookingId.value = data.id; showSuccess.value = true }
    else alert(data.message || 'เกิดข้อผิดพลาด')
  } catch { alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์') }
  finally { isSubmitting.value = false }
}

const resetBooking = () => {
  showSuccess.value = false; step.value = 1
  selectedDate.value = ''; selectedStart.value = ''; selectedEnd.value = ''
  paidAmount.value = 0; qty.value = 1; paymentMethod.value = 'cash'; qrCodeImage.value = ''
}

const formatDateThai = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

watch([totalPrice, qty, paymentMethod], () => {
  if (paymentMethod.value === 'transfer') {
    paidAmount.value = totalPrice.value * qty.value
    generateQRCode()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Sarabun:wght@400;500;600;700&display=swap');

/* ============================================================
   CSS VARIABLES — Light Theme (default)
   ============================================================ */
.booking-page {
  --bg-page: #f0f4ff;
  --bg-card: #ffffff;
  --bg-muted: #f6f8ff;
  --bg-input: #f1f5ff;
  --text-primary: #1a1f36;
  --text-secondary: #4a5568;
  --text-muted: #8892a4;
  --text-placeholder: #a0aab8;
  --border: #e2e8f4;
  --border-focus: #6366f1;
  --shadow-card: 0 2px 12px rgba(99,102,241,0.08);
  --shadow-active: 0 0 0 3px rgba(99,102,241,0.18);
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
  --color-primary-glow: rgba(99,102,241,0.15);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --cal-hover: rgba(99,102,241,0.09);
  --cal-today-bg: rgba(99,102,241,0.08);
  --time-hover: rgba(99,102,241,0.07);
  --grad-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --grad-header: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* ============================================================
   Dark Theme — triggered by .dark class on <html> or <body>
   ============================================================ */
:global(.dark) .booking-page,
:global(html.dark) .booking-page,
:global(body.dark) .booking-page {
  --bg-page: #0f1117;
  --bg-card: #1c1f2e;
  --bg-muted: #252839;
  --bg-input: #2a2d3e;
  --text-primary: #eef0f8;
  --text-secondary: #b0b8d0;
  --text-muted: #7a84a0;
  --text-placeholder: #5a6280;
  --border: #2e3250;
  --border-focus: #818cf8;
  --shadow-card: 0 2px 16px rgba(0,0,0,0.35);
  --shadow-active: 0 0 0 3px rgba(129,140,248,0.25);
  --color-primary: #818cf8;
  --color-primary-dark: #6366f1;
  --color-primary-glow: rgba(129,140,248,0.18);
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;
  --cal-hover: rgba(129,140,248,0.12);
  --cal-today-bg: rgba(129,140,248,0.1);
  --time-hover: rgba(129,140,248,0.1);
  --grad-primary: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  --grad-header: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);
}

/* ============================================================
   Base
   ============================================================ */
.booking-page {
  font-family: 'Noto Sans Thai', 'Sarabun', sans-serif;
  padding: 28px 20px 40px;
  min-height: 100vh;
  background: var(--bg-page);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
  position: relative;
}

/* ============================================================
   Header
   ============================================================ */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--color-primary-glow);
  border: 1px solid var(--color-primary);
  padding: 5px 13px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.page-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin-bottom: 6px;
}

.page-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.header-badge {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 18px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-card);
}
.header-badge i {
  font-size: 24px;
  color: var(--color-primary);
}
.badge-content { display: flex; flex-direction: column; }
.badge-value { font-size: 26px; font-weight: 800; color: var(--text-primary); line-height: 1; }
.badge-label { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

/* ============================================================
   Steps
   ============================================================ */
.steps {
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  background: var(--bg-card);
  border-radius: 18px;
  padding: 16px 28px;
  box-shadow: var(--shadow-card);
  max-width: 1300px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid var(--border);
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.35;
  transition: all 0.3s;
}
.step.active { opacity: 1; }
.step.done { opacity: 0.75; }

.step-circle {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--bg-muted);
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  color: var(--text-muted);
  transition: all 0.3s;
  flex-shrink: 0;
}
.step.active .step-circle {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 0 4px var(--color-primary-glow);
}
.step.done .step-circle {
  background: var(--color-success);
  border-color: var(--color-success);
  color: #fff;
}

.step-info { display: flex; flex-direction: column; }
.step-label { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.step-desc { font-size: 11px; color: var(--text-muted); }

.step-line {
  flex: 1;
  height: 2px;
  background: var(--border);
  margin: 0 14px;
  border-radius: 2px;
  transition: background 0.4s;
}
.step-line.active { background: linear-gradient(90deg, var(--color-success), var(--color-primary)); }

/* ============================================================
   Layout
   ============================================================ */
.booking-body {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  max-width: 1300px;
  margin: 0 auto;
}

/* ============================================================
   Cards
   ============================================================ */
.card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 20px;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-card);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.card:last-child { margin-bottom: 0; }
.card-active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-active);
}
.card-disabled { opacity: 0.45; pointer-events: none; }

.card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.card-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.icon-purple { background: var(--grad-primary); color: #fff; }
.icon-mint { background: linear-gradient(135deg, #0d9488, #34d399); color: #fff; }
.icon-amber { background: linear-gradient(135deg, #d97706, #fbbf24); color: #fff; }

.card-title-wrapper { flex: 1; }
.card-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
.card-sub {
  font-size: 12px; color: var(--text-muted);
  display: flex; align-items: center; gap: 5px;
}

.card-badge {
  background: var(--color-success);
  color: #fff;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
}

/* ============================================================
   Calendar — Compact & Beautiful
   ============================================================ */
.calendar {
  background: var(--bg-muted);
  border-radius: 16px;
  padding: 14px 16px 16px;
  border: 1px solid var(--border);
}

.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.cal-month {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.cal-btn {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}
.cal-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.cal-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
}
.cal-days-header span {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  padding: 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.day-num {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.today-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--color-primary);
  position: absolute;
  bottom: 3px;
}

.cal-cell:hover:not(.other-month):not(.past) {
  background: var(--cal-hover);
}
.cal-cell.today {
  background: var(--cal-today-bg);
}
.cal-cell.today .day-num {
  color: var(--color-primary);
  font-weight: 700;
}
.cal-cell.selected {
  background: var(--color-primary) !important;
}
.cal-cell.selected .day-num {
  color: #fff !important;
  font-weight: 700;
}
.cal-cell.selected .today-dot { background: #fff; }
.cal-cell.other-month .day-num { color: var(--border); }
.cal-cell.past .day-num { color: var(--text-placeholder); }
.cal-cell.other-month, .cal-cell.past { pointer-events: none; }

/* ============================================================
   Time Slots
   ============================================================ */
.time-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.time-label i { color: var(--color-primary); }

.time-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.time-btn {
  padding: 9px 6px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
}
.time-text { display: block; }
.booked-tag { font-size: 8px; color: var(--color-danger); display: block; margin-top: 1px; }

.time-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--time-hover);
}
.time-btn.selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.time-btn.booked {
  background: rgba(239,68,68,0.07);
  border-color: rgba(239,68,68,0.2);
  color: var(--color-danger);
  cursor: not-allowed;
  opacity: 0.6;
}

.duration-preview {
  margin-top: 16px;
  background: var(--grad-primary);
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dur-left { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.dur-right .dur-price { font-size: 18px; font-weight: 800; }

/* ============================================================
   Pricing Card
   ============================================================ */
.pricing-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
.pricing-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.pricing-left { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-primary); }
.pricing-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-purple { background: var(--color-primary); }
.dot-mint { background: var(--color-success); }
.pricing-price { font-weight: 700; color: var(--color-primary); font-size: 13px; }
.pricing-note {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 12px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 9px;
  font-size: 11px;
  color: var(--color-warning);
}

/* ============================================================
   Summary
   ============================================================ */
.summary-rows { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}
.summary-row:hover { background: var(--bg-muted); }

.summary-key {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.summary-key i { font-size: 14px; color: var(--color-primary); }
.summary-val { font-weight: 600; font-size: 13px; color: var(--text-primary); }

.total-row {
  background: var(--grad-primary) !important;
  border-radius: 12px;
  margin-top: 6px;
  padding: 12px 14px !important;
}
.total-key { color: rgba(255,255,255,0.85) !important; }
.total-key i { color: rgba(255,255,255,0.7) !important; }
.total-price { font-size: 20px; font-weight: 800; color: #fff !important; }

/* ============================================================
   Payment Method
   ============================================================ */
.payment-method-selector {
  display: flex; gap: 10px; margin-top: 8px;
}
.method-btn {
  flex: 1; padding: 11px 14px;
  background: var(--bg-muted);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  font-size: 13px; font-weight: 600;
  color: var(--text-secondary);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s;
}
.method-btn i { font-size: 18px; }
.method-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-glow); }
.method-btn.active {
  background: var(--grad-primary);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 14px var(--color-primary-glow);
}

/* ============================================================
   QR Code
   ============================================================ */
.qr-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: 14px;
  animation: slideDown 0.25s ease;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.qr-header {
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  font-size: 14px; font-weight: 700; color: var(--text-primary);
}
.qr-header i { font-size: 20px; color: var(--color-primary); }

.qr-container { display: flex; justify-content: center; margin-bottom: 14px; }
.qr-code-wrapper { text-align: center; }

.qr-image {
  width: 180px; height: 180px;
  border-radius: 14px;
  box-shadow: var(--shadow-card);
  background: #fff;
  padding: 10px;
  object-fit: contain;
}

.qr-amount {
  margin-top: 10px;
  padding: 7px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 9px;
  display: inline-block;
}
.qr-amount span { font-size: 11px; color: var(--text-muted); display: block; }
.qr-amount strong { font-size: 17px; color: var(--color-primary); font-weight: 800; }

.qr-loading { text-align: center; padding: 32px; color: var(--text-muted); font-size: 12px; }
.spinner-small {
  width: 34px; height: 34px;
  border: 3px solid var(--border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px;
}

.qr-info {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 10px 12px; background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 9px; margin-bottom: 8px;
  font-size: 12px; font-weight: 600; color: var(--text-primary);
}
.qr-info i { color: var(--color-primary); }

.qr-note {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 11px;
  background: rgba(251,191,36,0.07);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 8px;
  font-size: 11px; color: var(--color-warning);
}

/* ============================================================
   Form
   ============================================================ */
.form-section { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label {
  font-size: 12px; font-weight: 600;
  color: var(--text-secondary);
  display: flex; align-items: center; gap: 6px;
}
.form-group label i { color: var(--color-primary); font-size: 14px; }

.form-input {
  background: var(--bg-input);
  border: 1.5px solid var(--border);
  border-radius: 11px;
  padding: 11px 13px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.form-input::placeholder { color: var(--text-placeholder); }
.form-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--color-primary-glow); }
.form-input:disabled { opacity: 0.5; cursor: not-allowed; }

.hint-text { font-size: 11px; color: var(--text-muted); }

.qty-ctrl {
  display: flex; align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 11px;
  overflow: hidden;
  width: fit-content;
  background: var(--bg-card);
}
.qty-ctrl button {
  width: 38px; height: 38px;
  background: var(--bg-muted);
  border: none;
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.qty-ctrl button:hover:not(:disabled) { background: var(--color-primary); color: #fff; }
.qty-ctrl button:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-ctrl span {
  width: 46px; text-align: center;
  font-size: 15px; font-weight: 700;
  color: var(--text-primary);
}

/* ============================================================
   Payment Status
   ============================================================ */
.payment-status-badge {
  display: flex; align-items: center; gap: 9px;
  padding: 11px 14px;
  border-radius: 11px;
  font-size: 12px; font-weight: 600;
}
.ps-pending { background: rgba(251,191,36,0.1); color: var(--color-warning); border: 1px solid rgba(251,191,36,0.25); }
.ps-partial { background: var(--color-primary-glow); color: var(--color-primary); border: 1px solid rgba(99,102,241,0.25); }
.ps-paid { background: rgba(16,185,129,0.1); color: var(--color-success); border: 1px solid rgba(16,185,129,0.25); }

/* ============================================================
   Confirm Button
   ============================================================ */
.confirm-btn {
  width: 100%;
  padding: 14px 20px;
  background: var(--grad-primary);
  color: #fff;
  border: none;
  border-radius: 13px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  letter-spacing: 0.2px;
}
.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--color-primary-glow);
  filter: brightness(1.1);
}
.confirm-btn:active:not(:disabled) { transform: translateY(0); }
.confirm-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.confirm-btn.loading { background: var(--bg-muted); }

.btn-content {
  display: flex; align-items: center; justify-content: center; gap: 9px;
}
.btn-content i { font-size: 19px; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* ============================================================
   Disabled / Empty State
   ============================================================ */
.disabled-msg {
  text-align: center; padding: 36px 20px; color: var(--text-muted);
}
.disabled-msg i { font-size: 40px; margin-bottom: 10px; display: block; opacity: 0.4; }
.disabled-msg p { font-size: 13px; }

/* ============================================================
   Modal
   ============================================================ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}
.modal-box {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 24px;
  padding: 30px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  animation: modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
@keyframes modalPop {
  from { transform: scale(0.88); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(16,185,129,0.12);
  color: var(--color-success);
  font-size: 36px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px;
  border: 2px solid rgba(16,185,129,0.25);
}
.modal-box h3 { font-size: 22px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; }
.modal-box p { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
.modal-box p strong { color: var(--color-primary); }

.modal-detail {
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 20px;
}
.modal-detail-item {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 5px 0;
  font-size: 13px;
  color: var(--text-primary);
}
.modal-detail-item i { color: var(--color-primary); }

.modal-actions { display: flex; gap: 10px; }
.modal-btn-secondary {
  flex: 1; padding: 12px;
  background: var(--bg-muted);
  border: 1.5px solid var(--border);
  color: var(--text-primary);
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px; font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.modal-btn-secondary:hover { background: var(--border); }
.modal-box .confirm-btn { flex: 1; margin: 0; width: auto; font-size: 13px; }

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 960px) {
  .booking-body { grid-template-columns: 1fr; }
  .page-title { font-size: 24px; }
  .steps { flex-direction: column; gap: 14px; }
  .step { width: 100%; }
  .step-line { display: none; }
  .time-grid { grid-template-columns: repeat(4, 1fr); }
  .page-header { padding-right: 0; }
}

@media (max-width: 600px) {
  .booking-page { padding: 16px 12px 32px; }
  .page-header { flex-direction: column; text-align: center; gap: 14px; padding-right: 0; }
  .time-grid { grid-template-columns: repeat(3, 1fr); }
  .cal-grid { gap: 2px; }
  .theme-toggle { top: 14px; right: 14px; padding: 7px 13px 7px 10px; }
  .qr-image { width: 150px; height: 150px; }
}
</style>
