<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// 联系方式：邮箱、GitHub、社交媒体链接
const root = ref<HTMLElement | null>(null)
useScrollAnimation(root)

// 社交链接配置，方便后续修改
const links = [
  { label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/' },
  { label: 'Twitter', value: '@yourname', href: 'https://twitter.com/' },
]
</script>

<template>
  <section id="contact" ref="root" class="reveal mx-auto max-w-3xl px-6 py-24 text-center">
    <h2 class="text-3xl font-bold sm:text-4xl">
      联系<span class="text-gradient">我</span>
    </h2>
    <p class="mt-6 text-white/70">欢迎通过以下方式与我交流，一起创造有价值的产品。</p>

    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a
        v-for="item in links"
        :key="item.label"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-w-[160px] flex-col rounded-xl border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
      >
        <span class="text-sm font-medium text-gradient">{{ item.label }}</span>
        <span class="mt-1 text-sm text-white/60">{{ item.value }}</span>
      </a>
    </div>
  </section>
</template>
