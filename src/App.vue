<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import Hero from '@/components/Hero.vue'
import About from '@/components/About.vue'
import Projects from '@/components/Projects.vue'
import Contact from '@/components/Contact.vue'
import AppFooter from '@/components/AppFooter.vue'

// 根组件：组合各个区块组件
</script>

<template>
  <div class="min-h-screen bg-bg text-fg">
    <AppHeader />
    <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
    <AppFooter />
  </div>
</template>