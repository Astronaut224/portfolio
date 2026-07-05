<script setup lang="ts">
import { ref } from 'vue'

// 顶部导航锚点配置
const navItems = [
  { label: '首页', href: '#home' },
  { label: '关于我', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '联系', href: '#contact' },
]

// 移动端菜单展开状态
const menuOpen = ref(false)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-white/5"
  >
    <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a href="#home" class="text-lg font-bold text-gradient">Portfolio</a>

      <!-- 桌面端导航 -->
      <ul class="hidden sm:flex items-center gap-8 text-sm">
        <li v-for="item in navItems" :key="item.href">
          <a
            :href="item.href"
            class="text-white/70 transition-colors hover:text-white"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <!-- 移动端菜单按钮 -->
      <button
        type="button"
        class="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
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
      class="sm:hidden border-t border-white/10 px-6 py-4 text-sm"
    >
      <li v-for="item in navItems" :key="item.href" class="py-2">
        <a
          :href="item.href"
          class="text-white/80 transition-colors hover:text-white"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </header>
</template>
