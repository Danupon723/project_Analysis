<template>
  <v-app>
    <v-app-bar app elevation="1" height="60">
      <div class="d-flex align-center px-4">
        <v-avatar size="32" color="primary" class="mr-2">
          <v-icon color="white" size="20">mdi-badminton</v-icon>
        </v-avatar>
        <span class="font-weight-bold text-subtitle-1">ADMIN</span>
      </div>

      <v-spacer />

      <v-btn icon @click="toggleTheme" class="mr-2">
        <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>

      <!-- Profile Button -->
      <v-menu
        v-model="profileOpen"
        :close-on-content-click="false"
        location="bottom end"
        offset="8"
      >
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            variant="outlined"
            class="profile-trigger rounded-lg px-2 mr-3"
          >
            <v-avatar size="28" class="mr-2">
              <v-img :src="adminProfile.avatar" />
            </v-avatar>
            <div class="text-left d-none d-sm-block">
              <div class="text-body-2 font-weight-medium" style="line-height:1.3">
                {{ adminProfile.name || '...' }}
              </div>
              <div class="text-caption text-grey" style="line-height:1.3">
                {{ adminProfile.role || '...' }}
              </div>
            </div>
            <v-icon size="16" class="ml-1">
              {{ profileOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </template>

        <v-card width="340" rounded="lg" elevation="3">

          <!-- Header -->
          <div class="d-flex align-center pa-4 ga-3">
            <v-avatar size="56" style="border: 2px solid rgba(0,0,0,0.08)">
              <v-img :src="adminProfile.avatar" />
            </v-avatar>
            <div class="flex-grow-1">
              <template v-if="profileLoading">
                <v-skeleton-loader type="text" width="130" class="mb-1" />
                <v-skeleton-loader type="chip" width="80" />
              </template>
              <template v-else>
                <div class="text-subtitle-2 font-weight-medium">{{ adminProfile.name }}</div>
                <v-chip size="x-small" color="deep-purple" variant="tonal" class="mt-1">
                  {{ adminProfile.role }}
                </v-chip>
              </template>
            </div>
            <!-- ปุ่มดินสอ (เฉพาะโหมดดูข้อมูล) -->
            <v-btn
              v-if="!isEditMode && !profileLoading"
              icon="mdi-pencil-outline"
              variant="text"
              size="small"
              color="deep-purple"
              @click="onProfileEdit"
            />
          </div>

          <v-divider />

          <!-- โหมดดูข้อมูล -->
          <template v-if="!isEditMode">
            <div class="pa-2">
              <v-progress-linear
                v-if="profileLoading"
                indeterminate
                color="deep-purple"
                rounded
                class="mb-1"
              />
              <v-list density="compact" class="pa-0">
                <v-list-item
                  prepend-icon="mdi-email-outline"
                  title="อีเมล"
                  :subtitle="adminProfile.email || '-'"
                />
                <v-list-item
                  prepend-icon="mdi-phone-outline"
                  title="เบอร์โทรศัพท์"
                  :subtitle="adminProfile.phone || '-'"
                />
                <v-list-item
                  prepend-icon="mdi-shield-account-outline"
                  title="ตำแหน่ง"
                  :subtitle="adminProfile.role || '-'"
                />
              </v-list>
            </div>

            <v-divider />

            <div class="d-flex justify-end pa-3">
              <v-btn variant="text" size="small" @click="profileOpen = false">ปิด</v-btn>
            </div>
          </template>

          <!-- โหมดแก้ไข -->
          <template v-else>
            <div class="pa-4">
              <p class="text-caption text-grey mb-3">แก้ไขข้อมูลโปรไฟล์</p>
              <v-text-field
                v-model="profileForm.name"
                label="ชื่อ-นามสกุล"
                density="compact"
                variant="outlined"
                class="mb-2"
                hide-details
                prepend-inner-icon="mdi-account-outline"
              />
              <v-text-field
                v-model="profileForm.email"
                label="อีเมล"
                type="email"
                density="compact"
                variant="outlined"
                class="mb-2"
                hide-details
                prepend-inner-icon="mdi-email-outline"
              />
              <v-text-field
                v-model="profileForm.phone"
                label="เบอร์โทรศัพท์"
                type="tel"
                density="compact"
                variant="outlined"
                class="mb-2"
                hide-details
                prepend-inner-icon="mdi-phone-outline"
              />
              <v-text-field
                :model-value="adminProfile.role"
                label="ตำแหน่ง"
                density="compact"
                variant="outlined"
                hide-details
                readonly
                bg-color="grey-lighten-4"
                prepend-inner-icon="mdi-shield-account-outline"
              />
            </div>

            <v-divider />

            <div class="d-flex justify-end ga-2 pa-3">
              <v-btn variant="text" size="small" @click="onProfileCancel">ยกเลิก</v-btn>
              <v-btn
                color="deep-purple"
                variant="flat"
                size="small"
                :loading="profileSaving"
                prepend-icon="mdi-content-save-outline"
                @click="onProfileSave"
              >
                บันทึก
              </v-btn>
            </div>
          </template>

        </v-card>
      </v-menu>

      <v-btn
        color="error"
        variant="tonal"
        prepend-icon="mdi-logout"
        @click="handleLogout"
        class="rounded-pill mr-3 d-none d-sm-flex"
        size="small"
      >
        ออกจากระบบ
      </v-btn>
      <v-btn
        icon
        color="error"
        variant="tonal"
        @click="handleLogout"
        class="mr-3 d-flex d-sm-none"
        size="small"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="layout-wrapper">
        <nav class="side-nav" :class="{ 'side-nav--collapsed': rail }">
          <div class="side-nav__toggle" v-if="mdAndUp">
            <v-btn
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              variant="text"
              density="compact"
              size="small"
              @click="rail = !rail"
            />
          </div>

          <v-list nav density="compact" class="pa-1">
            <v-list-item
              v-for="item in menu"
              :key="item.title"
              :prepend-icon="item.icon"
              :title="rail ? '' : item.title"
              :to="`/admin/${item.path}`"
              link
              active-class="active-item"
              class="rounded-lg my-1"
            >
              <v-tooltip v-if="rail" activator="parent" location="end">
                {{ item.title }}
              </v-tooltip>
            </v-list-item>
          </v-list>
        </nav>

        <main class="main-content">
          <div class="mobile-tabs d-flex d-md-none">
            <v-btn
              v-for="item in menu"
              :key="item.title"
              :to="`/admin/${item.path}`"
              variant="text"
              density="compact"
              class="mobile-tab-btn"
              active-class="mobile-tab-btn--active"
            >
              <v-icon size="20">{{ item.icon }}</v-icon>
              <div class="text-caption mt-1" style="font-size:10px">
                {{ item.title.split(' ')[0] }}
              </div>
            </v-btn>
          </div>

          <div class="content-inner">
            <router-view />
          </div>
        </main>
      </div>
    </v-main>

    <!-- Snackbar แจ้งเตือน -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom right"
      timeout="3000"
      rounded="pill"
    >
      <div class="d-flex align-center ga-2">
        <v-icon :icon="snackbar.icon" size="18" />
        {{ snackbar.text }}
      </div>
    </v-snackbar>

  </v-app>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import axios from 'axios'

const router = useRouter()
const { mdAndUp } = useDisplay()
const theme = useTheme()

// ========== API Client ==========
const API_BASE_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ========== Global Theme Management ==========
const THEME_KEY = 'app-theme'

const loadTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'dark') { theme.global.name.value = 'dark'; return true }
  if (savedTheme === 'light') { theme.global.name.value = 'light'; return false }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  theme.global.name.value = prefersDark ? 'dark' : 'light'
  return prefersDark
}

const isDark = ref(loadTheme())

const saveTheme = (dark) => localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  saveTheme(isDark.value)
  document.documentElement.classList.toggle('dark-theme', isDark.value)
}

// ========== Menu ==========
const menu = [
  { title: 'Dashboard',        icon: 'mdi-view-dashboard', path: 'dashboard' },
  { title: 'Bookings',         icon: 'mdi-calendar',       path: 'bookings' },
  { title: 'Court Management', icon: 'mdi-tennis',         path: 'courts' },
  { title: 'User Stats',       icon: 'mdi-account-group',  path: 'tables' },
  { title: 'Revenue',          icon: 'mdi-cash',           path: 'revenue' },
  { title: 'Settings',         icon: 'mdi-cog',            path: 'settings' },
]

const rail = ref(false)

// ========== Snackbar ==========
const snackbar = ref({ show: false, text: '', color: 'success', icon: 'mdi-check-circle' })
const showToast = (text, type = 'success') => {
  const icons = { success: 'mdi-check-circle', error: 'mdi-alert-circle', info: 'mdi-information' }
  snackbar.value = {
    show: true, text,
    color: type,
    icon: icons[type] || icons.info
  }
}

// ========== Logout ==========
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// ========== Profile ==========
const profileOpen   = ref(false)
const profileSaving = ref(false)
const profileLoading = ref(false)
const isEditMode    = ref(false)

// ข้อมูล profile ที่ดึงจาก API
const adminProfile = reactive({
  id:     null,
  name:   '',
  role:   '',
  email:  '',
  phone:  '',
  avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
})

// ข้อมูลในฟอร์มแก้ไข
const profileForm = reactive({ name: '', email: '', phone: '' })

// ดึง token แล้ว decode เพื่อหา userId
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    // decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || payload.userId || payload.sub || null
  } catch {
    return null
  }
}

// โหลดข้อมูลผู้ใช้ที่กำลัง login อยู่
const loadCurrentUser = async () => {
  profileLoading.value = true
  try {
    // ลองเรียก /me ก่อน ถ้าไม่มีค่อยใช้ id จาก token
    let data = null
    try {
      const res = await apiClient.get('/users/me')
      data = res.data?.data || res.data
    } catch {
      const userId = getCurrentUserId()
      if (!userId) throw new Error('ไม่พบข้อมูลผู้ใช้')
      const res = await apiClient.get(`/users/${userId}`)
      data = res.data?.data || res.data
    }

    if (data) {
      Object.assign(adminProfile, {
        id:    data.id,
        name:  data.name  || '',
        role:  data.role  || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg',
      })
    }
  } catch (error) {
    showToast('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'error')
  } finally {
    profileLoading.value = false
  }
}

// เมื่อเปิด popup ให้โหลดข้อมูลใหม่ และ sync ฟอร์ม
watch(profileOpen, async (val) => {
  if (val) {
    isEditMode.value = false
    await loadCurrentUser()
    syncFormFromProfile()
  }
})

const syncFormFromProfile = () => {
  profileForm.name  = adminProfile.name
  profileForm.email = adminProfile.email
  profileForm.phone = adminProfile.phone
}

const onProfileEdit = () => {
  syncFormFromProfile()
  isEditMode.value = true
}

const onProfileCancel = () => {
  if (isEditMode.value) {
    isEditMode.value = false  // กลับไปโหมดดูข้อมูล ไม่ปิด popup
  } else {
    profileOpen.value = false
  }
}

const onProfileSave = async () => {
  if (!adminProfile.id) return
  profileSaving.value = true
  try {
    const payload = {
      name:  profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
    }
    await apiClient.put(`/users/${adminProfile.id}`, payload)
    Object.assign(adminProfile, payload)
    isEditMode.value = false
    showToast('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว', 'success')
  } catch (error) {
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error')
  } finally {
    profileSaving.value = false
  }
}

onMounted(() => {
  if (isDark.value) document.documentElement.classList.add('dark-theme')
})

defineExpose({ toggleTheme, isDark })
</script>

<style scoped>
/* ========== Layout ========== */
.layout-wrapper {
  display: flex;
  height: 100%;
  min-height: calc(100vh - 60px);
}

/* ========== Side Nav ========== */
.side-nav {
  width: 220px;
  min-width: 220px;
  border-right: 1px solid rgba(0,0,0,0.08);
  padding: 8px 4px;
  transition: width 0.25s ease, min-width 0.25s ease;
  position: relative;
  display: none;
}
@media (min-width: 960px) {
  .side-nav { display: block; }
}
.side-nav--collapsed {
  width: 60px;
  min-width: 60px;
}
.side-nav__toggle {
  display: flex;
  justify-content: flex-end;
  padding: 4px 4px 4px 0;
}
.active-item {
  background: #5b4bff !important;
  color: white !important;
}
:deep(.v-theme--dark) .active-item {
  background: #7c6fff !important;
}

/* ========== Main Content ========== */
.main-content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content-inner { padding: 16px; flex: 1; }
@media (min-width: 600px)  { .content-inner { padding: 20px; } }
@media (min-width: 960px)  { .content-inner { padding: 24px; } }

/* ========== Mobile Tabs ========== */
.mobile-tabs {
  overflow-x: auto;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: rgb(var(--v-theme-surface));
  padding: 4px 8px;
  gap: 4px;
  scrollbar-width: none;
}
.mobile-tabs::-webkit-scrollbar { display: none; }
.mobile-tab-btn {
  flex-direction: column;
  height: 52px !important;
  min-width: 56px;
  padding: 4px 8px !important;
  font-size: 10px;
  flex-shrink: 0;
}
.mobile-tab-btn--active {
  color: #5b4bff !important;
  background: rgba(91, 75, 255, 0.08) !important;
}

/* ========== Profile Button ========== */
.profile-trigger {
  text-transform: none;
  letter-spacing: 0;
  height: 40px !important;
}

/* ========== Misc ========== */
.v-list-item { transition: all 0.2s ease; }
</style>

<style>
/* ========== Global Dark Theme Styles (สำหรับ elements ที่ไม่ใช่ Vuetify) ========== */
html.dark-theme {
  background-color: #121212;
}

html.dark-theme body {
  background-color: #121212;
  color: #ffffff;
}

/* ถ้ามี custom scrollbar */
html.dark-theme ::-webkit-scrollbar {
  background-color: #2d2d2d;
}

html.dark-theme ::-webkit-scrollbar-thumb {
  background-color: #555;
}

html.dark-theme ::-webkit-scrollbar-thumb:hover {
  background-color: #777;
}
</style>