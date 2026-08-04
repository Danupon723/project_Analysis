import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'


// import './styles/theme.css'

const darkTheme = {
  dark: true,
  colors: {
    background: '#1a1a2e',
    surface: '#1e293b',
    primary: '#7c4dff',
    secondary: '#42a5f5',
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
  }
}


const lightTheme = {
  dark: false,
  colors: {
    background: '#f8f9fc',
    surface: '#ffffff',
    primary: '#7c4dff',
    secondary: '#42a5f5',
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#45B7D1',
        }
      }
    }
  }
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')