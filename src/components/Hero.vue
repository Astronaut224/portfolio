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
      src="https://avatars.githubusercontent.com/u/48404676"
      alt="个人头像"
      loading="lazy"
      class="h-40 w-40 rounded-full border-2 border-line object-cover shadow-[var(--color-shadow)]"
    />

    <h1 class="mt-8 text-4xl font-extrabold sm:text-6xl">
      你好，我是 <span class="text-gradient">王宇航</span>
    </h1>

    <p class="mt-6 max-w-2xl text-base text-muted sm:text-lg">
      技术开发者，热爱用代码构建简洁而优雅的产品。关注科技互联网、AI和跨学科阅读写作。
    </p>

    <!-- CTA 按钮 -->
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a
        href="#projects"
        class="btn-primary rounded-xl px-6 py-3 text-sm font-medium"
      >
        查看项目
      </a>
      <a
        href="#contact"
        class="rounded-xl border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
      >
        联系我
      </a>
    </div>

    <!-- 向下滚动提示 -->
    <a
      href="#about"
      class="absolute bottom-8 text-faint transition-colors hover:text-fg"
      aria-label="向下滚动"
    >
      <svg class="h-6 w-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </section>
</template>