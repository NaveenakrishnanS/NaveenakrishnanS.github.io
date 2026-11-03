import { useEffect, useState, type RefObject } from 'react'

/** True while `ref` intersects the viewport. Used to pause decorative motion offscreen. */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
