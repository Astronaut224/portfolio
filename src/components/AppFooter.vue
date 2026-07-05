<script setup lang="ts">
// 页脚：版权与回到顶部
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/10">
    <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
      <p class="text-sm text-white/50">&copy; {{ year }} 张三. 保留所有权利。</p>
      <a
        href="#home"
        class="text-sm text-white/60 transition-colors hover:text-white"
      >
        回到顶部 &uarr;
      </a>
    </div>
  </footer>
</template>
