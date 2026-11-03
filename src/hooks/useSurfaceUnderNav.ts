import { useEffect, useState } from 'react'

export type Surface = 'ink' | 'paper'

/** Reports the `data-surface` of whichever element currently sits beneath the fixed nav bar. */
export function useSurfaceUnderNav(navHeight = 72): Surface {
  const [surface, setSurface] = useState<Surface>('ink')

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-surface]'))
    let observer: IntersectionObserver | undefined
    let resizeTimer = 0

    // The probe band's bottom margin depends on viewport height, so rebuild it on resize.
    const observe = () => {
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setSurface((entry.target as HTMLElement).dataset.surface as Surface)
          }
        },
        // A 1px band at nav mid-height.
        { rootMargin: `-${navHeight / 2}px 0px -${Math.max(0, window.innerHeight - navHeight / 2 - 1)}px 0px` },
      )
      targets.forEach((el) => observer?.observe(el))
    }
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(observe, 150)
    }

    observe()
    window.addEventListener('resize', onResize)
    return () => {
      observer?.disconnect()
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [navHeight])

  return surface
}
