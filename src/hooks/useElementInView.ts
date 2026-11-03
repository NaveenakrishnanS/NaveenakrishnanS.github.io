import { useEffect, useState } from 'react'

/** True while the element with `id` intersects the viewport. Starts true (matches the prerendered state). */
export function useElementInView(id: string, rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = document.getElementById(id)
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [id, rootMargin])

  return inView
}
