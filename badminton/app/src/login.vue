<template>
  <v-app>
    <v-main class="login-wrapper">
      <!-- Premium Background Animation -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="gradient-orb orb-4"></div>
      </div>
      
      <!-- Grid Pattern Overlay -->
      <div class="grid-overlay"></div>
      
      <!-- Animated Badminton Elements -->
      <div class="badminton-shuttlecocks">
        <div class="shuttlecock" v-for="i in 12" :key="i" :style="{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
          opacity: 0.08 + Math.random() * 0.07
        }">
          🏸
        </div>
      </div>

      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="5" xl="4">
            <!-- Premium Card -->
            <v-card class="login-card premium-card" elevation="0" rounded="xl">
              <!-- Decorative Top Border -->
              <div class="card-accent"></div>
              
              <!-- Glowing Effects -->
              <div class="card-glow"></div>
              
              <!-- Logo & Title Section -->
              <div class="card-header text-center">
                <div class="logo-wrapper">
                  <div class="logo-pulse"></div>
                  <div class="logo-ring"></div>
                  <v-avatar size="90" class="logo-avatar">
                    <v-icon size="56" color="#fff">mdi-badminton</v-icon>
                  </v-avatar>
                </div>
                <h1 class="text-h4 font-weight-bold mt-5">
                  Badminton<span class="highlight">Arena</span>
                </h1>
                <p class="text-subtitle-1 mt-2">
                  <v-icon size="16" class="mr-1">mdi-sparkles</v-icon>
                  ระบบจองสนามแบดมินตันอัจฉริยะ
                  <v-icon size="16" class="ml-1">mdi-sparkles</v-icon>
                </p>
              </div>

              <v-card-text class="px-8 pt-6 pb-8">
                <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
                  <!-- Email Field with Icon Animation -->
                  <div class="input-wrapper mb-5">
                    <label class="input-label">อีเมล</label>
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      placeholder="name@example.com"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      rounded="lg"
                      bg-color="transparent"
                      density="comfortable"
                      class="custom-input"
                      clearable
                    ></v-text-field>
                    <div class="input-focus-effect"></div>
                  </div>

                  <!-- Password Field -->
                  <div class="input-wrapper mb-3">
                    <label class="input-label">รหัสผ่าน</label>
                    <v-text-field
                      v-model="password"
                      :rules="passwordRules"
                      placeholder="··············"
                      :type="showPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showPassword = !showPassword"
                      variant="outlined"
                      rounded="lg"
                      bg-color="transparent"
                      density="comfortable"
                      class="custom-input"
                    ></v-text-field>
                    <div class="input-focus-effect"></div>
                  </div>

                  <!-- Forgot Password Link -->
                  <div class="d-flex justify-end mb-6">
                    <v-btn
                      variant="text"
                      class="forgot-btn"
                      @click="forgotPassword"
                    >
                      <v-icon size="14" class="mr-1">mdi-help-circle-outline</v-icon>
                      ลืมรหัสผ่าน?
                    </v-btn>
                  </div>

                  <!-- Login Button with Ripple Effect -->
                  <div class="btn-wrapper">
                    <v-btn
                      type="submit"
                      size="large"
                      block
                      rounded="xl"
                      :loading="loading"
                      :disabled="!valid"
                      class="login-btn"
                    >
                      <v-icon start v-if="!loading">mdi-login-variant</v-icon>
                      <span v-if="!loading">เข้าสู่ระบบ</span>
                      <span v-else>กำลังเข้าสู่ระบบ...</span>
                    </v-btn>
                  </div>

                  <!-- Elegant Divider -->
                  <div class="divider-section my-7">
                    <div class="divider-line"></div>
                    <div class="divider-icon">
                      <v-icon size="20" color="#8b5cf6">mdi-badminton</v-icon>
                    </div>
                    <div class="divider-line"></div>
                  </div>

                  <!-- Register Link -->
                  <div class="text-center">
                    <span class="text-grey-light">ยังไม่มีบัญชี?</span>
                    <v-btn
                      variant="text"
                      class="register-btn ml-2 font-weight-bold"
                      @click="goToRegister"
                    >
                      สมัครสมาชิก
                      <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Footer -->
            <div class="footer-text text-center mt-6">
              <div class="footer-links">
                <a href="#" class="footer-link">เกี่ยวกับเรา</a>
                <span class="footer-dot">•</span>
                <a href="#" class="footer-link">นโยบายความเป็นส่วนตัว</a>
                <span class="footer-dot">•</span>
                <a href="#" class="footer-link">ช่วยเหลือ</a>
              </div>
              <span class="footer-copyright mt-2 d-block">© 2024 Badminton Arena. All rights reserved.</span>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Snackbar for notifications -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        rounded="lg"
        location="top"
        class="premium-snackbar"
      >
        <div class="snackbar-content">
          <v-icon size="20" class="mr-2" v-if="snackbar.color === 'success'">mdi-check-circle</v-icon>
          <v-icon size="20" class="mr-2" v-else-if="snackbar.color === 'error'">mdi-alert-circle</v-icon>
          <v-icon size="20" class="mr-2" v-else>mdi-information</v-icon>
          {{ snackbar.text }}
        </div>
        <template v-slot:actions>
          <v-btn variant="text" icon="mdi-close" size="small" @click="snackbar.show = false"></v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Form data - 确保在组件挂载时重置
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const email = ref('')
const password = ref('')

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Validation rules
const emailRules = [
  v => !!v || 'กรุณากรอกอีเมล',
  v => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง'
]

const passwordRules = [
  v => !!v || 'กรุณากรอกรหัสผ่าน',
  v => v.length >= 6 || 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
]

// Reset form function - 修复退出登录后表单不清空的问题
const resetForm = () => {
  email.value = ''
  password.value = ''
  valid.value = false
  showPassword.value = false
  if (loginForm.value) {
    loginForm.value.reset()
  }
}

// Methods
const handleLogin = async () => {
  if (!valid.value) return

  loading.value = true

  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      email: email.value.trim(),
      password: password.value
    })

    console.log('LOGIN DATA:', res.data)

    const token = res.data?.token
    const role = res.data?.role
    const message = res.data?.message

    if (!token || !role) {
      throw new Error('ข้อมูลจาก server ไม่ครบ')
    }

    localStorage.setItem('token', token)
    localStorage.setItem('role', role)

    console.log('ROLE SAVED:', role)

    snackbar.value = {
      show: true,
      text: message || 'เข้าสู่ระบบสำเร็จ!',
      color: 'success'
    }

    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin')
      } else if (role === 'user') {
        router.push('/user')
      } else {
        console.warn('Unknown role:', role)
        router.push('/')
      }
    }, 800)

  } catch (err) {
    console.error(err)

    snackbar.value = {
      show: true,
      text: err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      color: 'error'
    }
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  snackbar.value = {
    show: true,
    text: 'ฟังก์ชั่นรีเซ็ตรหัสผ่านจะมาเร็วๆ นี้',
    color: 'info'
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 监听路由变化，当从其他页面返回登录页时清空表单
router.beforeEach((to, from, next) => {
  if (to.path === '/login' && from.path !== '/login') {
    resetForm()
  }
  next()
})

// 组件挂载时重置表单
onMounted(() => {
  resetForm()
})

const loginForm = ref(null)
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow-x: hidden;
}

/* Background Animation */
.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(139, 92, 246, 0));
  top: -250px;
  right: -250px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.35), rgba(59, 130, 246, 0));
  bottom: -200px;
  left: -200px;
  animation-delay: 3s;
}

.orb-3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 6s;
}

.orb-4 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0));
  bottom: 10%;
  right: 15%;
  animation-delay: 2s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -40px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

/* Grid Overlay */
.grid-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

/* Shuttlecock Decorations */
.badminton-shuttlecocks {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.shuttlecock {
  position: absolute;
  font-size: 2.8rem;
  animation: float-shuttlecock 8s ease-in-out infinite;
  filter: blur(0.5px);
  user-select: none;
}

@keyframes float-shuttlecock {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-40px) rotate(15deg);
  }
}

/* Premium Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 48px !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 60px -15px rgba(139, 92, 246, 0.3);
}

/* Card Accent */
.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899, #8b5cf6);
  background-size: 300% 100%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Card Glow */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent);
  pointer-events: none;
  animation: rotate-glow 20s linear infinite;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-header {
  padding: 48px 32px 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

/* Logo Wrapper Premium */
.logo-wrapper {
  position: relative;
  display: inline-block;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 110px;
  height: 110px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130px;
  height: 130px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 50%;
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

@keyframes ring-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.6;
  }
}

.logo-avatar {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%);
  box-shadow: 0 15px 35px -5px rgba(139, 92, 246, 0.4);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: logo-float 3s ease-in-out infinite;
}

@keyframes logo-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo-wrapper:hover .logo-avatar {
  transform: scale(1.08) rotate(5deg);
}

/* Title Styling */
h1 {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.highlight {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-subtitle-1 {
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* Input Field Premium */
.input-wrapper {
  position: relative;
}

.input-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
  margin-left: 4px;
}

.custom-input :deep(.v-field) {
  border-radius: 20px !important;
  background: #f8fafc !important;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-input :deep(.v-field:hover) {
  border-color: #a78bfa;
  background: #ffffff !important;
  transform: translateY(-1px);
}

.custom-input :deep(.v-field--focused) {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
  background: #ffffff !important;
}

.custom-input :deep(.v-field__input) {
  font-size: 15px;
  padding: 12px 0;
  font-weight: 500;
}

.custom-input :deep(.v-icon) {
  color: #94a3b8;
  transition: color 0.3s ease;
}

.custom-input :deep(.v-field--focused .v-icon) {
  color: #8b5cf6;
}

.input-focus-effect {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.custom-input :deep(.v-field--focused) ~ .input-focus-effect {
  width: 80%;
}

/* Forgot Button */
.forgot-btn {
  color: #8b5cf6 !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.forgot-btn:hover {
  color: #6d28d9 !important;
  transform: translateX(-2px);
  background: rgba(139, 92, 246, 0.05);
}

/* Login Button Premium */
.btn-wrapper {
  position: relative;
}

.login-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.5px;
  font-size: 16px;
  padding: 14px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: 40px !important;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.5);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
}

/* Divider Section */
.divider-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e1, #cbd5e1, #cbd5e1, transparent);
}

.divider-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* Register Button */
.register-btn {
  color: #8b5cf6 !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  transition: all 0.3s ease;
}

.register-btn:hover {
  color: #6d28d9 !important;
  transform: translateX(4px);
  background: rgba(139, 92, 246, 0.05);
}

.text-grey-light {
  color: #94a3b8;
}

/* Footer Text Premium */
.footer-text {
  color: #94a3b8;
  font-size: 12px;
  backdrop-filter: blur(10px);
  padding: 12px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 11px;
}

.footer-link:hover {
  color: #a78bfa;
}

.footer-dot {
  color: #475569;
  font-size: 10px;
}

.footer-copyright {
  font-size: 10px;
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    border-radius: 32px !important;
  }
  
  .card-header {
    padding: 32px 20px 20px;
  }
  
  .shuttlecock {
    font-size: 1.8rem;
  }
  
  .gradient-orb {
    opacity: 0.3;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 6px;
  }
  
  .footer-dot {
    display: none;
  }
}

/* Card Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Premium Snackbar */
.premium-snackbar :deep(.v-snackbar__wrapper) {
  border-radius: 20px !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
}

.snackbar-content {
  display: flex;
  align-items: center;
  font-weight: 600;
}

:deep(.v-snackbar--success) {
  background: linear-gradient(135deg, #10b981, #059669);
}

:deep(.v-snackbar--error) {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

:deep(.v-snackbar--info) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}
</style>