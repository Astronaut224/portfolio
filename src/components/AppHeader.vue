<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

// 顶部导航锚点配置
const navItems = [
  { label: '首页', href: '#home' },
  { label: '关于我', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '联系', href: '#contact' },
]

// 移动端菜单展开状态
const menuOpen = ref(false)

// 主题切换
const { isDark, toggle } = useTheme()
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-line"
  >
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a href="#home" class="text-lg font-bold text-gradient">Astronaut224</a>

      <!-- 桌面端导航 -->
      <ul class="hidden sm:flex items-center gap-8 text-sm">
        <li v-for="item in navItems" :key="item.href">
          <a
            :href="item.href"
            class="text-muted transition-colors hover:text-[var(--color-primary)]"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <!-- 主题切换按钮 -->
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg transition-all hover:bg-surface hover:shadow-[var(--color-glow)]"
        :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'"
        @click="toggle"
      >
        <span class="sr-only">{{ isDark ? '切换到浅色主题' : '切换到深色主题' }}</span>
        <!-- 深色时显示太阳（提示切回浅色），浅色时显示月亮 -->
        <svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <!-- 移动端菜单按钮 -->
      <button
        type="button"
        class="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-fg transition-colors hover:bg-surface"
        :aria-expanded="menuOpen"
        aria-label="切换菜单"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">菜单</span>
        <span class="block w-5">
          <span class="block h-0.5 bg-current transition-all" :class="menuOpen ? 'translate-y-1.5 rotate-45' : '-translate-y-1'" />
          <span class="block h-0.5 bg-current my-1 transition-all" :class="menuOpen ? 'opacity-0' : 'opacity-100'" />
          <span class="block h-0.5 bg-current transition-all" :class="menuOpen ? '-translate-y-1.5 -rotate-45' : 'translate-y-1'" />
        </span>
      </button>
    </nav>

    <!-- 移动端展开菜单 -->
    <ul
      v-if="menuOpen"
      class="sm:hidden border-t border-line px-6 py-4 text-sm"
    >
      <li v-for="item in navItems" :key="item.href" class="py-2">
        <a
          :href="item.href"
          class="text-muted transition-colors hover:text-[var(--color-primary)]"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </header>
</template>