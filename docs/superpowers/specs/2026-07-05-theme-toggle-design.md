# 主题切换功能设计

## 目标
在 AppHeader 导航菜单后增加切换主题按钮，支持深色、浅色主题切换，默认浅色，记忆用户选择（localStorage）。

## 章节顺序
1. 语义 token 设计
2. 切换按钮与持久化
3. 组件改造清单

---

## 1. 语义 token 设计

### Token 表

| Token | 用途 | 浅色默认 | 深色 `.dark` | 现有硬编码对应 |
|---|---|---|---|---|
| `bg` | 页面背景 | `#ffffff` | `#0a0a0a` | `bg-[#0a0a0a]` |
| `fg` | 主文字 | `#0a0a0a` | `#ffffff` | `text-white`、`text-white/90` |
| `muted` | 次要文字 | `#4b5563` | `#a3a3a3` | `text-white/70`、`text-white/60` |
| `faint` | 暗淡文字 | `#9ca3af` | `#737373` | `text-white/40`、`text-white/50` |
| `surface` | 弱填充背景 | `#f3f4f6` | `#1a1a1a` | `bg-white/5` |
| `surface-2` | 悬停填充背景 | `#e5e7eb` | `#262626` | `hover:bg-white/10` |
| `line` | 常规边框 | `#e5e7eb` | `#1f1f1f` | `border-white/5`、`border-white/10` |
| `line-strong` | 强调边框 | `#d1d5db` | `#333333` | `border-white/15`、`hover:border-white/20` |

渐变强调色 `--color-accent-from`/`-via`/`-to` 两种主题共用，不变。

### 实现方式
- 在 `style.css` 的 `@theme` 里定义 8 个 token 的浅色默认值，保留现有 3 个 accent 变量。
- 新增 `@layer base` 段：`.dark` 选择器内用 `@theme` 整体覆盖深色值。
- `body` 的 `background-color`/`color` 从写死的 `#0a0a0a`/`#ffffff` 改为 `var(--color-bg)`/`var(--color-fg)`。
- 组件里全部用 `bg-bg`、`text-fg`、`text-muted`、`border-line` 这类语义类，不再出现 `text-white/70` 等硬编码。
- 头部毛玻璃 `bg-[#0a0a0a]/70` 改成 `bg-bg/70`，Tailwind v4 用 `color-mix` 自动处理透明度；浅色下是半透明白，深色下是半透明黑，均配 `backdrop-blur` 正常。

---

## 2. 切换按钮与持久化

### 按钮位置与样式
- 放在桌面导航 `</ul>` 之后、移动端汉堡按钮之前，桌面端和移动端共用。
- 尺寸 `h-9 w-9`，与移动端菜单按钮对齐。
- 文字颜色 `text-fg`，悬停 `bg-surface`。
- 图标用内联 SVG（lucide 风格太阳/月亮），与 Hero 现有内联 SVG 风格一致，不引新依赖。
- 深色时显示太阳图标（提示切回浅色），浅色时显示月亮图标。
- `sr-only` 无障碍标签：深色时"切换到浅色主题"，浅色时"切换到深色主题"。

### composable `useTheme.ts`
新建 `src/composables/useTheme.ts`，集中处理：
- 读取 localStorage（key `theme`，值 `light`/`dark`）。
- 切换 `<html>` 的 `.dark` 类。
- 暴露响应式 `isDark` 给按钮控制图标。

结构：
```
isDark = ref(document.documentElement.classList.contains('dark'))
toggle() -> isDark.value = !v; classList.toggle('dark', v); localStorage.setItem('theme', v ? 'dark' : 'light')
applyStoredTheme()（供 main.ts 启动同步执行）
useTheme()（供 AppHeader 按钮使用）
```

### 初始化时机
- 初始化放在 `main.ts` 中、`mount` 之前同步执行 `applyStoredTheme()`。
- 避免组件挂载时已按默认浅色渲染一帧导致深色用户看到白屏闪烁。

### 持久化行为
- 首次访问无 localStorage → 不加 `.dark`，显示浅色（符合"默认浅色"）。
- 用户点按钮 → 切换类、写 localStorage。
- 下次访问 → `main.ts` 启动时读 localStorage，值为 `dark` 加 `.dark`，值为 `light` 或无值不加。
- `applyStoredTheme`：无 localStorage 不动类（浅色）；有则按值 `toggle('dark', value==='dark')`。

---

## 3. 组件改造清单

改动两点：硬编码颜色换成语义类；写死的 `#0a0a0a`/`#ffffff` 让位给 token。不动结构、不动内容。

### `style.css`
- `@theme` 补全 8 个浅色 token 默认值，保留 3 个 accent 变量。
- 新增 `@layer base` 段：`.dark` 下用 `@theme` 整体覆盖深色值。
- `body` 改为 `var(--color-bg)`/`var(--color-fg)`。
- `.text-gradient`、`.reveal`、`prefers-reduced-motion` 不变。

### `App.vue`
- 根 div `bg-[#0a0a0a] text-white` → `bg-bg text-fg`。

### `AppHeader.vue`
- header 背景 `bg-[#0a0a0a]/70 border-white/5` → `bg-bg/70 border-line`。
- 导航锚点 `text-white/70 hover:text-white` → `text-muted hover:text-fg`。
- 移动端菜单按钮 `text-white/80 hover:bg-white/10` → `text-fg hover:bg-surface`。
- 移动端展开菜单 `border-white/10` → `border-line`；菜单项 `text-white/80 hover:text-white` → `text-muted hover:text-fg`。
- 导航 `</ul>` 后插入主题切换按钮（`useTheme` 驱动），位于移动端汉堡按钮前。

### `Hero.vue`
- 头像 `border-white/10` → `border-line`；`shadow-purple-500/10` 保留（accent 不分主题）。
- 描述 `text-white/70` → `text-muted`。
- "联系我"按钮 `border-white/15 text-white/90 hover:bg-white/10` → `border-line-strong text-fg hover:bg-surface`。
- 滚动提示 `text-white/40 hover:text-white` → `text-faint hover:text-fg`。

### `About.vue`
- 正文 `text-white/70` → `text-muted`。
- 技能卡片框 `border-white/10` → `border-line`；标题 `text-white/90` → `text-fg`。
- 技能标签 `bg-white/5 text-white/70 hover:bg-white/10` → `bg-surface text-muted hover:bg-surface-2`。

### `Projects.vue`
- 项目卡片框 `border-white/10 hover:border-white/20` → `border-line hover:border-line-strong`。
- 描述 `text-white/70` → `text-muted`；技术栈标签 `bg-white/5 text-white/60` → `bg-surface text-muted`。
- "暂无链接" `text-white/40` → `text-faint`。

### `Contact.vue`
- 导语 `text-white/70` → `text-muted`。
- 链接卡片 `border-white/10 hover:border-white/20 hover:bg-white/5` → `border-line hover:border-line-strong hover:bg-surface`；值文字 `text-white/60` → `text-faint`。

### `AppFooter.vue`
- 边框 `border-white/10` → `border-line`。
- 版权 `text-white/50` → `text-faint`；回到顶部 `text-white/60 hover:text-white` → `text-fg hover:text-muted`。

### `main.ts`
- import 并在 `mount` 前同步调用 `applyStoredTheme()`。
