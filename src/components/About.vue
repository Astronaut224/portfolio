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

    <p class="mt-6 max-w-3xl text-muted leading-relaxed">
      你好，我是王宇航——生于2000年，坐标南京，物联网工程专业。
      毕业后从事过技术支持、运维和开发等工作，拥有多年的前端开发经验，目前在努力学习新技术拓展自己的技术栈，拥抱 AI 创新技术。
      我喜欢构建有实际用途的工具，也喜欢把复杂的东西写得清晰易懂。代码是我思考的载体，文字是我表达的方式。
      工作之余，我也热衷于参与开源社区、撰写技术文章，并持续探索全栈开发和 AI 工具的落地应用。如果你对合作、交流或一起做些有趣的事情感兴趣，欢迎随时联系我。
    </p>

    <!-- 技能列表 -->
    <div class="mt-12 grid gap-8 sm:grid-cols-3">
      <div v-for="group in skills" :key="group.category" class="rounded-xl border border-line p-6">
        <h3 class="text-lg font-semibold text-fg">{{ group.category }}</h3>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-md bg-surface px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-2"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>