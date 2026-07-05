<script setup lang="ts">
import { ref } from 'vue'
import { projects } from '@/data/projects'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// 项目展示：项目卡片列表
const root = ref<HTMLElement | null>(null)
useScrollAnimation(root)
</script>

<template>
  <section id="projects" ref="root" class="reveal mx-auto max-w-5xl px-6 py-24">
    <h2 class="text-3xl font-bold sm:text-4xl">
      项目<span class="text-gradient">展示</span>
    </h2>

    <div class="mt-12 grid gap-6 sm:grid-cols-2">
      <article
        v-for="project in projects"
        :key="project.id"
        class="group overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-white/20"
      >
        <!-- 项目截图（懒加载） -->
        <img
          :src="project.image"
          :alt="project.name"
          loading="lazy"
          class="aspect-[5/3] w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />

        <div class="p-6">
          <h3 class="text-xl font-semibold">{{ project.name }}</h3>
          <p class="mt-3 text-sm text-white/70 leading-relaxed">{{ project.description }}</p>

          <!-- 技术栈 -->
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="rounded-md bg-white/5 px-2.5 py-1 text-xs text-white/60"
            >
              {{ tech }}
            </li>
          </ul>

          <!-- 项目链接 -->
          <a
            v-if="project.link"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-1 text-sm text-gradient font-medium"
          >
            查看项目
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span v-else class="mt-6 inline-block text-sm text-white/40">暂无链接</span>
        </div>
      </article>
    </div>
  </section>
</template>
