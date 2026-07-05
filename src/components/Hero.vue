<script setup lang="ts">
// 首页 Hero 区：大标题 + 简介 + 头像
</script>

<template>
  <section
    id="home"
    class="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center"
  >
    <!-- 头像（懒加载） -->
    <img
      src="https://placehold.co/160x160/0a0a0a/6366f7?text=Avatar"
      alt="个人头像"
      loading="lazy"
      class="h-40 w-40 rounded-full border-2 border-white/10 object-cover shadow-lg shadow-purple-500/10"
    />

    <h1 class="mt-8 text-4xl font-extrabold sm:text-6xl">
      你好，我是 <span class="text-gradient">张三</span>
    </h1>

    <p class="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
      全栈开发者，热爱用代码构建简洁而优雅的产品。专注于前端工程化、用户体验与性能优化。
    </p>

    <!-- CTA 按钮 -->
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a
        href="#projects"
        class="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
      >
        查看项目
      </a>
      <a
        href="#contact"
        class="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
      >
        联系我
      </a>
    </div>

    <!-- 向下滚动提示 -->
    <a
      href="#about"
      class="absolute bottom-8 text-white/40 transition-colors hover:text-white"
      aria-label="向下滚动"
    >
      <svg class="h-6 w-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </section>
</template>
