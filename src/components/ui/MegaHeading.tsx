import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type MegaHeadingProps = { id: string; children: ReactNode; tone?: 'ink' | 'paper'; className?: string }

/** Huge, black-weight, uppercase, centered section heading (Jack). Tone shift on ink, solid on paper. */
export function MegaHeading({ id, children, tone = 'ink', className = '' }: MegaHeadingProps) {
  return (
    <Reveal>
      <h2
        id={id}
        // chapter-title: scroll-scrubbed rise-and-settle where scroll timelines are supported.
        className={`chapter-title text-center text-mega font-black uppercase ${tone === 'ink' ? 'mega-tone' : 'text-paper-fg'} ${className}`}
      >
        {children}
      </h2>
    </Reveal>
  )
}
