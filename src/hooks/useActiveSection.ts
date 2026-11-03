import { useEffect, useState } from 'react'
import type { SectionId } from '../data/types'

/**
 * Returns the id of the section currently crossing the upper-middle band of the viewport.
 * The hero ('top') maps to null, so scrolling back up clears the active state rather than leaving
 * the last section marked current. Pass 'top' among the ids to get that.
 */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id as SectionId
          setActive(id === 'top' ? null : id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
