import { useRef } from 'react'
import { useInView } from '../../hooks/useInView'

/**
 * The giant scrolling name (Marcus / Bennet). Decorative: the page h1 carries the name for
 * assistive tech. Two identical halves loop seamlessly; paused offscreen, static under reduced motion.
 */
export function NameMarquee({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const half = <span className="pr-[6vw]">{text}&nbsp;</span>

  return (
    <div ref={ref} aria-hidden="true" data-paused={!inView || undefined} className="marquee overflow-hidden select-none">
      {/* Uppercase, black weight (user's hero reference). Height-based, capped by width on tall screens. */}
      <div className="marquee-track text-[12vh] leading-[0.9] font-black tracking-[-0.02em] whitespace-nowrap uppercase sm:text-[min(19vh,15vw)]">
        {half}
        {half}
      </div>
    </div>
  )
}
