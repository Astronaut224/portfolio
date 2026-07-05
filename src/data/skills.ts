// 技能数据：按分类组织，便于后续增删
export interface SkillGroup {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: '前端开发',
    items: ['Vue', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5', 'CSS3'],
  },
  {
    category: '后端开发',
    items: ['Node.js', 'Express', 'Python', 'REST API'],
  },
  {
    category: '工具与工程化',
    items: ['Git', 'Docker', 'Webpack', 'ESLint'],
  },
]
