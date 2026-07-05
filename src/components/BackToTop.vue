<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 返回顶部悬浮按钮：向下滚动超过阈值后出现，点击平滑返回顶部，回到顶部后隐藏
const visible = ref(false)
let ticking = false

const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    // 滚动超过一屏附近时显示
    visible.value = window.scrollY > 320
    ticking = false
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <button
    v-if="visible"
    type="button"
    class="fixed right-6 bottom-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/80 text-fg shadow-[var(--color-shadow)] backdrop-blur transition-all hover:bg-surface"
    aria-label="返回顶部"
    @click="scrollToTop"
  >
    <span class="sr-only">返回顶部</span>
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  </button>
</template>