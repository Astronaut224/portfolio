import { ref } from 'vue'

// 主题持久化 key
const THEME_KEY = 'theme'

// 当前是否深色主题（响应式，供按钮绑定图标）
const isDark = ref(false)

/**
 * 启动时同步应用 localStorage 中存储的主题。
 * 必须在 Vue mount 之前调用，避免用户看到非预期主题闪烁。
 * 默认深色：无存储或存储非 light 时均为深色，仅显式存 light 才为浅色。
 */
export function applyStoredTheme(): void {
  const stored = localStorage.getItem(THEME_KEY)
  // 默认深色：只有显式存了 light 才不加 .dark
  const dark = stored !== 'light'
  document.documentElement.classList.toggle('dark', dark)
  isDark.value = dark
}

/**
 * 主题切换 composable，供按钮使用。
 * 返回响应式 isDark 和 toggle 函数。
 */
export function useTheme() {
  // 与当前 DOM 状态保持一致
  isDark.value = document.documentElement.classList.contains('dark')

  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
}