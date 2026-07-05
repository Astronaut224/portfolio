# 技术设计

## 技术栈
- Vue + TypeScript + Vite
- Tailwind CSS
- Vue Router（如果需要多页面）
- Framer Motion（动画效果）

## 项目结构
src/
  components/
    Header.vue
    Hero.vue
    About.vue
    Projects.vue
    Contact.vue
    Footer.vue
  data/
    projects.ts
    skills.ts
  App.vue
  main.ts

## 数据管理
- 项目数据和技能数据存储在 TypeScript 文件中
- 使用数组存储，方便后续添加和修改