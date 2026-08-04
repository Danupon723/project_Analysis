<template>
  <v-app>
    <v-main class="register-wrapper">
      <!-- Premium Background Animation -->
      <div class="background-animation">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="gradient-orb orb-4"></div>
        <div class="gradient-orb orb-5"></div>
      </div>
      
      <!-- Grid Pattern Overlay -->
      <div class="grid-overlay"></div>
      
      <!-- Animated Badminton Elements -->
      <div class="badminton-shuttlecocks">
        <div class="shuttlecock" v-for="i in 15" :key="i" :style="{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${5 + Math.random() * 6}s`,
          opacity: 0.06 + Math.random() * 0.08
        }">
          🏸
        </div>
      </div>

      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="5" xl="4">
            <!-- Premium Register Card -->
            <v-card class="register-card premium-card" elevation="0" rounded="xl">
              <!-- Decorative Accent Border -->
              <div class="card-accent"></div>
              <div class="card-glow"></div>
              
              <!-- Header Section -->
              <div class="card-header text-center">
                <div class="logo-wrapper">
                  <div class="logo-pulse"></div>
                  <div class="logo-ring"></div>
                  <v-avatar size="85" class="logo-avatar">
                    <v-icon size="50" color="#fff">mdi-badminton</v-icon>
                  </v-avatar>
                </div>
                <h1 class="text-h4 font-weight-bold mt-4">
                  Create<span class="highlight">Account</span>
                </h1>
                <p class="text-subtitle-1 mt-2">
                  <v-icon size="16" class="mr-1">mdi-sparkles</v-icon>
                  สมัครสมาชิกเพื่อเริ่มจองสนามแบดมินตัน
                  <v-icon size="16" class="ml-1">mdi-sparkles</v-icon>
                </p>
              </div>

              <v-card-text class="px-8 pt-6 pb-8">
                <v-form ref="registerForm" v-model="valid" @submit.prevent="handleRegister">
                  <!-- Full Name -->
                  <div class="input-wrapper mb-4">
                    <label class="input-label">
                      <v-icon size="14" class="mr-1">mdi-account</v-icon>
                      ชื่อ-นามสกุล
                    </label>
                    <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      placeholder="สมชาย ใจดี"
                      prepend-inner-icon="mdi-account-outline"
                      variant="outlined"
                      rounded="lg"
                      bg-color="transparent"
                      density="comfortable"
                      class="custom-input"
                      clearable
                    ></v-text-field>
                    <div class="input-focus-effect"></div>
                  </div>

                  <!-- Email -->
                  <div class="input-wrapper mb-4">
                    <label class="input-label">
                      <v-icon size="14" class="mr-1">mdi-email</v-icon>
                      อีเมล
                    </label>
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

                  <!-- Phone Number -->
                  <div class="input-wrapper mb-4">
                    <label class="input-label">
                      <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                      เบอร์โทรศัพท์
                    </label>
                    <v-text-field
                      v-model="phone"
                      :rules="phoneRules"
                      placeholder="081-234-5678"
                      prepend-inner-icon="mdi-phone-outline"
                      variant="outlined"
                      rounded="lg"
                      bg-color="transparent"
                      density="comfortable"
                      class="custom-input"
                      clearable
                    ></v-text-field>
                    <div class="input-focus-effect"></div>
                  </div>

                  <!-- Password -->
                  <div class="input-wrapper mb-2">
                    <label class="input-label">
                      <v-icon size="14" class="mr-1">mdi-lock</v-icon>
                      รหัสผ่าน
                    </label>
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

                  <!-- Premium Password Strength Indicator -->
                  <div v-if="password.length > 0" class="strength-container mb-4">
                    <div class="strength-header">
                      <span class="strength-label">ความแข็งแรงของรหัสผ่าน</span>
                      <span class="strength-percent" :style="{ color: strengthColor }">
                        {{ passwordStrength }}%
                      </span>
                    </div>
                    <div class="strength-bars">
                      <div class="strength-bar" v-for="i in 4" :key="i" :class="{ active: passwordStrength >= i * 25 }">
                        <div class="bar-fill" :style="{
                          width: `${Math.min(100, Math.max(0, passwordStrength - (i-1)*25))}%`,
                          background: getStrengthGradient(i)
                        }"></div>
                      </div>
                    </div>
                    <div class="strength-text" :style="{ color: strengthColor }">
                      <v-icon :icon="strengthIcon" size="14" class="mr-1"></v-icon>
                      {{ strengthText }}
                      <span class="strength-hint" v-if="passwordStrength < 100">
                        (ควรมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข)
                      </span>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="input-wrapper mb-4">
                    <label class="input-label">
                      <v-icon size="14" class="mr-1">mdi-lock-check</v-icon>
                      ยืนยันรหัสผ่าน
                    </label>
                    <v-text-field
                      v-model="confirmPassword"
                      :rules="confirmPasswordRules"
                      placeholder="··············"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      prepend-inner-icon="mdi-lock-check-outline"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showConfirmPassword = !showConfirmPassword"
                      variant="outlined"
                      rounded="lg"
                      bg-color="transparent"
                      density="comfortable"
                      class="custom-input"
                    ></v-text-field>
                    <div class="input-focus-effect"></div>
                    <div v-if="confirmPassword && password && confirmPassword === password" class="password-match-success">
                      <v-icon size="12" class="mr-1">mdi-check-circle</v-icon> รหัสผ่านตรงกัน
                    </div>
                  </div>

                  <!-- Terms and Conditions - Premium Checkbox -->
                  <v-checkbox
                    v-model="agreeTerms"
                    :rules="[v => !!v || 'คุณต้องยอมรับข้อกำหนดและเงื่อนไข']"
                    color="primary"
                    class="mb-5 terms-checkbox"
                    hide-details="auto"
                  >
                    <template v-slot:label>
                      <span class="terms-text text-caption">
                        ฉันยอมรับ
                        <v-btn
                          variant="text"
                          class="terms-link pa-0 text-caption"
                          @click="showTermsDialog"
                        >
                          ข้อกำหนดและเงื่อนไข
                        </v-btn>
                        และ
                        <v-btn
                          variant="text"
                          class="terms-link pa-0 text-caption"
                          @click="showPrivacyDialog"
                        >
                          นโยบายความเป็นส่วนตัว
                        </v-btn>
                      </span>
                    </template>
                  </v-checkbox>

                  <!-- Register Button with Ripple -->
                  <div class="btn-wrapper">
                    <v-btn
                      type="submit"
                      size="large"
                      block
                      rounded="xl"
                      :loading="loading"
                      :disabled="!valid || !agreeTerms"
                      class="register-btn"
                    >
                      <v-icon start v-if="!loading">mdi-account-plus</v-icon>
                      <span v-if="!loading">สมัครสมาชิก</span>
                      <span v-else>กำลังสมัครสมาชิก...</span>
                    </v-btn>
                  </div>

                  <!-- Elegant Divider -->
                  <div class="divider-section my-6">
                    <div class="divider-line"></div>
                    <div class="divider-icon">
                      <v-icon size="20" color="#8b5cf6">mdi-badminton</v-icon>
                    </div>
                    <div class="divider-line"></div>
                  </div>

                  <!-- Login Link -->
                  <div class="text-center">
                    <span class="text-grey-light">มีบัญชีอยู่แล้ว?</span>
                    <v-btn
                      variant="text"
                      class="login-link ml-2 font-weight-bold"
                      @click="goToLogin"
                    >
                      เข้าสู่ระบบ
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

      <!-- Terms Dialog -->
      <v-dialog v-model="termsDialog" max-width="550" transition="dialog-transition">
        <v-card rounded="xl" class="dialog-card">
          <v-card-title class="dialog-header pa-4">
            <v-icon size="28" class="mr-2">mdi-file-document-outline</v-icon>
            ข้อกำหนดและเงื่อนไข
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5 dialog-content">
            <div class="term-item" v-for="(term, idx) in termsList" :key="idx">
              <div class="term-icon">{{ term.icon }}</div>
              <div class="term-text">
                <strong>{{ term.title }}</strong><br>
                {{ term.description }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn class="dialog-btn" rounded="lg" @click="termsDialog = false">
              <v-icon left>mdi-check</v-icon>
              ตกลง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Privacy Dialog -->
      <v-dialog v-model="privacyDialog" max-width="550" transition="dialog-transition">
        <v-card rounded="xl" class="dialog-card">
          <v-card-title class="dialog-header pa-4">
            <v-icon size="28" class="mr-2">mdi-shield-account-outline</v-icon>
            นโยบายความเป็นส่วนตัว
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5 dialog-content">
            <div class="term-item" v-for="(privacy, idx) in privacyList" :key="idx">
              <div class="term-icon">{{ privacy.icon }}</div>
              <div class="term-text">
                <strong>{{ privacy.title }}</strong><br>
                {{ privacy.description }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn class="dialog-btn" rounded="lg" @click="privacyDialog = false">
              <v-icon left>mdi-check</v-icon>
              ตกลง
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Premium Snackbar -->
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Form data
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

// Dialogs
const termsDialog = ref(false)
const privacyDialog = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Terms & Privacy Data
const termsList = [
  { icon: '📝', title: '1. การสมัครสมาชิก', description: 'ผู้ใช้ต้องกรอกข้อมูลที่เป็นความจริงและครบถ้วนสมบูรณ์' },
  { icon: '🎾', title: '2. การจองสนาม', description: 'การจองสนามต้องชำระเงินล่วงหน้า 100% ยกเว้นมีข้อกำหนดพิเศษ' },
  { icon: '❌', title: '3. การยกเลิกการจอง', description: 'ยกเลิกก่อน 24 ชั่วโมง ได้รับเงินคืนเต็มจำนวน | ยกเลิกก่อน 12 ชั่วโมง ได้รับเงินคืน 50% | ยกเลิกน้อยกว่า 12 ชั่วโมง ไม่ได้รับเงินคืน' },
  { icon: '🏢', title: '4. การใช้งานสนาม', description: 'ผู้ใช้ต้องปฏิบัติตามกฎระเบียบของสนามอย่างเคร่งครัด' },
  { icon: '⚠️', title: '5. การระงับการใช้งาน', description: 'ระบบขอสงวนสิทธิ์ในการระงับการใช้งานหากพบการกระทำผิดกฎระเบียบ' }
]

const privacyList = [
  { icon: '📊', title: 'การเก็บรวบรวมข้อมูล', description: 'เราจะเก็บรวบรวมข้อมูลส่วนบุคคลของคุณเพื่อใช้ในการให้บริการจองสนาม' },
  { icon: '💼', title: 'การใช้ข้อมูล', description: 'ข้อมูลจะถูกใช้เพื่อการติดต่อและยืนยันการจองสนามเท่านั้น' },
  { icon: '🔒', title: 'การเปิดเผยข้อมูล', description: 'เราจะไม่เปิดเผยข้อมูลของคุณแก่บุคคลที่สามโดยไม่ได้รับความยินยอม' },
  { icon: '🛡️', title: 'การรักษาความปลอดภัย', description: 'เรามีระบบรักษาความปลอดภัยที่ได้มาตรฐานเพื่อปกป้องข้อมูลของคุณ' }
]

// Validation rules
const nameRules = [
  v => !!v || 'กรุณากรอกชื่อ-นามสกุล',
  v => (v && v.length >= 3) || 'ชื่อ-นามสกุลต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
  v => (v && v.length <= 100) || 'ชื่อ-นามสกุลยาวเกินไป'
]

const emailRules = [
  v => !!v || 'กรุณากรอกอีเมล',
  v => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง',
  v => (v && v.length <= 100) || 'อีเมลยาวเกินไป'
]

const phoneRules = [
  v => !!v || 'กรุณากรอกเบอร์โทรศัพท์',
  v => /^[0-9]{9,10}$/.test(v.replace(/[-\s]/g, '')) || 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (0xxxxxxxxx หรือ 08x-xxx-xxxx)'
]

const passwordRules = [
  v => !!v || 'กรุณากรอกรหัสผ่าน',
  v => (v && v.length >= 8) || 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
  v => /[A-Z]/.test(v) || 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว',
  v => /[a-z]/.test(v) || 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว',
  v => /[0-9]/.test(v) || 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'
]

const confirmPasswordRules = [
  v => !!v || 'กรุณายืนยันรหัสผ่าน',
  v => v === password.value || 'รหัสผ่านไม่ตรงกัน'
]

// Password strength calculator
const passwordStrength = computed(() => {
  let strength = 0
  if (password.value.length >= 8) strength += 25
  if (/[A-Z]/.test(password.value)) strength += 25
  if (/[a-z]/.test(password.value)) strength += 25
  if (/[0-9]/.test(password.value)) strength += 25
  return strength
})

const strengthColor = computed(() => {
  if (passwordStrength.value <= 25) return '#ef4444'
  if (passwordStrength.value <= 50) return '#f59e0b'
  if (passwordStrength.value <= 75) return '#3b82f6'
  return '#10b981'
})

const strengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'อ่อนมาก - ไม่ปลอดภัย'
  if (passwordStrength.value <= 50) return 'อ่อน - ควรปรับปรุง'
  if (passwordStrength.value <= 75) return 'ดี - ปลอดภัยในระดับนึง'
  return 'แข็งแรงมาก - ปลอดภัยสูง'
})

const strengthIcon = computed(() => {
  if (passwordStrength.value <= 25) return 'mdi-alert-circle'
  if (passwordStrength.value <= 50) return 'mdi-alert'
  if (passwordStrength.value <= 75) return 'mdi-check-circle'
  return 'mdi-shield-check'
})

const getStrengthGradient = (index) => {
  const gradients = [
    'linear-gradient(90deg, #ef4444, #f97316)',
    'linear-gradient(90deg, #f59e0b, #fbbf24)',
    'linear-gradient(90deg, #3b82f6, #06b6d4)',
    'linear-gradient(90deg, #10b981, #34d399)'
  ]
  return gradients[index - 1]
}

// Methods
const handleRegister = async () => {
  if (!valid.value || !agreeTerms.value) return

  loading.value = true
  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    })

    snackbar.value = {
      show: true,
      text: '🎉 สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ',
      color: 'success'
    }

    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    snackbar.value = {
      show: true,
      text: err.response?.data?.message || err.message || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
      color: 'error'
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/')
}

const showTermsDialog = () => {
  termsDialog.value = true
}

const showPrivacyDialog = () => {
  privacyDialog.value = true
}
</script>

<style scoped>
.register-wrapper {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Background Animation */
.background-animation {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
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
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0));
  bottom: 10%;
  right: 15%;
  animation-delay: 2s;
}

.orb-5 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0));
  top: 20%;
  left: 10%;
  animation-delay: 9s;
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
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
}

/* Shuttlecock Decorations */
.badminton-shuttlecocks {
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.shuttlecock {
  position: absolute;
  font-size: 2.5rem;
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

/* Premium Register Card */
.register-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 48px !important;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 60px -15px rgba(139, 92, 246, 0.3);
}

/* Card Accent */
.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899, #10b981, #8b5cf6);
  background-size: 300% 100%;
  animation: gradient-shift 4s ease infinite;
  z-index: 2;
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
  background: radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent);
  pointer-events: none;
  animation: rotate-glow 25s linear infinite;
  z-index: 0;
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
  margin-bottom: 8px;
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
  background: linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.custom-input :deep(.v-field--focused) ~ .input-focus-effect {
  width: 80%;
}

.password-match-success {
  font-size: 11px;
  color: #10b981;
  margin-top: 4px;
  margin-left: 12px;
  display: flex;
  align-items: center;
}

/* Password Strength Premium */
.strength-container {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.strength-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.strength-percent {
  font-size: 14px;
  font-weight: 800;
}

.strength-bars {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.strength-text {
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.strength-hint {
  font-size: 10px;
  color: #94a3b8;
  margin-left: 8px;
  font-weight: normal;
}

/* Terms Checkbox */
.terms-checkbox :deep(.v-label) {
  opacity: 1;
  color: #475569;
}

.terms-text {
  color: #64748b;
}

.terms-link {
  color: #8b5cf6 !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  min-width: auto;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.terms-link:hover {
  color: #6d28d9 !important;
}

/* Register Button Premium */
.btn-wrapper {
  position: relative;
}

.register-btn {
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

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.register-btn:hover::before {
  left: 100%;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.5);
}

.register-btn:active:not(:disabled) {
  transform: translateY(0);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Login Link */
.login-link {
  color: #8b5cf6 !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  transition: all 0.3s ease;
}

.login-link:hover {
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
  position: relative;
  z-index: 1;
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

/* Dialog Styling Premium */
.dialog-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.dialog-content {
  max-height: 450px;
  overflow-y: auto;
}

.term-item {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
  padding: 10px;
  border-radius: 14px;
  transition: all 0.2s;
}

.term-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.term-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.term-text {
  flex: 1;
  line-height: 1.5;
  color: #334155;
}

.dialog-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  padding: 8px 28px;
  transition: all 0.2s;
}

.dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 600px) {
  .register-card {
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
    opacity: 0.25;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 6px;
  }
  
  .footer-dot {
    display: none;
  }
  
  :deep(.v-card-text) {
    padding-left: 20px !important;
    padding-right: 20px !important;
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

.register-card {
  animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar Styling */
.register-wrapper::-webkit-scrollbar {
  width: 8px;
}

.register-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.register-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  border-radius: 4px;
}

.register-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
}

.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #8b5cf6;
  border-radius: 3px;
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