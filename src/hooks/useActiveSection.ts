import { useEffect, useState } from 'react'
import type { SectionId } from '../data/types'

/**
 * Returns the id of the section currently crossing the upper-middle band of the viewport, or null
 * when nothing is in that band.
 *
 * The observer keeps the whole intersecting set, not just the latest entry, because entries arrive
 * only for sections whose state changed. Scrolling off the last section would otherwise leave it
 * marked for the rest of the page, and `aria-current` with it. Ties go to the first id in `ids`,
 * which the caller passes in page order.
 */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const intersecting = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        setActive(ids.find((id) => intersecting.has(id)) ?? null)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
