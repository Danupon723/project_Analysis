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
                {{ adminProfile.name }}
              </div>
              <div class="text-caption text-grey" style="line-height:1.3">
                {{ adminProfile.role }}
              </div>
            </div>
            <v-icon size="16" class="ml-1">
              {{ profileOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </template>

        <v-card width="320" rounded="lg" elevation="3">
          <!-- Header -->
          <div class="d-flex align-center pa-4 ga-3">
            <v-avatar size="56" style="border: 2px solid rgba(0,0,0,0.08)">
              <v-img :src="adminProfile.avatar" />
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-medium">{{ adminProfile.name }}</div>
              <v-chip size="x-small" color="deep-purple" variant="tonal" class="mt-1">
                {{ adminProfile.role }}
              </v-chip>
            </div>
          </div>

          <v-divider />

          <!-- Form -->
          <div class="pa-4">
            <p class="text-caption text-grey mb-3">แก้ไขข้อมูลโปรไฟล์</p>
            <v-text-field
              v-model="profileForm.name"
              label="ชื่อ-นามสกุล"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-text-field
              v-model="profileForm.email"
              label="อีเมล"
              type="email"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-text-field
              v-model="profileForm.phone"
              label="เบอร์โทรศัพท์"
              type="tel"
              density="compact"
              variant="outlined"
              class="mb-2"
              hide-details
            />
            <v-text-field
              v-model="profileForm.role"
              label="ตำแหน่ง"
              density="compact"
              variant="outlined"
              hide-details
              readonly
              bg-color="grey-lighten-4"
            />
          </div>

          <v-divider />

          <!-- Footer -->
          <div class="d-flex justify-end ga-2 pa-3">
            <v-btn variant="text" size="small" @click="onProfileCancel">ยกเลิก</v-btn>
            <v-btn
              color="deep-purple"
              variant="flat"
              size="small"
              :loading="profileSaving"
              @click="onProfileSave"
            >
              บันทึก
            </v-btn>
          </div>
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
              :to="`/user/${item.path}`"
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
              :to="`/user/${item.path}`"
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
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const router = useRouter()
const { mdAndUp } = useDisplay()
const theme = useTheme()

// ========== Global Theme Management ==========
const THEME_KEY = 'app-theme'

// อ่านค่า theme จาก localStorage
const loadTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'dark') {
    theme.global.name.value = 'dark'
    return true
  } else if (savedTheme === 'light') {
    theme.global.name.value = 'light'
    return false
  }
  // ถ้าไม่มีค่าให้ใช้ system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  theme.global.name.value = prefersDark ? 'dark' : 'light'
  return prefersDark
}

const isDark = ref(loadTheme())

// บันทึก theme เมื่อเปลี่ยน
const saveTheme = (dark) => {
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
}

// ฟังก์ชัน toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  saveTheme(isDark.value)
  
  // เพิ่ม/ลบ class ที่ html element (สำหรับ CSS ที่ไม่ใช่ Vuetify)
  if (isDark.value) {
    document.documentElement.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
  }
}

// ฟังก์ชัน set theme (เผื่อเรียกใช้ที่อื่น)
const setTheme = (dark) => {
  isDark.value = dark
  theme.global.name.value = dark ? 'dark' : 'light'
  saveTheme(dark)
  if (dark) {
    document.documentElement.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
  }
}

// ตั้งค่า initial class
onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark-theme')
  }
})

// ========== Menu ==========
const menu = [
  { title: 'Dashboard',        icon: 'mdi-view-dashboard', path: 'dashboarduser' }, //หน้าหลัก
  { title: 'Bookings',         icon: 'mdi-calendar',       path: 'reserve' }, //หน้าจองสนาม
  { title: 'Court Management', icon: 'mdi-tennis',         path: 'courts' },
  { title: 'User Stats',       icon: 'mdi-account-group',  path: 'tables' },
  { title: 'Revenue',          icon: 'mdi-cash',           path: 'revenue' },
  { title: 'Settings',         icon: 'mdi-cog',            path: 'settings' },
]

const rail = ref(false)

// ========== Logout ==========
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

// ========== Profile ==========
const adminProfile = reactive({
  name:   'Admin User',
  role:   'Super Admin',
  email:  'admin@badminton.app',
  phone:  '098-765-4321',
  avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
})

const profileOpen   = ref(false)
const profileSaving = ref(false)
const profileForm   = reactive({ ...adminProfile })

watch(profileOpen, (val) => {
  if (val) Object.assign(profileForm, adminProfile)
})

function onProfileCancel() {
  profileOpen.value = false
}

async function onProfileSave() {
  profileSaving.value = true
  await new Promise(r => setTimeout(r, 600))
  Object.assign(adminProfile, profileForm)
  profileSaving.value = false
  profileOpen.value   = false
}

// expose methods ให้ component อื่นใช้ (ถ้าต้องการ)
defineExpose({
  toggleTheme,
  setTheme,
  isDark
})
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