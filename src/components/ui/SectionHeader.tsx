import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionHeaderProps = {
  id: string
  title: ReactNode
  /** Mono label for the meta row. Leave it out where the headline already names the section. */
  label?: string
  aside?: ReactNode
}

/**
 * Shared section opener: an optional mono meta row above a large headline. Sections are not numbered:
 * the headline carries the hierarchy, and a number that follows a build-dependent section list only
 * ever contradicts the menu beside it.
 */
export function SectionHeader({ id, title, label, aside }: SectionHeaderProps) {
  // Without a label or an aside the row would be a bare rule, so the headline stands alone instead.
  const hasMeta = Boolean(label || aside)

  return (
    <header className="mb-14 md:mb-20">
      {hasMeta && (
        <div className="meta flex items-center justify-between gap-6 border-t border-paper-line pt-4 text-paper-muted">
          <span>{label}</span>
          {aside}
        </div>
      )}
      <Reveal>
        {/* text-balance so a 16ch measure cannot leave a one-word last line ("and / how."). */}
        <h2 id={id} className={`max-w-[16ch] text-balance text-headline font-medium ${hasMeta ? 'mt-8 md:mt-12' : ''}`}>
          {title}
        </h2>
      </Reveal>
    </header>
  )
}
