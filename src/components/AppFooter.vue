<script setup lang="ts">
// 页脚：版权与回到顶部
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
      <p class="text-sm text-faint">&copy; {{ year }} 张三. 保留所有权利。</p>
      <a
        href="#home"
        class="text-sm text-fg transition-colors hover:text-[var(--color-primary)]"
      >
        回到顶部 &uarr;
      </a>
    </div>
  </footer>
</template>