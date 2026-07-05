import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 滚动进入动画 Hook
 * 通过 IntersectionObserver 监听元素，进入视口时为其添加 .is-visible 类，
 * 从而触发 CSS 中定义的渐入位移过渡。
 *
 * @param target 需要观察的元素引用（通常是组件根节点的 ref）
 * @param threshold 触发阈值，默认 0.15
 */
export function useScrollAnimation(target: Ref<HTMLElement | null>, threshold = 0.15) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = target.value
    if (!el) return

    // 浏览器不支持时直接显示，避免内容永久隐藏
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold },
    )

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
