// 项目数据：使用数组存储，方便后续添加和修改
export interface Project {
  id: number
  name: string
  description: string
  /** 项目截图 URL（使用懒加载渲染） */
  image: string
  /** 技术栈标签 */
  stack: string[]
  /** 项目链接，可为空 */
  link: string | null
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Portfolio Website',
    description: '使用 Vue + Tailwind CSS 构建的个人作品集网站，支持深色主题与流畅滚动动画。',
    image: 'https://placehold.co/600x360/0a0a0a/6366f7?text=Portfolio',
    stack: ['Vue', 'TypeScript', 'Tailwind CSS'],
    link: 'https://github.com/',
  },
  {
    id: 2,
    name: 'Task Manager App',
    description: '一个支持拖拽排序与本地存储的任务管理应用，界面简洁，交互流畅。',
    image: 'https://placehold.co/600x360/0a0a0a/a855f7?text=Task+Manager',
    stack: ['Vue', 'Pinia', 'TypeScript'],
    link: 'https://github.com/',
  },
  {
    id: 3,
    name: 'Weather Dashboard',
    description: '集成第三方 API 的天气看板，支持城市搜索与多日预报展示。',
    image: 'https://placehold.co/600x360/0a0a0a/ec4899?text=Weather+Dashboard',
    stack: ['Vue', 'Axios', 'Tailwind CSS'],
    link: 'https://github.com/',
  },
  {
    id: 4,
    name: 'Blog Engine',
    description: '基于 Markdown 的轻量博客引擎，支持标签、归档与全文搜索。',
    image: 'https://placehold.co/600x360/0a0a0a/6366f7?text=Blog+Engine',
    stack: ['Node.js', 'Vue', 'Express'],
    link: null,
  },
]
