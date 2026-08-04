import { createRouter, createWebHistory } from 'vue-router'


import login from './login.vue'
import register from './register.vue' 

//ส่วนของadmin
import layoutadmin from './view/admin/layoutadmin.vue'
import dashboardadmin from './view/admin/dashbordadmin.vue'
import booking from './view/admin/booking.vue'
import table from './view/admin/table.vue'
import courtManagement from './view/admin/court-management.vue'
import setting from './view/admin/setting.vue'
import revenue from './view/admin/revenue.vue'

//ส่วนของuser
import layoutuser from './view/users/layoutuser.vue'
import dashbord from './view/users/dashbord.vue'
import reserve from './view/users/reserve.vue'

const routes = [
  { 
    path: '/',         
    name: 'Login',
    component: login 
  },
  { 
    path: '/register', 
    name: 'Register',
    component: register 
  },

  // 🔵 ADMIN
  {
    path: '/admin',
    component: layoutadmin,
    children: [
      { path: '', redirect: '/admin/dashboard' }, // ✅ แก้สะกด
      { path: 'dashboard', component: dashboardadmin },
      { path: 'bookings', component: booking },
      { path: 'tables', component: table },
      { path: 'courts', component: courtManagement },
      {path: 'settings', component: setting },
      {path: 'revenue', component: revenue },
    ],
    meta: { requiresAuth: true }
  },

  // 🟢 USER
  {
    path: '/user',
    component: layoutuser,
    children: [
      { path: '', redirect: '/user/dashboarduser' }, 
      { path: 'dashboarduser', component: dashbord },
      {path: 'reserve', component: reserve },
    ],
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')   // ❌ ไม่มี token → กลับไปหน้า login
  } else {
    next()           // ✅ มี token → เข้าได้
  }
})

export default router