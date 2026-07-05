<script setup lang="ts">
import { ref } from 'vue'
import { skills } from '@/data/skills'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// 关于我：详细介绍 + 技能列表
const root = ref<HTMLElement | null>(null)
useScrollAnimation(root)
</script>

<template>
  <section id="about" ref="root" class="reveal mx-auto max-w-5xl px-6 py-24">
    <h2 class="text-3xl font-bold sm:text-4xl">
      关于<span class="text-gradient">我</span>
    </h2>

    <p class="mt-6 max-w-3xl text-white/70 leading-relaxed">
      我是一名拥有多年经验的全栈开发者，喜欢把复杂的问题拆解成简单的解决方案。
      工作之余，我也热衷于参与开源社区、撰写技术文章，并持续探索前端工程化与用户体验的最佳实践。
    </p>

    <!-- 技能列表 -->
    <div class="mt-12 grid gap-8 sm:grid-cols-3">
      <div v-for="group in skills" :key="group.category" class="rounded-xl border border-white/10 p-6">
        <h3 class="text-lg font-semibold text-white/90">{{ group.category }}</h3>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-md bg-white/5 px-3 py-1 text-sm text-white/70 transition-colors hover:bg-white/10"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
