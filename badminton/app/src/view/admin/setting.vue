<template>
  <v-container fluid class="settings-container">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold">ตั้งค่าระบบ</h1>
            <p class="text-subtitle-1 text-grey">จัดการการตั้งค่าต่างๆ ของระบบจองสนามแบดมินตัน</p>
          </div>
          <v-btn
            color="success"
            prepend-icon="mdi-content-save"
            @click="saveAllSettings"
            :loading="saving"
          >
            บันทึกทั้งหมด
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <!-- เมนูด้านซ้าย -->
      <v-col cols="12" md="3">
        <v-card rounded="lg" elevation="2">
          <v-list density="compact" nav>
            <v-list-item
              v-for="item in menuItems"
              :key="item.value"
              :value="item.value"
              :prepend-icon="item.icon"
              :title="item.title"
              :active="activeTab === item.value"
              @click="activeTab = item.value"
              link
              rounded="lg"
              class="mb-1"
            >
              <template v-slot:append>
                <v-badge
                  v-if="item.value === 'courts' && pendingChanges.courts"
                  color="warning"
                  dot
                />
                <v-badge
                  v-else-if="item.value === 'booking' && pendingChanges.booking"
                  color="warning"
                  dot
                />
                <v-badge
                  v-else-if="item.value === 'payment' && pendingChanges.payment"
                  color="warning"
                  dot
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- เนื้อหาด้านขวา -->
      <v-col cols="12" md="9">
        <v-card rounded="lg" elevation="2">
          <v-card-text class="pa-6">
            <!-- General Settings -->
            <div v-if="activeTab === 'general'">
              <h2 class="text-h5 mb-4">การตั้งค่าทั่วไป</h2>
              <v-divider class="mb-6" />
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.general.siteName"
                    label="ชื่อเว็บไซต์"
                    variant="outlined"
                    prepend-inner-icon="mdi-web"
                    :loading="loading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.general.siteLogo"
                    label="URL โลโก้"
                    variant="outlined"
                    prepend-inner-icon="mdi-image"
                    :loading="loading"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="settings.general.siteDescription"
                    label="คำอธิบายเว็บไซต์"
                    variant="outlined"
                    rows="3"
                    prepend-inner-icon="mdi-text"
                    :loading="loading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.general.contactEmail"
                    label="อีเมลติดต่อ"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    type="email"
                    :loading="loading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.general.contactPhone"
                    label="เบอร์โทรติดต่อ"
                    variant="outlined"
                    prepend-inner-icon="mdi-phone"
                    :loading="loading"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="settings.general.address"
                    label="ที่อยู่"
                    variant="outlined"
                    rows="2"
                    prepend-inner-icon="mdi-map-marker"
                    :loading="loading"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Court Settings -->
            <div v-if="activeTab === 'courts'">
              <div class="d-flex align-center justify-space-between mb-4">
                <h2 class="text-h5">การจัดการสนาม</h2>
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  size="small"
                  @click="openCourtDialog"
                >
                  เพิ่มสนาม
                </v-btn>
              </div>
              <v-divider class="mb-6" />

              <v-row>
                <v-col cols="12">
                  <v-table>
                    <thead>
                      <tr>
                        <th>หมายเลขสนาม</th>
                        <th>ชื่อสนาม</th>
                        <th>ประเภท</th>
                        <th>ราคาต่อชั่วโมง</th>
                        <th>สถานะ</th>
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="court in settings.courts.courtsList" :key="court.id">
                        <td>{{ court.number }}</td>
                        <td>{{ court.name }}</td>
                        <td>
                          <v-chip size="small" color="info" variant="tonal">
                            {{ court.type }}
                          </v-chip>
                        </td>
                        <td>
                          <v-text-field
                            v-model="court.pricePerHour"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            style="width: 120px"
                            suffix="บาท"
                            @input="markPending('courts')"
                          />
                        </td>
                        <td>
                          <v-switch
                            v-model="court.isActive"
                            color="success"
                            hide-details
                            density="compact"
                            @update:model-value="markPending('courts')"
                          />
                        </td>
                        <td>
                          <v-btn
                            icon="mdi-pencil"
                            size="small"
                            variant="text"
                            @click="editCourt(court)"
                          />
                          <v-btn
                            icon="mdi-delete"
                            size="small"
                            variant="text"
                            color="error"
                            @click="deleteCourt(court.id)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
            </div>

            <!-- Booking Settings -->
            <div v-if="activeTab === 'booking'">
              <h2 class="text-h5 mb-4">การตั้งค่าการจอง</h2>
              <v-divider class="mb-6" />

              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.booking.advanceBookingDays"
                    label="จำนวนวันล่วงหน้าสามารถจองได้"
                    :items="[7, 14, 30, 60, 90]"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar-range"
                    :loading="loading"
                    @update:model-value="markPending('booking')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.booking.minDuration"
                    label="ระยะเวลาจองขั้นต่ำ"
                    :items="[1, 2, 3, 4]"
                    variant="outlined"
                    prepend-inner-icon="mdi-clock-outline"
                    :loading="loading"
                    @update:model-value="markPending('booking')"
                  >
                    <template v-slot:append-inner>
                      <span class="text-caption">ชั่วโมง</span>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.booking.maxDuration"
                    label="ระยะเวลาจองสูงสุด"
                    :items="[2, 3, 4, 6, 8]"
                    variant="outlined"
                    prepend-inner-icon="mdi-clock"
                    :loading="loading"
                    @update:model-value="markPending('booking')"
                  >
                    <template v-slot:append-inner>
                      <span class="text-caption">ชั่วโมง</span>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="settings.booking.cancellationHours"
                    label="ยกเลิกการจองล่วงหน้า (ชั่วโมง)"
                    :items="[1, 2, 4, 6, 12, 24]"
                    variant="outlined"
                    prepend-inner-icon="mdi-cancel"
                    :loading="loading"
                    @update:model-value="markPending('booking')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.booking.requireDeposit"
                    label="ต้องการเงินมัดจำ"
                    color="primary"
                    @update:model-value="markPending('booking')"
                  />
                </v-col>
                <v-col cols="12" md="6" v-if="settings.booking.requireDeposit">
                  <v-text-field
                    v-model="settings.booking.depositPercentage"
                    label="เปอร์เซ็นต์เงินมัดจำ"
                    type="number"
                    variant="outlined"
                    suffix="%"
                    @update:model-value="markPending('booking')"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Payment Settings -->
            <div v-if="activeTab === 'payment'">
              <h2 class="text-h5 mb-4">การตั้งค่าการชำระเงิน</h2>
              <v-divider class="mb-6" />

              <v-row>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.payment.onlinePayment"
                    label="เปิดระบบชำระเงินออนไลน์"
                    color="primary"
                    @update:model-value="markPending('payment')"
                  />
                </v-col>
                <v-col cols="12" md="6" v-if="settings.payment.onlinePayment">
                  <v-select
                    v-model="settings.payment.paymentGateway"
                    label="Payment Gateway"
                    :items="['PromptPay', 'Credit Card', 'Both']"
                    variant="outlined"
                    @update:model-value="markPending('payment')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="settings.payment.bankName"
                    label="ชื่อธนาคาร"
                    variant="outlined"
                    prepend-inner-icon="mdi-bank"
                    @update:model-value="markPending('payment')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.payment.accountNumber"
                    label="หมายเลขบัญชี"
                    variant="outlined"
                    prepend-inner-icon="mdi-credit-card"
                    @update:model-value="markPending('payment')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="settings.payment.accountName"
                    label="ชื่อบัญชี"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    @update:model-value="markPending('payment')"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Notification Settings -->
            <div v-if="activeTab === 'notifications'">
              <h2 class="text-h5 mb-4">การแจ้งเตือน</h2>
              <v-divider class="mb-6" />

              <v-row>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.notifications.emailBookingConfirm"
                    label="ส่งอีเมลยืนยันการจอง"
                    color="primary"
                    @update:model-value="markPending('notifications')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.notifications.emailReminder"
                    label="ส่งอีเมลเตือนก่อนการจอง 1 วัน"
                    color="primary"
                    @update:model-value="markPending('notifications')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="settings.notifications.lineNotify"
                    label="แจ้งเตือนผ่าน Line Notify"
                    color="primary"
                    @update:model-value="markPending('notifications')"
                  />
                </v-col>
                <v-col cols="12" v-if="settings.notifications.lineNotify">
                  <v-text-field
                    v-model="settings.notifications.lineToken"
                    label="Line Notify Token"
                    variant="outlined"
                    type="password"
                    prepend-inner-icon="mdi-line"
                    @update:model-value="markPending('notifications')"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Business Hours -->
            <div v-if="activeTab === 'hours'">
              <h2 class="text-h5 mb-4">เวลาทำการ</h2>
              <v-divider class="mb-6" />

              <v-row>
                <v-col cols="12" v-for="day in weekDays" :key="day.value">
                  <div class="d-flex align-center ga-4">
                    <div style="width: 120px">
                      <strong>{{ day.label }}</strong>
                    </div>
                    <v-switch
                      v-model="settings.hours[day.value].isOpen"
                      label="เปิดให้บริการ"
                      color="success"
                      hide-details
                      density="compact"
                      @update:model-value="markPending('hours')"
                    />
                    <v-text-field
                      v-if="settings.hours[day.value].isOpen"
                      v-model="settings.hours[day.value].openTime"
                      label="เวลาเปิด"
                      type="time"
                      variant="outlined"
                      density="compact"
                      style="width: 130px"
                      hide-details
                      @update:model-value="markPending('hours')"
                    />
                    <span v-if="settings.hours[day.value].isOpen">-</span>
                    <v-text-field
                      v-if="settings.hours[day.value].isOpen"
                      v-model="settings.hours[day.value].closeTime"
                      label="เวลาปิด"
                      type="time"
                      variant="outlined"
                      density="compact"
                      style="width: 130px"
                      hide-details
                      @update:model-value="markPending('hours')"
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Court Dialog -->
    <v-dialog v-model="courtDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingCourt ? 'แก้ไขสนาม' : 'เพิ่มสนามใหม่' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="courtForm.number"
                  label="หมายเลขสนาม"
                  variant="outlined"
                  type="number"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="courtForm.name"
                  label="ชื่อสนาม"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="courtForm.type"
                  label="ประเภทสนาม"
                  :items="['มาตรฐาน', 'VIP', 'ฝึกซ้อม']"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="courtForm.pricePerHour"
                  label="ราคาต่อชั่วโมง"
                  variant="outlined"
                  type="number"
                  suffix="บาท"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="courtForm.isActive"
                  label="เปิดใช้งาน"
                  color="success"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeCourtDialog">ยกเลิก</v-btn>
          <v-btn color="primary" @click="saveCourt">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" icon="mdi-close" @click="snackbar.show = false" />
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State
const activeTab = ref('general')
const loading = ref(false)
const saving = ref(false)
const courtDialog = ref(false)
const editingCourt = ref(null)

const pendingChanges = reactive({
  general: false,
  courts: false,
  booking: false,
  payment: false,
  notifications: false,
  hours: false
})

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// Menu items
const menuItems = [
  { title: 'ทั่วไป', value: 'general', icon: 'mdi-cog' },
  { title: 'จัดการสนาม', value: 'courts', icon: 'mdi-tennis' },
  { title: 'การจอง', value: 'booking', icon: 'mdi-calendar' },
  { title: 'การชำระเงิน', value: 'payment', icon: 'mdi-cash' },
  { title: 'การแจ้งเตือน', value: 'notifications', icon: 'mdi-bell' },
  { title: 'เวลาทำการ', value: 'hours', icon: 'mdi-clock' }
]

const weekDays = [
  { label: 'วันจันทร์', value: 'monday' },
  { label: 'วันอังคาร', value: 'tuesday' },
  { label: 'วันพุธ', value: 'wednesday' },
  { label: 'วันพฤหัสบดี', value: 'thursday' },
  { label: 'วันศุกร์', value: 'friday' },
  { label: 'วันเสาร์', value: 'saturday' },
  { label: 'วันอาทิตย์', value: 'sunday' }
]

// Settings data
const settings = ref({
  general: {
    siteName: 'ระบบจองสนามแบดมินตัน',
    siteLogo: '/logo.png',
    siteDescription: 'ระบบจองสนามแบดมินตันออนไลน์',
    contactEmail: 'contact@badminton.com',
    contactPhone: '02-123-4567',
    address: '123 ถนนสุขุมวิท กรุงเทพฯ'
  },
  courts: {
    courtsList: [
      { id: 1, number: 1, name: 'สนาม A', type: 'มาตรฐาน', pricePerHour: 300, isActive: true },
      { id: 2, number: 2, name: 'สนาม B', type: 'มาตรฐาน', pricePerHour: 300, isActive: true },
      { id: 3, number: 3, name: 'สนาม VIP', type: 'VIP', pricePerHour: 500, isActive: true }
    ]
  },
  booking: {
    advanceBookingDays: 30,
    minDuration: 1,
    maxDuration: 4,
    cancellationHours: 24,
    requireDeposit: true,
    depositPercentage: 30
  },
  payment: {
    onlinePayment: true,
    paymentGateway: 'PromptPay',
    bankName: 'ธนาคารกรุงไทย',
    accountNumber: '123-4-56789-0',
    accountName: 'บริษัท แบดมินตัน จำกัด'
  },
  notifications: {
    emailBookingConfirm: true,
    emailReminder: true,
    lineNotify: false,
    lineToken: ''
  },
  hours: {
    monday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
    saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
    sunday: { isOpen: true, openTime: '08:00', closeTime: '22:00' }
  }
})

// Court form
const courtForm = reactive({
  number: '',
  name: '',
  type: 'มาตรฐาน',
  pricePerHour: '',
  isActive: true
})

// Methods
const markPending = (section) => {
  pendingChanges[section] = true
}

const loadSettings = async () => {
  loading.value = true
  try {
    // ดึงข้อมูลจาก API
    // const response = await fetch('/api/settings')
    // settings.value = await response.json()
    
    // จำลองการโหลดข้อมูล
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('โหลด settings เรียบร้อย')
  } catch (error) {
    console.error('Error loading settings:', error)
    showSnackbar('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error')
  } finally {
    loading.value = false
  }
}

const saveAllSettings = async () => {
  saving.value = true
  try {
    // ส่งข้อมูลไปบันทึกที่ API
    // await fetch('/api/settings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings.value)
    // })
    
    // จำลองการบันทึก
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // เคลียร์ pending changes
    Object.keys(pendingChanges).forEach(key => {
      pendingChanges[key] = false
    })
    
    showSnackbar('บันทึกการตั้งค่าสำเร็จ', 'success')
  } catch (error) {
    console.error('Error saving settings:', error)
    showSnackbar('เกิดข้อผิดพลาดในการบันทึก', 'error')
  } finally {
    saving.value = false
  }
}

const openCourtDialog = () => {
  editingCourt.value = null
  Object.assign(courtForm, {
    number: settings.value.courts.courtsList.length + 1,
    name: '',
    type: 'มาตรฐาน',
    pricePerHour: 300,
    isActive: true
  })
  courtDialog.value = true
}

const editCourt = (court) => {
  editingCourt.value = court
  Object.assign(courtForm, court)
  courtDialog.value = true
}

const saveCourt = () => {
  if (editingCourt.value) {
    // แก้ไข
    const index = settings.value.courts.courtsList.findIndex(c => c.id === editingCourt.value.id)
    if (index !== -1) {
      settings.value.courts.courtsList[index] = { ...courtForm, id: editingCourt.value.id }
    }
    showSnackbar('แก้ไขสนามสำเร็จ', 'success')
  } else {
    // เพิ่มใหม่
    const newId = Math.max(...settings.value.courts.courtsList.map(c => c.id), 0) + 1
    settings.value.courts.courtsList.push({ ...courtForm, id: newId })
    showSnackbar('เพิ่มสนามสำเร็จ', 'success')
  }
  markPending('courts')
  closeCourtDialog()
}

const deleteCourt = (id) => {
  if (confirm('คุณแน่ใจที่จะลบสนามนี้?')) {
    settings.value.courts.courtsList = settings.value.courts.courtsList.filter(c => c.id !== id)
    markPending('courts')
    showSnackbar('ลบสนามสำเร็จ', 'success')
  }
}

const closeCourtDialog = () => {
  courtDialog.value = false
  editingCourt.value = null
}

const showSnackbar = (text, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-container {
  max-width: 1400px;
  margin: 0 auto;
}

.v-list-item--active {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

:deep(.v-field--variant-outlined .v-field__field) {
  font-size: 14px;
}

@media (max-width: 960px) {
  .settings-container {
    padding: 12px;
  }
}
</style>