import { useEffect, useRef, type CSSProperties } from 'react'
import type { Project } from '../../data/types'
import { ProjectCard } from './ProjectCard'

/** Per-card stacking offset (Jack: index * 28px). */
const STACK_STEP_PX = 28
/** How much each earlier card shrinks per card stacked above it (Jack: 0.03). */
const SHRINK_STEP = 0.03

/**
 * Sticky stacking cards (Jack). ≥md: every card is a sticky sibling, so later cards slide over
 * earlier ones. Each earlier card scales down along the *next* card's view timeline (pure CSS,
 * see .stack-card in index.css). <md, reduced motion, or no scroll-timeline support: a plain list.
 *
 * A stuck card taller than the space below its sticky offset would have its bottom covered by the
 * next card before it is ever seen, hiding project details. So the stack is measured on resize
 * and falls back to a plain list (data-stack="off") whenever any card does not fit.
 */
export function ProjectStack({ projects }: { projects: Project[] }) {
  const n = projects.length
  const timelines = projects.slice(1).map((_, i) => `--card-${i + 1}`)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const check = () => {
      const cards = Array.from(list.querySelectorAll<HTMLElement>('.stack-card'))
      const fits = cards.every((card) => {
        const top = parseFloat(getComputedStyle(card).top) || 0
        return card.offsetHeight <= window.innerHeight - top
      })
      list.dataset.stack = fits ? 'on' : 'off'
    }
    check()
    const observer = new ResizeObserver(check)
    observer.observe(list)
    window.addEventListener('resize', check)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <ol
      ref={listRef}
      className="stack-list mx-auto grid max-w-6xl gap-6 md:block"
      style={{ timelineScope: timelines.join(', ') } as CSSProperties}
    >
      {projects.map((project, i) => {
        const shrinks = i < n - 1
        const style = {
          top: `calc(var(--nav-h) + 1.5rem + ${i * STACK_STEP_PX}px)`,
          ...(i > 0 ? { viewTimelineName: `--card-${i}` } : {}),
          ...(shrinks
            ? { animationTimeline: `--card-${i + 1}`, '--shrink-to': 1 - (n - 1 - i) * SHRINK_STEP }
            : {}),
        } as CSSProperties

        return (
          <li
            key={project.id}
            data-shrink={shrinks || undefined}
            style={style}
            className="stack-card origin-top md:sticky md:mb-[12vh] md:last:mb-0"
          >
            <ProjectCard project={project} index={i} />
          </li>
        )
      })}
    </ol>
  )
}
