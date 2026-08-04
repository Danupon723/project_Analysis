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
               จัดการข้อมูลสนามแบดมินตัน
              </div>
              <div style="color: rgba(255,255,255,0.7); font-size: 14px;">
                Manage all badminton courts information.
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
          <v-col cols="6" sm="4">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #1a3a4f;">
                  <v-icon color="#4fc3f7" size="24">mdi-badminton</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ stats.total }}</div>
                  <div class="stats-label">สนามทั้งหมด</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="4">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #0d2e3e;">
                  <v-icon color="#81c784" size="24">mdi-check-circle</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ stats.available }}</div>
                  <div class="stats-label">เปิดให้บริการ</div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6" sm="4">
            <v-card class="stats-card" elevation="3">
              <div class="stats-content">
                <div class="stats-icon" style="background: #1e3a3a;">
                  <v-icon color="#ffb74d" size="24">mdi-wrench</v-icon>
                </div>
                <div>
                  <div class="stats-value">{{ stats.maintenance }}</div>
                  <div class="stats-label">ปิดซ่อมบำรุง</div>
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
                  รายการสนามทั้งหมด
                </span>
                <span class="toolbar-count">{{ courts.length }} สนาม</span>
              </v-col>
              <v-col cols="auto">
                <v-btn class="add-btn" prepend-icon="mdi-plus" @click="openCreateDialog" :loading="loading">
                  เพิ่มสนาม
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Loading State -->
          <v-progress-linear v-if="loading" indeterminate color="#4fc3f7"></v-progress-linear>

          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="courts"
            item-value="id"
            hover
            :items-per-page="10"
            :loading="loading"
            no-data-text=""
            class="court-table"
          >
            <template v-slot:no-data>
              <div class="empty-state">
                <v-icon size="56" color="#4fc3f7">mdi-badminton</v-icon>
                <div class="empty-text">ไม่พบข้อมูลสนาม</div>
                <v-btn class="mt-3" color="#2c7da0" @click="openCreateDialog">เพิ่มสนามแรก</v-btn>
              </div>
            </template>

            <template v-slot:item.index="{ index }">
              <span class="row-badge">{{ index + 1 }}</span>
            </template>

            <template v-slot:item.name="{ item }">
              <div class="court-cell">
                <v-icon color="#4fc3f7" size="20" class="mr-2">mdi-chessboard</v-icon>
                <span class="court-name">{{ item.name }}</span>
              </div>
            </template>

            <template v-slot:item.price="{ item }">
              <span class="price-primary">฿{{ formatNumber(item.price) }}</span>
              <span class="price-unit">/ชม.</span>
            </template>

            <template v-slot:item.operating_hours="{ item }">
              <div class="time-cell">
                <v-icon size="14" color="#4fc3f7">mdi-clock-outline</v-icon>
                <span>{{ item.start_time || '08:00' }} - {{ item.end_time || '22:00' }}</span>
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip size="small" :class="item.status === 'active' ? 'status-active' : 'status-inactive'">
                <v-icon start size="14">{{ item.status === 'active' ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                {{ item.status === 'active' ? 'เปิดให้บริการ' : 'ปิดให้บริการ' }}
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
      <v-dialog v-model="dialog.show" max-width="550" persistent>
        <v-card class="dialog-card">
          <div class="dialog-header">
            <v-row align="center" no-gutters>
              <v-col>
                <v-icon color="white" class="mr-2">{{ dialog.isEdit ? 'mdi-pencil-circle' : 'mdi-plus-circle' }}</v-icon>
                <span class="dialog-title">{{ dialog.isEdit ? 'แก้ไขข้อมูลสนาม' : 'เพิ่มสนามใหม่' }}</span>
              </v-col>
              <v-col cols="auto">
                <v-btn icon variant="text" color="white" @click="closeDialog">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <v-card-text class="dialog-content">
            <v-form ref="courtForm" v-model="formValid">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="ชื่อสนาม"
                    prepend-inner-icon="mdi-chessboard"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณากรอกชื่อสนาม']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model.number="formData.price"
                    label="ราคาต่อชั่วโมง (บาท)"
                    type="number"
                    prepend-inner-icon="mdi-currency-usd"
                    variant="outlined"
                    color="#2c7da0"
                    min="0"
                    :rules="[v => v >= 0 || 'กรุณากรอกราคา']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.status"
                    :items="[
                      { title: 'เปิดให้บริการ', value: 'active' },
                      { title: 'ปิดให้บริการ', value: 'inactive' }
                    ]"
                    item-title="title"
                    item-value="value"
                    label="สถานะ"
                    prepend-inner-icon="mdi-toggle-switch"
                    variant="outlined"
                    color="#2c7da0"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.start_time"
                    label="เวลาเปิดให้บริการ"
                    type="time"
                    prepend-inner-icon="mdi-clock-start"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณาเลือกเวลาเปิด']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.end_time"
                    label="เวลาปิดให้บริการ"
                    type="time"
                    prepend-inner-icon="mdi-clock-end"
                    variant="outlined"
                    color="#2c7da0"
                    :rules="[v => !!v || 'กรุณาเลือกเวลาปิด']"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="dialog-actions">
            <v-btn variant="outlined" class="cancel-btn" @click="closeDialog">ยกเลิก</v-btn>
            <v-btn class="save-btn" @click="submitForm" :loading="dialogLoading">
              <v-icon start>mdi-content-save</v-icon>
              {{ dialog.isEdit ? 'บันทึก' : 'เพิ่มสนาม' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirm Dialog -->
      <v-dialog v-model="deleteDialog.show" max-width="380">
        <v-card class="delete-dialog-card">
          <v-card-text class="delete-dialog-text">
            <v-icon size="56" color="#e74c3c" class="mb-3">mdi-delete-alert</v-icon>
            <div class="delete-title">ยืนยันการลบ</div>
            <div class="delete-message">
              ต้องการลบสนาม <strong class="delete-name">{{ deleteDialog.courtName }}</strong> ใช่หรือไม่?
            </div>
          </v-card-text>
          <v-card-actions class="delete-dialog-actions">
            <v-btn variant="outlined" class="cancel-delete-btn" @click="deleteDialog.show = false">ยกเลิก</v-btn>
            <v-btn color="#e74c3c" class="confirm-delete-btn" @click="deleteCourt" :loading="deleteLoading">ลบ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar Notification -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" rounded="lg" location="bottom right" timeout="3000">
        <v-icon start>{{ snackbar.icon }}</v-icon>
        {{ snackbar.text }}
      </v-snackbar>

    </div>
  </v-app>
</template>

<script>
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Add token to requests if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  name: 'CourtManagement',
  data() {
    return {
      currentTheme: localStorage.getItem('theme') || 'light',
      courts: [],
      loading: false,
      dialog: {
        show: false,
        isEdit: false,
        courtId: null
      },
      formData: {
        name: '',
        price: 0,
        start_time: '08:00',
        end_time: '22:00',
        status: 'active'
      },
      formValid: false,
      dialogLoading: false,
      deleteDialog: {
        show: false,
        courtId: null,
        courtName: ''
      },
      deleteLoading: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        icon: 'mdi-check-circle'
      },
      headers: [
        { title: '#', key: 'index', sortable: false, width: '60px', align: 'center' },
        { title: 'ชื่อสนาม', key: 'name', sortable: true },
        { title: 'ราคา/ชม.', key: 'price', sortable: true, width: '130px', align: 'center' },
        { title: 'เวลาให้บริการ', key: 'operating_hours', sortable: false, width: '180px' },
        { title: 'สถานะ', key: 'status', sortable: true, width: '140px', align: 'center' },
        { title: 'จัดการ', key: 'actions', sortable: false, align: 'center', width: '100px' }
      ]
    }
  },
  
  computed: {
    stats() {
      const total = this.courts.length
      const available = this.courts.filter(c => c.status === 'active').length
      const maintenance = this.courts.filter(c => c.status === 'inactive').length
      return { total, available, maintenance }
    },
    
    today() {
      return new Date().toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  },
  
  mounted() {
    this.loadTheme()
    this.fetchAllCourts()
    this.setThemeClass()
  },
  
  watch: {
    currentTheme(newTheme) {
      localStorage.setItem('theme', newTheme)
      this.setThemeClass()
    }
  },
  
  methods: {
    formatNumber(num) {
      const number = typeof num === 'string' ? parseFloat(num) : (num || 0)
      if (isNaN(number)) return '0'
      return number.toLocaleString()
    },
    
    loadTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.currentTheme = savedTheme
      }
    },
    
    setThemeClass() {
      if (this.currentTheme === 'dark') {
        document.documentElement.classList.add('theme-dark')
        document.documentElement.classList.remove('theme-light')
      } else {
        document.documentElement.classList.add('theme-light')
        document.documentElement.classList.remove('theme-dark')
      }
    },
    
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    },
    
    async fetchAllCourts() {
      this.loading = true
      try {
        const response = await axiosInstance.get('/courts')
        console.log('API Response:', response.data) // ดูข้อมูลที่ได้จาก API
        
        if (response.data.success) {
          this.courts = response.data.data || []
          console.log('Courts data:', this.courts) // ดูข้อมูลสนาม
          this.showSnackbar('โหลดข้อมูลสนามสำเร็จ', 'success', 'mdi-check-circle')
        } else {
          this.courts = []
          this.showSnackbar(response.data.message || 'โหลดข้อมูลไม่สำเร็จ', 'error', 'mdi-alert-circle')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        const errorMsg = error.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ'
        this.showSnackbar(errorMsg, 'error', 'mdi-alert-circle')
        this.courts = []
      } finally {
        this.loading = false
      }
    },
    
    async createCourt(data) {
      try {
        const payload = {
          name: data.name,
          price: parseInt(data.price) || 0,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status
        }
        const response = await axiosInstance.post('/courts', payload)
        
        if (response.data.success) {
          this.showSnackbar(`เพิ่มสนาม "${data.name}" สำเร็จ`, 'success', 'mdi-check-circle')
          await this.fetchAllCourts()
          return true
        } else {
          this.showSnackbar(response.data.message || 'เพิ่มสนามไม่สำเร็จ', 'error', 'mdi-alert')
          return false
        }
      } catch (error) {
        console.error('Create error:', error)
        const errorMsg = error.response?.data?.message || 'เพิ่มสนามไม่สำเร็จ'
        this.showSnackbar(errorMsg, 'error', 'mdi-alert')
        return false
      }
    },
    
    async updateCourt(courtId, data) {
      try {
        const payload = {
          name: data.name,
          price: parseInt(data.price) || 0,
          start_time: data.start_time,
          end_time: data.end_time,
          status: data.status
        }
        const response = await axiosInstance.put(`/courts/${courtId}`, payload)
        
        if (response.data.success) {
          this.showSnackbar(`แก้ไขสนาม "${data.name}" สำเร็จ`, 'success', 'mdi-check-circle')
          await this.fetchAllCourts()
          return true
        } else {
          this.showSnackbar(response.data.message || 'แก้ไขสนามไม่สำเร็จ', 'error', 'mdi-alert')
          return false
        }
      } catch (error) {
        console.error('Update error:', error)
        const errorMsg = error.response?.data?.message || 'แก้ไขสนามไม่สำเร็จ'
        this.showSnackbar(errorMsg, 'error', 'mdi-alert')
        return false
      }
    },
    
    async deleteCourt() {
      const courtId = this.deleteDialog.courtId
      const courtName = this.deleteDialog.courtName
      if (!courtId) return
      
      this.deleteLoading = true
      try {
        const response = await axiosInstance.delete(`/courts/${courtId}`)
        
        if (response.data.success) {
          this.showSnackbar(`ลบสนาม "${courtName}" สำเร็จ`, 'info', 'mdi-delete')
          this.deleteDialog.show = false
          await this.fetchAllCourts()
        } else {
          this.showSnackbar(response.data.message || 'ลบสนามไม่สำเร็จ', 'error', 'mdi-alert')
        }
      } catch (error) {
        console.error('Delete error:', error)
        const errorMsg = error.response?.data?.message || 'ลบสนามไม่สำเร็จ'
        this.showSnackbar(errorMsg, 'error', 'mdi-alert')
      } finally {
        this.deleteLoading = false
      }
    },
    
    openCreateDialog() {
      this.dialog.isEdit = false
      this.dialog.courtId = null
      this.formData = {
        name: '',
        price: 0,
        start_time: '08:00',
        end_time: '22:00',
        status: 'active'
      }
      this.dialog.show = true
      this.formValid = false
      this.$nextTick(() => {
        if (this.$refs.courtForm) this.$refs.courtForm.resetValidation()
      })
    },
    
    openEditDialog(court) {
      this.dialog.isEdit = true
      this.dialog.courtId = court.id
      this.formData = {
        name: court.name,
        price: court.price || 0,
        start_time: court.start_time || '08:00',
        end_time: court.end_time || '22:00',
        status: court.status
      }
      this.dialog.show = true
      this.$nextTick(() => {
        if (this.$refs.courtForm) this.$refs.courtForm.resetValidation()
      })
    },
    
    async submitForm() {
      if (!this.formValid) return
      
      // ตรวจสอบเวลา
      if (this.formData.start_time >= this.formData.end_time) {
        this.showSnackbar('เวลาเปิดต้องน้อยกว่าเวลาปิด', 'warning', 'mdi-alert')
        return
      }
      
      this.dialogLoading = true
      
      let success = false
      if (this.dialog.isEdit) {
        success = await this.updateCourt(this.dialog.courtId, this.formData)
      } else {
        success = await this.createCourt(this.formData)
      }
      
      this.dialogLoading = false
      if (success) {
        this.closeDialog()
      }
    },
    
    confirmDelete(court) {
      this.deleteDialog.courtId = court.id
      this.deleteDialog.courtName = court.name
      this.deleteDialog.show = true
    },
    
    closeDialog() {
      this.dialog.show = false
      this.formData = {
        name: '',
        price: 0,
        start_time: '08:00',
        end_time: '22:00',
        status: 'active'
      }
      this.dialog.courtId = null
      this.formValid = false
    },
    
    showSnackbar(text, color = 'success', icon = 'mdi-information') {
      this.snackbar = {
        show: true,
        text,
        color,
        icon
      }
      setTimeout(() => {
        this.snackbar.show = false
      }, 3000)
    }
  }
}
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

/* Data Table Styling */
.court-table :deep(.v-data-table__wrapper) {
  background: rgba(10, 22, 40, 0.8);
}

.court-table :deep(table) {
  background: transparent !important;
}

.court-table :deep(thead tr th) {
  background: rgba(15, 42, 63, 0.8) !important;
  color: #4fc3f7 !important;
  font-family: 'Kanit', sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-bottom: 2px solid rgba(44, 125, 160, 0.4) !important;
  padding: 14px 12px !important;
}

.court-table :deep(tbody tr) {
  transition: all 0.2s;
}

.court-table :deep(tbody tr:hover td) {
  background: rgba(44, 125, 160, 0.1) !important;
}

.court-table :deep(tbody tr td) {
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

.court-cell {
  display: flex;
  align-items: center;
}

.court-name {
  font-weight: 600;
  color: #e0e0e0;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-primary {
  font-weight: 700;
  color: #4fc3f7;
}

.price-unit {
  font-size: 12px;
  color: #88b4d4;
  margin-left: 2px;
}

/* Status Chips */
.status-active {
  background: rgba(46, 204, 113, 0.2) !important;
  color: #81c784 !important;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-inactive {
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
  
  .table-toolbar {
    padding: 16px;
  }
}
</style>