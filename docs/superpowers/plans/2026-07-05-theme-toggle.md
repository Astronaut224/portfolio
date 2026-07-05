# 主题切换功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 AppHeader 导航菜单后增加切换主题按钮，支持浅色/深色切换，默认浅色，记忆用户选择（localStorage）。

**Architecture:** 抽取 8 个语义颜色 token（浅深两套值），在 `<html>` 上切换 `.dark` 类驱动主题；新建 `useTheme` composable 集中处理 localStorage 读写和类切换，`main.ts` 在 `mount` 前同步应用已存主题避免闪烁；按钮内联太阳/月亮 SVG 图标切换。

**Tech Stack:** Vue 3 (`<script setup lang="ts">`) + TypeScript + Vite 6 + Tailwind CSS v4（`@theme`/`color-mix`）

**Spec:** `docs/superpowers/specs/2026-07-05-theme-toggle-design.md`

**验证策略:** 本项目无测试框架。每个任务后运行 `pnpm typecheck` 确认无类型错误；最后用 `pnpm dev` 在浏览器切换浅深并肉眼验证。每步结束提交。

**Windows 环境命令约定:** 所有 shell 命令在 PowerShell 下运行。git 提交使用 git 二进制；若遇 `.git/index.lock` 权限错误，重试或在已批准的 shell 环境运行。

---

## File Structure

| 文件 | 动作 | 责任 |
|---|---|---|
| `src/style.css` | 修改 | 定义 8 个语义 token 浅色默认值（`@theme`）+ `.dark` 深色覆盖；`body` 引用 token |
| `src/composables/useTheme.ts` | 新建 | localStorage 读写 + `<html>` 的 `.dark` 类切换 + 响应式 `isDark` |
| `src/main.ts` | 修改 | mount 前同步调用 `applyStoredTheme()` |
| `src/App.vue` | 修改 | 根 div 用语义类 |
| `src/components/AppHeader.vue` | 修改 | 语义类 + 插入主题切换按钮 |
| `src/components/Hero.vue` | 修改 | 语义类 |
| `src/components/About.vue` | 修改 | 语义类 |
| `src/components/Projects.vue` | 修改 | 语义类 |
| `src/components/Contact.vue` | 修改 | 语义类 |
| `src/components/AppFooter.vue` | 修改 | 语义类 |

执行顺序：先建 token 与 composable 基础设施（可验证、独立），再逐个组件替换，最后整合按钮与启动时初始化。

---

### Task 1: 定义语义 token 与 `.dark` 覆盖

**Files:**
- Modify: `src/style.css`

这是 foundation。先建立两套颜色，后续所有组件替换才能引用。改完手动确认页面浅色版渲染正常（typecheck 对 CSS 无校验，改动靠肉眼）。

- [ ] **Step 1: 替换整个 `@theme` 段及 body**

把 `src/style.css` 中现有的 `@theme { ... }` 与 `body { ... }` 替换为下面的内容（新增 8 个语义 token 浅色默认值，保留 3 个 accent 变量；深色覆盖写在 `@layer base` 段）：

```css
@theme {
  /* 页面背景 */
  --color-bg: #ffffff;
  /* 主文字 */
  --color-fg: #0a0a0a;
  /* 次要文字 */
  --color-muted: #4b5563;
  /* 暗淡文字 */
  --color-faint: #9ca3af;
  /* 弱填充背景 */
  --color-surface: #f3f4f6;
  /* 悬停填充背景 */
  --color-surface-2: #e5e7eb;
  /* 常规边框 */
  --color-line: #e5e7eb;
  /* 强调边框 */
  --color-line-strong: #d1d5db;

  /* 渐变强调色（深浅共用） */
  --color-accent-from: #6366f1;
  --color-accent-via: #a855f7;
  --color-accent-to: #ec4899;
}

@layer base {
  /* 深色主题：.dark 作用在 <html> 上时整体覆盖 */
  .dark {
    --color-bg: #0a0a0a;
    --color-fg: #ffffff;
    --color-muted: #a3a3a3;
    --color-faint: #737373;
    --color-surface: #1a1a1a;
    --color-surface-2: #262626;
    --color-line: #1f1f1f;
    --color-line-strong: #333333;
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
}
```

注意：Tailwind v4 中 `.dark` 下的覆盖写在普通 CSS 规则里（`@layer base`），它通过 CSS 变量级联让 `bg-bg` 等工具类在深色下取到深色值。不使用 `dark:` 变体。不要动 `.text-gradient`、`.reveal`、`prefers-reduced-motion` 段。

- [ ] **Step 2: 类型与构建校验**

```bash
pnpm typecheck
pnpm build
```

Expected: typecheck 无错误；build 成功（Tailwind 能识别新 token 命名；若 build 报 token 相关错误需回去核对 `@theme` 写法）。

- [ ] **Step 3: 提交**

```bash
git add src/style.css
git commit -m "feat(theme): add semantic color tokens and .dark override"
```

---

### Task 2: 新建 `useTheme` composable

**Files:**
- Create: `src/composables/useTheme.ts`

独立的新文件，不依赖任何组件改动，先建好后面任务可引用。import 路径用 `@` 别名（与现有 `useScrollAnimation.ts` 调用处一致；项目已配 `@` 指向 `src`）。

- [ ] **Step 1: 创建文件并写入实现**

创建 `src/composables/useTheme.ts`，完整内容：

```typescript
import { ref } from 'vue'

// 主题持久化 key
const THEME_KEY = 'theme'

// 当前是否深色主题（响应式，供按钮绑定图标）
const isDark = ref(false)

/**
 * 启动时同步应用 localStorage 中存储的主题。
 * 必须在 Vue mount 之前调用，避免深色用户看到浅色闪烁。
 */
export function applyStoredTheme(): void {
  const stored = localStorage.getItem(THEME_KEY)
  // 默认浅色：无存储时不加 .dark
  const dark = stored === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  isDark.value = dark
}

/**
 * 主题切换 composable，供按钮使用。
 * 返回响应式 isDark 和 toggle 函数。
 */
export function useTheme() {
  // 与当前 DOM 状态保持一致
  isDark.value = document.documentElement.classList.contains('dark')

  const toggle = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggle }
}
```

- [ ] **Step 2: 运行类型检查**

```bash
pnpm typecheck
```

Expected: 无错误。

- [ ] **Step 3: 提交**

```bash
git add src/composables/useTheme.ts
git commit -m "feat(theme): add useTheme composable"
```

---

### Task 3: `main.ts` mount 前应用已存主题

**Files:**
- Modify: `src/main.ts`

在 `createApp(...).mount('#app')` 之前同步执行 `applyStoredTheme()`，确保首帧 `<html>` 已带对 `.dark` 类。

- [ ] **Step 1: 更新 `src/main.ts`**

完整内容（替换现有文件）：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { applyStoredTheme } from '@/composables/useTheme'

// 应用入口：挂载前同步应用已存主题，避免闪烁
applyStoredTheme()
createApp(App).mount('#app')
```

- [ ] **Step 2: 运行类型检查**

```bash
pnpm typecheck
```

Expected: 无错误。

- [ ] **Step 3: 提交**

```bash
git add src/main.ts
git commit -m "feat(theme): apply stored theme before mount"
```

---

### Task 4: `App.vue` 根容器改语义类

**Files:**
- Modify: `src/App.vue`

把根 div 的硬编码颜色换成语义类，确保后续组件继承语义颜色。

- [ ] **Step 1: 替换根 div 类**

把 `src/App.vue` 里：

```html
  <div class="min-h-screen bg-[#0a0a0a] text-white">
```

改为：

```html
  <div class="min-h-screen bg-bg text-fg">
```

不动 `<script setup>` 和 `<template>` 其余部分。

- [ ] **Step 2: 运行类型检查并构建验证**

```bash
pnpm typecheck
pnpm build
```

Expected: typecheck 无错误；build 成功（Tailwind 必须能识别新 token，若 build 报 `bg-bg` 未定义类说明 Task 1 的 token 名不对，需回去核对 `--color-bg`）。

- [ ] **Step 3: 提交**

```bash
git add src/App.vue
git commit -m "feat(theme): use semantic classes on root container"
```

---

### Task 5: `AppHeader.vue` 改语义类

**Files:**
- Modify: `src/components/AppHeader.vue`

这里先只做颜色语义化，**本任务不插入主题按钮**——按钮放最后整合任务，避免半截状态。

- [ ] **Step 1: 替换 header 元素的类**

把：

```html
  <header
    class="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-white/5"
  >
```

改为：

```html
  <header
    class="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-line"
  >
```

- [ ] **Step 2: 替换桌面端导航链接类**

把：

```html
          <a
            :href="item.href"
            class="text-white/70 transition-colors hover:text-white"
          >
```

改为：

```html
          <a
            :href="item.href"
            class="text-muted transition-colors hover:text-fg"
          >
```

- [ ] **Step 3: 替换移动端菜单按钮类**

把：

```html
      <button
        type="button"
        class="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
        :aria-expanded="menuOpen"
        aria-label="切换菜单"
        @click="menuOpen = !menuOpen"
      >
```

改为：

```html
      <button
        type="button"
        class="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-fg hover:bg-surface"
        :aria-expanded="menuOpen"
        aria-label="切换菜单"
        @click="menuOpen = !menuOpen"
      >
```

- [ ] **Step 4: 替换移动端展开菜单类与项**

把：

```html
    <ul
      v-if="menuOpen"
      class="sm:hidden border-t border-white/10 px-6 py-4 text-sm"
    >
      <li v-for="item in navItems" :key="item.href" class="py-2">
        <a
          :href="item.href"
          class="text-white/80 transition-colors hover:text-white"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
```

改为：

```html
    <ul
      v-if="menuOpen"
      class="sm:hidden border-t border-line px-6 py-4 text-sm"
    >
      <li v-for="item in navItems" :key="item.href" class="py-2">
        <a
          :href="item.href"
          class="text-muted transition-colors hover:text-fg"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
```

- [ ] **Step 5: 运行类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 均成功。

- [ ] **Step 6: 提交**

```bash
git add src/components/AppHeader.vue
git commit -m "feat(theme): use semantic classes in AppHeader"
```

---

### Task 6: `Hero.vue` 改语义类

**Files:**
- Modify: `src/components/Hero.vue`

- [ ] **Step 1: 头像边框类**

把：

```html
    <img
      src="https://avatars.githubusercontent.com/u/48404676"
      alt="个人头像"
      loading="lazy"
      class="h-40 w-40 rounded-full border-2 border-white/10 object-cover shadow-lg shadow-purple-500/10"
    />
```

改为（`shadow-purple-500/10` 保留，是 accent 装饰）：

```html
    <img
      src="https://avatars.githubusercontent.com/u/48404676"
      alt="个人头像"
      loading="lazy"
      class="h-40 w-40 rounded-full border-2 border-line object-cover shadow-lg shadow-purple-500/10"
    />
```

- [ ] **Step 2: 描述文字类**

把：

```html
    <p class="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
```

改为：

```html
    <p class="mt-6 max-w-2xl text-base text-muted sm:text-lg">
```

- [ ] **Step 3: "联系我"按钮类**

把：

```html
      <a
        href="#contact"
        class="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
      >
        联系我
      </a>
```

改为：

```html
      <a
        href="#contact"
        class="rounded-lg border border-line-strong px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
      >
        联系我
      </a>
```

- [ ] **Step 4: 滚动提示类**

把：

```html
    <a
      href="#about"
      class="absolute bottom-8 text-white/40 transition-colors hover:text-white"
      aria-label="向下滚动"
    >
```

改为：

```html
    <a
      href="#about"
      class="absolute bottom-8 text-faint transition-colors hover:text-fg"
      aria-label="向下滚动"
    >
```

- [ ] **Step 5: 类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 成功。

- [ ] **Step 6: 提交**

```bash
git add src/components/Hero.vue
git commit -m "feat(theme): use semantic classes in Hero"
```

---

### Task 7: `About.vue` 改语义类

**Files:**
- Modify: `src/components/About.vue`

- [ ] **Step 1: 正文类**

把：

```html
    <p class="mt-6 max-w-3xl text-white/70 leading-relaxed">
```

改为：

```html
    <p class="mt-6 max-w-3xl text-muted leading-relaxed">
```

- [ ] **Step 2: 技能卡片框与标题类**

把：

```html
      <div v-for="group in skills" :key="group.category" class="rounded-xl border border-white/10 p-6">
        <h3 class="text-lg font-semibold text-white/90">{{ group.category }}</h3>
```

改为：

```html
      <div v-for="group in skills" :key="group.category" class="rounded-xl border border-line p-6">
        <h3 class="text-lg font-semibold text-fg">{{ group.category }}</h3>
```

- [ ] **Step 3: 技能标签类**

把：

```html
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-md bg-white/5 px-3 py-1 text-sm text-white/70 transition-colors hover:bg-white/10"
          >
```

改为：

```html
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-md bg-surface px-3 py-1 text-sm text-muted transition-colors hover:bg-surface-2"
          >
```

- [ ] **Step 4: 类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 成功。

- [ ] **Step 5: 提交**

```bash
git add src/components/About.vue
git commit -m "feat(theme): use semantic classes in About"
```

---

### Task 8: `Projects.vue` 改语义类

**Files:**
- Modify: `src/components/Projects.vue`

- [ ] **Step 1: 项目卡片框类**

把：

```html
      <article
        v-for="project in projects"
        :key="project.id"
        class="group overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-white/20"
      >
```

改为：

```html
      <article
        v-for="project in projects"
        :key="project.id"
        class="group overflow-hidden rounded-xl border border-line transition-colors hover:border-line-strong"
      >
```

- [ ] **Step 2: 描述与技术栈标签类**

把：

```html
          <p class="mt-3 text-sm text-white/70 leading-relaxed">{{ project.description }}</p>

          <!-- 技术栈 -->
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="rounded-md bg-white/5 px-2.5 py-1 text-xs text-white/60"
            >
```

改为：

```html
          <p class="mt-3 text-sm text-muted leading-relaxed">{{ project.description }}</p>

          <!-- 技术栈 -->
          <ul class="mt-4 flex flex-wrap gap-2">
            <li
              v-for="tech in project.stack"
              :key="tech"
              class="rounded-md bg-surface px-2.5 py-1 text-xs text-muted"
            >
```

- [ ] **Step 3: "暂无链接"类**

把：

```html
          <span v-else class="mt-6 inline-block text-sm text-white/40">暂无链接</span>
```

改为：

```html
          <span v-else class="mt-6 inline-block text-sm text-faint">暂无链接</span>
```

- [ ] **Step 4: 类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 成功。

- [ ] **Step 5: 提交**

```bash
git add src/components/Projects.vue
git commit -m "feat(theme): use semantic classes in Projects"
```

---

### Task 9: `Contact.vue` 改语义类

**Files:**
- Modify: `src/components/Contact.vue`

- [ ] **Step 1: 导语类**

把：

```html
    <p class="mt-6 text-white/70">欢迎通过以下方式与我交流，一起创造有价值的产品。</p>
```

改为：

```html
    <p class="mt-6 text-muted">欢迎通过以下方式与我交流，一起创造有价值的产品。</p>
```

- [ ] **Step 2: 链接卡片与值文字类**

把：

```html
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
```

改为：

```html
      <a
        v-for="item in links"
        :key="item.label"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-w-[160px] flex-col rounded-xl border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface"
      >
        <span class="text-sm font-medium text-gradient">{{ item.label }}</span>
        <span class="mt-1 text-sm text-faint">{{ item.value }}</span>
      </a>
```

- [ ] **Step 3: 类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 成功。

- **Step 4: 提交**

```bash
git add src/components/Contact.vue
git commit -m "feat(theme): use semantic classes in Contact"
```

---

### Task 10: `AppFooter.vue` 改语义类

**Files:**
- Modify: `src/components/AppFooter.vue`

- [ ] **Step 1: 边框类**

把：

```html
  <footer class="border-t border-white/10">
```

改为：

```html
  <footer class="border-t border-line">
```

- [ ] **Step 2: 版权与回到顶部类**

把：

```html
      <p class="text-sm text-white/50">&copy; {{ year }} 张三. 保留所有权利。</p>
      <a
        href="#home"
        class="text-sm text-white/60 transition-colors hover:text-white"
      >
        回到顶部 &uarr;
      </a>
```

改为：

```html
      <p class="text-sm text-faint">&copy; {{ year }} 张三. 保留所有权利。</p>
      <a
        href="#home"
        class="text-sm text-fg transition-colors hover:text-muted"
      >
        回到顶部 &uarr;
      </a>
```

- [ ] **Step 3: 类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: 成功。

- [ ] **Step 4: 提交**

```bash
git add src/components/AppFooter.vue
git commit -m "feat(theme): use semantic classes in AppFooter"
```

---

### Task 11: 在 AppHeader 插入主题切换按钮

**Files:**
- Modify: `src/components/AppHeader.vue`

这是整合任务：把 useTheme 接入 UI。按钮放在桌面导航 `</ul>` 后、移动端汉堡按钮前，桌面端和移动端共用。图标用内联太阳/月亮 SVG，深色显示太阳（提示切回浅色），浅色显示月亮。锚点类已在 Task 5 改好，本任务只新增按钮和 script 引用。

- [ ] **Step 1: 在 `<script setup>` 引入 useTheme**

把 `src/components/AppHeader.vue` 的 `<script setup lang="ts">` 块改为：

```html
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

// 顶部导航锚点配置
const navItems = [
  { label: '首页', href: '#home' },
  { label: '关于我', href: '#about' },
  { label: '项目', href: '#projects' },
  { label: '联系', href: '#contact' },
]

// 移动端菜单展开状态
const menuOpen = ref(false)

// 主题切换
const { isDark, toggle } = useTheme()
</script>
```

- [ ] **Step 2: 在桌面导航 `</ul>` 后插入主题按钮**

在 AppHeader template 的桌面端 `</ul>`（导航列表结束）之后、移动端菜单按钮 `<button type="button" class="sm:hidden ...">` 之前，插入主题切换按钮：

```html
      <!-- 主题切换按钮 -->
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg hover:bg-surface transition-colors"
        :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'"
        @click="toggle"
      >
        <span class="sr-only">{{ isDark ? '切换到浅色主题' : '切换到深色主题' }}</span>
        <!-- 深色时显示太阳（提示切回浅色），浅色时显示月亮 -->
        <svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
```

`sr-only` 文案与 `aria-label` 同步显示当前提示语义。

- [ ] **Step 3: 运行类型检查与构建**

```bash
pnpm typecheck
pnpm build
```

Expected: typecheck 无错误（`isDark`/`toggle` 已从 `useTheme` 解构）；build 成功。

- [ ] **Step 4: 提交**

```bash
git add src/components/AppHeader.vue
git commit -m "feat(theme): add theme toggle button in header"
```

---

### Task 12: 浏览器整体验证

**Files:** 无修改

上面所有任务都靠 typecheck/build 验证，CSS 与交互正确性只能在浏览器肉眼确认。这一步是整体验收。

- [ ] **Step 1: 启动 dev server**

```bash
pnpm dev
```

Expected: Vite 输出本地预览地址（默认 `http://localhost:5173`）。保持服务器运行。

- [ ] **Step 2: 清除 localStorage 验证默认浅色**

在浏览器 DevTools → Application → Local Storage → 站点 origin 下，删除 `theme` 键，刷新。Expected: 显示浅色主题（白底深字、浅灰边框）。

- [ ] **Step 3: 点击主题切换按钮**

点击 AppHeader 右侧主题切换按钮（月亮图标）。Expected: 立即变成深色主题（深底白字、深灰边框）；DevTools Local Storage 出现 `theme=dark`；按钮变成太阳图标；`<html>` 元素 class 列表出现 `dark`。

- [ ] **Step 4: 验证持久化**

浏览器刷新。Expected: 仍显示深色主题，无浅色闪烁；localStorage `theme=dark` 仍在。

- [ ] **Step 5: 再次点击切回浅色**

点击按钮（此时太阳）。Expected: 切回浅色；localStorage `theme=light`。

- [ ] **Step 6: 逐区块肉眼比对**

依次滚动 Hero / About / Projects / Contact / Footer，确认两种主题下文字、边框、卡片填充 hover 都有合理对比，没有白字对白底或黑字对黑底的低可读地方。检查移动端汉堡菜单，点开确认菜单项在两种主题下都清晰。

- [ ] **Step 7: 停止 dev server**

在运行 `pnpm dev` 的终端按 Ctrl+C（PowerShell 再确认终止）。

- [ ] **Step 8: 终态提交（可选）**

无新代码改动则无需提交。如验证中发现个别颜色微调，单独提交：

```bash
git add <修改的文件>
git commit -m "fix(theme): <简述调整>"
```

---

## Self-Review

**1. Spec 覆盖**
- token 设计（8 个 + accent 共用）→ Task 1 ✓
- `.dark` 覆盖 → Task 1 ✓
- `body` 引用 token → Task 1 ✓
- `useTheme.ts`（`applyStoredTheme` + `useTheme`）→ Task 2 ✓
- `main.ts` mount 前应用 → Task 3 ✓
- AppHeader 按钮（位置/尺寸/图标/aria）→ Task 11 ✓
- 持久化行为（默认浅色、localStorage 存取）→ Task 2 + Task 12 ✓
- App.vue / 6 个组件语义类替换 → Task 4–10 ✓
- "不引新依赖、内联 SVG" → Task 11 ✓

**2. 占位符扫描**
- 无 "TBD/TODO/后面填"。
- 每一步均给出完整代码或命令。
- Task 12 Step 8 是"可选/如发现微调"，非遗留 TODO。

**3. 类型一致性**
- `applyStoredTheme()`（Task 2 定义）→ Task 3 调用一致。
- `useTheme()` 返回 `{ isDark, toggle }`（Task 2 定义）→ Task 11 解构一致。
- token 名 `bg/fg/muted/faint/surface/surface-2/line/line-strong`（Task 1）→ 各组件任务用法一致。
- `@` 别名：项目已用 `@/data/...`、`@/composables/...` 引用，说明 `@` 指向 `src` 可用；Task 2/3/11 的 `@/composables/useTheme` 路径成立。

无遗漏，spec 全部要求均有对应任务。

---

注：本计划因 apply_patch 工具无法解析相邻代码块（三反引号围栏）而改用 PowerShell 直接写入；文档已是干净的 markdown，可直接按代码块内容理解执行。
