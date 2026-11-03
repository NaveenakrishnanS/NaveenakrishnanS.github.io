import { useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Oversized scrolling type (editorial reference). Decorative; content is duplicated for a seamless loop. */
export function Marquee({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  const run = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-[0.35em]">{item}</span>
          {/* Muted, not accent: these are separators. The accent only ever means "current". */}
          <span className="text-paper-muted" aria-hidden="true">
            /
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <>
      {/* aria-hidden sits on the track, not the wrapper: the pause control below must stay reachable. */}
      <div
        ref={ref}
        data-paused={paused || !inView || undefined}
        className="marquee overflow-hidden border-y border-paper-line py-6 select-none md:py-8"
      >
        <div aria-hidden="true" className="marquee-track text-headline font-medium whitespace-nowrap">
          {run}
          {run}
        </div>
      </div>

      {/* WCAG 2.2.2: the loop runs past 5s, so it needs an in-page stop that is not hover-only.
          Under prefers-reduced-motion the track never animates, so there is nothing to control. */}
      {!reduced && (
        <div className="shell mt-3 flex justify-end">
          <button type="button" className="pill pill-ghost-dark" onClick={() => setPaused((p) => !p)}>
            {paused ? 'Play' : 'Pause'}
            <span className="sr-only"> the scrolling roles</span>
          </button>
        </div>
      )}
    </>
  )
}
