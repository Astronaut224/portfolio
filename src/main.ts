import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { applyStoredTheme } from '@/composables/useTheme'

// 应用入口：挂载前同步应用已存主题，避免闪烁
applyStoredTheme()
createApp(App).mount('#app')