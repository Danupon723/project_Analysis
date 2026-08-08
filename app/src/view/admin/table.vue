<template>
  <v-app :theme="currentTheme">
    <v-main :class="isDark ? 'bg-gradient-dark' : 'bg-gradient-light'">
      <v-container fluid class="pa-6">

        <!-- Header Section -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between flex-wrap gap-4">
              <div class="d-flex align-center gap-3">
                <v-avatar size="56" color="primary" variant="tonal">
                  <v-icon size="32" color="primary">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h4 font-weight-bold mb-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                    จัดการผู้ใช้งาน
                  </h1>
                  <p class="text-subtitle-2 mb-0" :class="isDark ? 'text-grey-lighten-1' : 'text-grey-darken-1'">
                    จัดการข้อมูลผู้ใช้ เพิ่ม แก้ไข ลบ และค้นหา
                  </p>
                </div>
              </div>
              <div class="d-flex gap-3 align-center">
                <v-btn
                  color="primary"
                  size="large"
                  prepend-icon="mdi-plus-circle"
                  elevation="2"
                  @click="openAddModal"
                  class="px-6"
                >
                  เพิ่มผู้ใช้ใหม่
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card :class="isDark ? 'stat-card-dark' : 'stat-card-light'" elevation="2" rounded="xl">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span class="text-caption text-uppercase" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                      ผู้ใช้ทั้งหมด
                    </span>
                    <h2 class="text-h3 font-weight-bold mt-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                      {{ users.length }}
                    </h2>
                  </div>
                  <v-avatar size="48" color="primary" variant="tonal">
                    <v-icon size="28" color="primary">mdi-account-multiple</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card :class="isDark ? 'stat-card-dark' : 'stat-card-light'" elevation="2" rounded="xl">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span class="text-caption text-uppercase" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                      ผู้ดูแลระบบ
                    </span>
                    <h2 class="text-h3 font-weight-bold mt-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                      {{ adminCount }}
                    </h2>
                  </div>
                  <v-avatar size="48" color="indigo-darken-3" variant="tonal">
                    <v-icon size="28" color="indigo-lighten-1">mdi-shield-account</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card :class="isDark ? 'stat-card-dark' : 'stat-card-light'" elevation="2" rounded="xl">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span class="text-caption text-uppercase" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                      ผู้ใช้ทั่วไป
                    </span>
                    <h2 class="text-h3 font-weight-bold mt-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                      {{ userCount }}
                    </h2>
                  </div>
                  <v-avatar size="48" color="green-darken-3" variant="tonal">
                    <v-icon size="28" color="green-lighten-1">mdi-account</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card :class="isDark ? 'stat-card-dark' : 'stat-card-light'" elevation="2" rounded="xl">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <span class="text-caption text-uppercase" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                      ล่าสุด
                    </span>
                    <h2 class="text-h6 font-weight-bold mt-1" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                      {{ lastUpdateTime }}
                    </h2>
                  </div>
                  <v-avatar size="48" color="orange-darken-3" variant="tonal">
                    <v-icon size="28" color="orange-lighten-1">mdi-clock-outline</v-icon>
                  </v-avatar>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Table Card -->
        <v-card :class="isDark ? 'main-table-card-dark' : 'main-table-card-light'" rounded="xl" elevation="3">

          <!-- Search & Filter Bar -->
          <v-card-text class="pa-4 pb-0">
            <v-row align="center" no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="ค้นหาชื่อผู้ใช้..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  :bg-color="isDark ? '#2a2a3a' : 'grey-lighten-4'"
                  class="search-field"
                  @update:model-value="filterUsers"
                />
              </v-col>
              <v-col cols="12" md="6" class="d-flex justify-md-end mt-3 mt-md-0">
                <v-btn-toggle v-model="filterRole" divided mandatory :class="isDark ? 'role-toggle-dark' : 'role-toggle-light'">
                  <v-btn value="all" size="small">
                    <v-icon start>mdi-account-multiple</v-icon>ทั้งหมด
                  </v-btn>
                  <v-btn value="admin" size="small">
                    <v-icon start>mdi-shield-account</v-icon>Admin
                  </v-btn>
                  <v-btn value="user" size="small">
                    <v-icon start>mdi-account</v-icon>User
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="paginatedUsers"
            :loading="loading"
            loading-text="กำลังโหลดข้อมูลผู้ใช้..."
            :class="isDark ? 'custom-data-table-dark' : 'custom-data-table-light'"
            hover
            :items-per-page="itemsPerPage"
            :items-per-page-options="[5, 10, 25, 50]"
            show-select
            v-model:selected="selectedUsers"
            @update:options="updatePagination"
          >
            <template v-slot:top><v-divider /></template>

            <!-- ลำดับที่ (Index) -->
            <template v-slot:item.index="{ index }">
              <div class="text-center" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </div>
            </template>

            <template v-slot:item.name="{ item }">
              <div>
                <div class="font-weight-medium" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                  {{ item.name || '-' }}
                </div>
                <div class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">
                </div>
              </div>
            </template>

            <template v-slot:item.email="{ item }">
              <div>
                <div :class="isDark ? 'text-white' : 'text-grey-darken-4'">{{ item.email }}</div>
                <div class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">Verified</div>
              </div>
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip
                :color="item.role === 'admin' ? 'indigo-darken-3' : 'green-darken-3'"
                size="small"
                variant="flat"
                class="role-chip"
              >
                <v-icon start size="14" :icon="item.role === 'admin' ? 'mdi-shield-account' : 'mdi-account'" />
                {{ item.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป' }}
              </v-chip>
            </template>

            <template v-slot:item.created_at="{ item }">
              <div class="text-body-2" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                <v-icon icon="mdi-calendar" size="14" class="mr-1 text-grey" />
                {{ formatDate(item.created_at) }}
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip color="success" size="small" variant="tonal">
                <v-icon start size="12">mdi-check-circle</v-icon>
                Active
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-tooltip text="แก้ไขผู้ใช้" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-pencil" size="32" color="primary" variant="text" @click="openEditModal(item)" />
                  </template>
                </v-tooltip>
                <v-tooltip text="ลบผู้ใช้" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-delete" size="32" color="error" variant="text" @click="openDeleteModal(item)" />
                  </template>
                </v-tooltip>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="text-center py-12">
                <v-icon icon="mdi-account-off" size="64" :color="isDark ? 'grey-darken-2' : 'grey-lighten-1'" />
                <h3 class="text-h6 mt-4" :class="isDark ? 'text-grey-lighten-1' : 'text-grey-darken-2'">
                  ไม่พบข้อมูลผู้ใช้งาน
                </h3>
                <p class="text-caption mt-2" :class="isDark ? 'text-grey-darken-2' : 'text-grey'">
                  ลองเปลี่ยนคำค้นหาหรือเพิ่มผู้ใช้ใหม่
                </p>
                <v-btn color="primary" variant="tonal" class="mt-4" @click="openAddModal">
                  <v-icon start>mdi-plus</v-icon>เพิ่มผู้ใช้
                </v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Footer Stats -->
          <v-divider />
          <v-card-text class="d-flex justify-space-between align-center py-3">
            <div class="d-flex align-center gap-4">
              <span class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                <v-icon icon="mdi-information" size="14" class="mr-1" />
                แสดง {{ filteredUsers.length }} จาก {{ users.length }} ผู้ใช้งาน
              </span>
              <span v-if="selectedUsers.length" class="text-caption text-primary">
                เลือกแล้ว {{ selectedUsers.length }} รายการ
              </span>
            </div>
            <v-btn v-if="selectedUsers.length" color="error" variant="text" size="small" prepend-icon="mdi-delete-outline" @click="bulkDelete">
              ลบที่เลือก
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Add/Edit Modal -->
        <v-dialog v-model="formDialog" max-width="550px" persistent transition="dialog-bottom-transition">
          <v-card rounded="xl" :class="isDark ? 'modal-card-dark' : 'modal-card-light'">
            <v-card-title class="pa-5 bg-gradient-primary">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <v-icon :icon="isEditMode ? 'mdi-pencil-circle' : 'mdi-account-plus'" size="28" class="mr-2" />
                  <span class="text-h5 font-weight-bold">{{ isEditMode ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้ใหม่' }}</span>
                  <div class="text-caption text-grey-lighten-2 mt-1">
                    {{ isEditMode ? 'แก้ไขข้อมูลผู้ใช้ในระบบ' : 'กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ใหม่' }}
                  </div>
                </div>
                <v-btn icon="mdi-close" variant="text" color="white" @click="closeModal" />
              </div>
            </v-card-title>

            <v-card-text class="pa-6">
              <v-form ref="formRef" v-model="formValid">
                <v-text-field
                  v-model="formData.name"
                  label="ชื่อ-นามสกุล"
                  :rules="nameRules"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-account"
                  :bg-color="isDark ? '#2a2a3a' : 'grey-lighten-4'"
                />
                <v-text-field
                  v-model="formData.email"
                  label="อีเมล"
                  type="email"
                  :rules="emailRules"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email"
                  :bg-color="isDark ? '#2a2a3a' : 'grey-lighten-4'"
                />
                <v-text-field
                  v-if="!isEditMode"
                  v-model="formData.password"
                  label="รหัสผ่าน"
                  type="password"
                  :rules="passwordRules"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock"
                  hint="ต้องมีอย่างน้อย 8 ตัวอักษร"
                  persistent-hint
                  :bg-color="isDark ? '#2a2a3a' : 'grey-lighten-4'"
                />
                <v-select
                  v-model="formData.role"
                  label="บทบาท"
                  :items="roleOptions"
                  :rules="[v => !!v || 'กรุณาเลือกบทบาท']"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-badge-account"
                  :bg-color="isDark ? '#2a2a3a' : 'grey-lighten-4'"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :icon="item.value === 'admin' ? 'mdi-shield-account' : 'mdi-account'" />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
                <v-divider class="my-4" />
                <div class="text-caption d-flex align-center gap-1" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-2'">
                  <v-icon icon="mdi-information-outline" size="14" />
                  ข้อมูลทั้งหมดจะถูกบันทึกลงในระบบ
                </div>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-5 pt-0">
              <v-spacer />
              <v-btn variant="outlined" size="large" @click="closeModal">
                <v-icon start>mdi-close</v-icon>ยกเลิก
              </v-btn>
              <v-btn color="primary" size="large" @click="submitForm" :loading="submitting" class="px-6">
                <v-icon start>{{ isEditMode ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
                {{ isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete Confirm Modal -->
        <v-dialog v-model="deleteDialog" max-width="420px" persistent>
          <v-card rounded="xl" :class="isDark ? 'modal-card-dark' : 'modal-card-light'">
            <v-card-title class="pa-5" :class="isDark ? 'bg-error-dark' : 'bg-error-light'">
              <div class="d-flex align-center gap-3">
                <v-avatar color="error" size="48">
                  <v-icon icon="mdi-delete" size="28" color="white" />
                </v-avatar>
                <div>
                  <span class="text-h6 font-weight-bold text-error">ยืนยันการลบ</span>
                  <div class="text-caption" :class="isDark ? 'text-grey-lighten-2' : 'text-grey-darken-1'">
                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                  </div>
                </div>
              </div>
            </v-card-title>

            <v-card-text class="pa-5">
              <p class="text-body-1 mb-2" :class="isDark ? 'text-white' : 'text-grey-darken-4'">
                คุณต้องการลบผู้ใช้
                <strong class="text-primary">{{ deleteUserName }}</strong>
                ออกจากระบบใช่หรือไม่?
              </p>
              <v-alert type="warning" variant="tonal" density="compact" class="mt-3">
                <template v-slot:prepend><v-icon icon="mdi-alert" /></template>
                ข้อมูลผู้ใช้จะถูกลบอย่างถาวร
              </v-alert>
            </v-card-text>

            <v-card-actions class="pa-5 pt-0">
              <v-spacer />
              <v-btn variant="outlined" @click="deleteDialog = false">
                <v-icon start>mdi-cancel</v-icon>ยกเลิก
              </v-btn>
              <v-btn color="error" @click="confirmDelete" :loading="deleting" class="px-4">
                <v-icon start>mdi-delete</v-icon>ลบผู้ใช้
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar Toast -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000" location="bottom end" rounded="lg">
          <div class="d-flex align-center gap-3">
            <v-icon :icon="snackbar.icon" size="24" />
            <span class="text-body-1">{{ snackbar.text }}</span>
          </div>
          <template v-slot:actions>
            <v-btn variant="text" icon="mdi-close" @click="snackbar.show = false" />
          </template>
        </v-snackbar>

        <!-- Loading Overlay -->
        <v-overlay v-model="loadingOverlay" class="align-center justify-center">
          <v-progress-circular indeterminate size="64" color="primary" />
          <p class="text-white mt-4">กำลังดำเนินการ...</p>
        </v-overlay>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

// ========== Theme ==========
const currentTheme = ref('dark') // default theme: 'dark' | 'light'
const isDark = computed(() => currentTheme.value === 'dark')

// โหลดธีมที่บันทึกไว้
onMounted(() => {
  loadUsers()
})

// ========== API Configuration ==========
const API_BASE_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      showToast('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง', 'error')
    } else if (error.response?.status === 403) {
      showToast('คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้', 'error')
    }
    return Promise.reject(error)
  }
)

// ========== API Functions ==========
const fetchUsersFromAPI = async () => {
  try {
    const response = await apiClient.get('/users')
    return response.data
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const resp2 = await apiClient.get('/users-all')
      return resp2.data
    }
    throw error
  }
}

const createUserAPI = async (userData) => {
  const response = await apiClient.post('/users', userData)
  return response.data
}

const updateUserAPI = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData)
  return response.data
}

const deleteUserAPI = async (id) => {
  const response = await apiClient.delete(`/users/${id}`)
  return response.data
}

// ========== State ==========
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const loadingOverlay = ref(false)
const users = ref([])
const searchQuery = ref('')
const filterRole = ref('all')
const filteredUsers = ref([])
const selectedUsers = ref([])
const formDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const editId = ref(null)
const deleteUserId = ref(null)
const deleteUserName = ref('')
const formValid = ref(false)
const formRef = ref(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

const snackbar = ref({ show: false, text: '', color: 'success', icon: 'mdi-check-circle' })

const formData = ref({ name: '', email: '', password: '', role: '' })

const nameRules = [
  v => !!v || 'กรุณากรอกชื่อผู้ใช้',
  v => (v && v.length >= 2) || 'ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร'
]
const emailRules = [
  v => !!v || 'กรุณากรอกอีเมล',
  v => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง'
]
const passwordRules = [
  v => !!v || 'กรุณากรอกรหัสผ่าน',
  v => (v && v.length >= 8) || 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
]

const roleOptions = [
  { title: '👑 ผู้ดูแลระบบ (Admin)', value: 'admin' },
  { title: '👤 ผู้ใช้ทั่วไป (User)', value: 'user' }
]

// Headers - เพิ่มคอลัมน์ลำดับที่
const headers = [
  { title: 'ลำดับ', key: 'index', align: 'center', sortable: false, width: '80px' },
  { title: 'ชื่อผู้ใช้งาน', key: 'name', align: 'start', sortable: true },
  { title: 'อีเมล', key: 'email', sortable: true },
  { title: 'บทบาท', key: 'role', align: 'center', sortable: true },
  { title: 'วันที่สมัคร', key: 'created_at', sortable: true },
  { title: 'สถานะ', key: 'status', align: 'center', sortable: false },
  { title: 'จัดการ', key: 'actions', align: 'end', sortable: false }
]

// ========== Computed ==========
const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const userCount = computed(() => users.value.filter(u => u.role === 'user').length)
const lastUpdateTime = computed(() => new Date().toLocaleTimeString('th-TH'))

// กรองตามบทบาท
const filteredByRole = computed(() => {
  if (filterRole.value === 'all') return filteredUsers.value
  return filteredUsers.value.filter(u => u.role === filterRole.value)
})

// จัดการ pagination
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredByRole.value.slice(start, end)
})

// ========== Methods ==========
const updatePagination = (options) => {
  currentPage.value = options.page
  itemsPerPage.value = options.itemsPerPage
}

const loadUsers = async () => {
  loading.value = true
  try {
    const data = await fetchUsersFromAPI()
    if (data?.data) users.value = data.data
    else if (Array.isArray(data)) users.value = data
    else users.value = data?.users || []
    filteredUsers.value = [...users.value]
    // รีเซ็ตหน้าเป็นหน้าแรกเมื่อโหลดข้อมูลใหม่
    currentPage.value = 1
  } catch (error) {
    showToast('ไม่สามารถโหลดข้อมูลผู้ใช้ได้', 'error')
  } finally {
    loading.value = false
  }
}

const filterUsers = () => {
  const query = searchQuery.value.trim().toLowerCase()
  filteredUsers.value = query
    ? users.value.filter(u => u.name?.toLowerCase().includes(query))
    : [...users.value]
  // รีเซ็ตเป็นหน้าแรกเมื่อค้นหา
  currentPage.value = 1
}

// เฝ้าดูการเปลี่ยนแปลงของ filterRole เพื่อรีเซ็ตหน้า
watch(filterRole, () => {
  currentPage.value = 1
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const getAvatarColor = (role) => role === 'admin' ? 'indigo-darken-3' : 'green-darken-3'

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const showToast = (text, type = 'success') => {
  const icons = { success: 'mdi-check-circle', error: 'mdi-alert-circle', info: 'mdi-information', warning: 'mdi-alert' }
  snackbar.value = {
    show: true, text,
    color: type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info',
    icon: icons[type] || icons.info
  }
}

const openAddModal = () => {
  isEditMode.value = false
  editId.value = null
  formData.value = { name: '', email: '', password: '', role: '' }
  formDialog.value = true
  setTimeout(() => formRef.value?.resetValidation(), 100)
}

const openEditModal = (user) => {
  isEditMode.value = true
  editId.value = user.id
  formData.value = { name: user.name, email: user.email, password: '', role: user.role }
  formDialog.value = true
  setTimeout(() => formRef.value?.resetValidation(), 100)
}

const openDeleteModal = (user) => {
  deleteUserId.value = user.id
  deleteUserName.value = user.name
  deleteDialog.value = true
}

const closeModal = () => {
  formDialog.value = false
  formData.value = { name: '', email: '', password: '', role: '' }
}

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  loadingOverlay.value = true

  try {
    if (isEditMode.value) {
      const userData = { name: formData.value.name, email: formData.value.email, role: formData.value.role }
      if (formData.value.password?.trim()) userData.password = formData.value.password
      await updateUserAPI(editId.value, userData)
      const index = users.value.findIndex(u => u.id === editId.value)
      if (index !== -1) users.value[index] = { ...users.value[index], ...userData }
      showToast(`แก้ไขข้อมูล "${formData.value.name}" เรียบร้อยแล้ว`, 'success')
    } else {
      const newUser = await createUserAPI(formData.value)
      users.value.push(newUser)
      showToast(`เพิ่มผู้ใช้ "${formData.value.name}" เรียบร้อยแล้ว`, 'success')
    }
    filteredUsers.value = [...users.value]
    filterUsers()
    closeModal()
  } catch (error) {
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง', 'error')
  } finally {
    submitting.value = false
    loadingOverlay.value = false
  }
}

const confirmDelete = async () => {
  deleting.value = true
  loadingOverlay.value = true
  try {
    const userToDelete = users.value.find(u => u.id === deleteUserId.value)
    await deleteUserAPI(deleteUserId.value)
    users.value = users.value.filter(u => u.id !== deleteUserId.value)
    filteredUsers.value = [...users.value]
    filterUsers()
    selectedUsers.value = selectedUsers.value.filter(u => u.id !== deleteUserId.value)
    deleteDialog.value = false
    showToast(`ลบผู้ใช้ "${userToDelete?.name}" เรียบร้อยแล้ว`, 'info')
  } catch (error) {
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบ', 'error')
  } finally {
    deleting.value = false
    loadingOverlay.value = false
  }
}

const bulkDelete = async () => {
  if (!selectedUsers.value.length) return
  if (confirm(`คุณต้องการลบผู้ใช้ ${selectedUsers.value.length} รายการใช่หรือไม่?`)) {
    loadingOverlay.value = true
    const toDelete = [...selectedUsers.value]
    try {
      for (const user of toDelete) await deleteUserAPI(user.id)
      users.value = users.value.filter(u => !toDelete.some(d => d.id === u.id))
      filteredUsers.value = [...users.value]
      filterUsers()
      selectedUsers.value = []
      showToast(`ลบผู้ใช้ ${toDelete.length} รายการเรียบร้อย`, 'success')
    } catch (error) {
      showToast('เกิดข้อผิดพลาดในการลบ', 'error')
    } finally {
      loadingOverlay.value = false
    }
  }
}
</script>

<style scoped>
/* ============================
   Background Gradients
   ============================ */
.bg-gradient-dark {
  background: linear-gradient(135deg, #0f1117 0%, #1a1e2a 100%);
  min-height: 100vh;
}

.bg-gradient-light {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edf7 100%);
  min-height: 100vh;
}

/* ============================
   Stat Cards
   ============================ */
.stat-card-dark {
  background: linear-gradient(135deg, #1e1e2f 0%, #252536 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card-light {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%) !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card-dark:hover,
.stat-card-light:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

/* ============================
   Main Table Card
   ============================ */
.main-table-card-dark {
  background: #1e1e2f !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.main-table-card-light {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* ============================
   Role Toggle
   ============================ */
.role-toggle-dark {
  background: #2a2a3a !important;
  border-radius: 12px;
}

.role-toggle-light {
  background: #f1f3f9 !important;
  border-radius: 12px;
}

.role-toggle-dark :deep(.v-btn) { color: #9ca3af; }
.role-toggle-light :deep(.v-btn) { color: #6b7280; }

.role-toggle-dark :deep(.v-btn--selected),
.role-toggle-light :deep(.v-btn--selected) {
  background: #5b8dee !important;
  color: white !important;
}

/* ============================
   Data Table — Dark
   ============================ */
.custom-data-table-dark :deep(.v-table) {
  background: transparent !important;
}

.custom-data-table-dark :deep(.v-table thead th) {
  background: #1e1e2f !important;
  color: #9ca3af !important;
  font-size: 0.75rem !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}

.custom-data-table-dark :deep(.v-table tbody tr) {
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
  transition: background 0.2s;
}

.custom-data-table-dark :deep(.v-table tbody tr:hover) {
  background: rgba(91, 141, 238, 0.07) !important;
}

.custom-data-table-dark :deep(.v-table td) {
  color: #e5e7eb !important;
  padding: 16px !important;
}

/* ============================
   Data Table — Light
   ============================ */
.custom-data-table-light :deep(.v-table) {
  background: transparent !important;
}

.custom-data-table-light :deep(.v-table thead th) {
  background: #f8f9ff !important;
  color: #6b7280 !important;
  font-size: 0.75rem !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom-color: rgba(0, 0, 0, 0.08) !important;
}

.custom-data-table-light :deep(.v-table tbody tr) {
  border-bottom-color: rgba(0, 0, 0, 0.06) !important;
  transition: background 0.2s;
}

.custom-data-table-light :deep(.v-table tbody tr:hover) {
  background: rgba(91, 141, 238, 0.05) !important;
}

.custom-data-table-light :deep(.v-table td) {
  color: #374151 !important;
  padding: 16px !important;
}

/* ============================
   Modal Cards
   ============================ */
.modal-card-dark {
  background: #1e1e2f !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-card-light {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* ============================
   Modal Header Gradient
   ============================ */
.bg-gradient-primary {
  background: linear-gradient(135deg, #5b8dee, #3b6cb7) !important;
}

/* ============================
   Delete Modal Header
   ============================ */
.bg-error-dark {
  background: rgba(224, 92, 107, 0.12) !important;
}

.bg-error-light {
  background: rgba(224, 92, 107, 0.06) !important;
}

/* ============================
   Role Chip
   ============================ */
.role-chip {
  font-weight: 500 !important;
  text-transform: none !important;
}

/* ============================
   Gap Utilities
   ============================ */
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

/* ============================
   Custom Scrollbar
   ============================ */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #1e1e2f; }
::-webkit-scrollbar-thumb { background: #5b8dee; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #4a7de0; }
</style>