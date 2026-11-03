import { useCallback, useRef, useState } from 'react'
import { nav, site } from '../../data/site'
import type { SectionId } from '../../data/types'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useElementInView } from '../../hooks/useElementInView'
import { useSurfaceUnderNav } from '../../hooks/useSurfaceUnderNav'
import { Drawer } from './Drawer'
import { MenuToggle } from './MenuToggle'

// Track every section, not just nav targets: otherwise the last nav item stays highlighted while
// scrolling through sections that aren't in the nav (Now building). 'top' (the hero) is observed so
// that scrolling back up clears the active state instead of leaving the last section marked current;
// useActiveSection maps it to null, and no nav item has that id.
const sectionIds: SectionId[] = ['top', 'work', 'expertise', 'experience', 'about', 'building', 'contact']

/**
 * Page-level chrome outside the hero:
 * - skip link
 * - a slim fixed bar that slides in once the hero (which carries its own header) leaves view
 * - the mobile toggle + drawer (always available on mobile)
 */
export function SiteChrome() {
  // Shrink the observer root by the bar's own height (`--nav-h: 4rem` in index.css) so the hero counts
  // as gone once it sits under the bar. Without this, an anchor jump parks the hero's last 64px on
  // screen (scroll-padding-top is --nav-h) while the bar is still hidden. The extra pixel is needed
  // because Chrome reports isIntersecting: true for a zero-height edge touch at exactly -64px.
  const heroVisible = useElementInView('top', '-65px 0px 0px 0px')
  const surface = useSurfaceUnderNav()
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  const onPaper = surface === 'paper'
  const tone = onPaper ? 'text-paper-fg bg-paper/85 border-paper-line' : 'text-ink-fg bg-ink/80 border-ink-line'
  // The toggle sits on the hero (cream on ink), on the bar, or over the open drawer.
  const toggleTone = open || !onPaper ? 'text-ink-fg' : 'text-paper-fg'

  return (
    <div className="site-chrome">
      <a
        href="#work"
        className="meta fixed top-3 left-3 z-(--z-skip) -translate-y-20 rounded-full bg-ink-fg px-4 py-2 text-ink focus:translate-y-0"
      >
        Skip to work
      </a>

      <header
        inert={heroVisible}
        className={`fixed inset-x-0 top-0 z-(--z-nav) h-(--nav-h) border-b backdrop-blur-md transition-[transform,background-color,color] duration-500 ease-line ${tone} ${
          heroVisible ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Reading progress along the bar's bottom edge (scroll timeline; hidden if unsupported). */}
        <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-px bg-accent" />
        <div className="shell flex h-full items-center justify-between">
          <a href="#top" className="link-fade text-wordmark font-medium">
            {site.name}
            <span className="sr-only">, back to top</span>
          </a>
          <nav aria-label="Primary" className="hidden sm:block">
            {/* gap-6 below lg: with the Expertise item the wordmark plus six links only just fit the
                bar at the sm breakpoint (640px), and gap-8 there wraps the wordmark. */}
            <ul className="flex items-center gap-6 text-sm lg:gap-8">
              {nav.map((item) => (
                <li key={item.id}>
                  {/* min-h-6 keeps the target at the 24px the hero chrome already uses (WCAG 2.5.8). */}
                  <a
                    href={`#${item.id}`}
                    className="link-fade inline-flex min-h-6 items-center"
                    aria-current={active === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-fade inline-flex min-h-6 items-center"
                >
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className={`fixed top-2.5 right-3 z-(--z-toggle) transition-colors duration-500 sm:hidden ${toggleTone}`}>
        <MenuToggle ref={toggleRef} open={open} onClick={() => (open ? close() : setOpen(true))} />
      </div>

      <Drawer open={open} onClose={close} active={active} toggleRef={toggleRef} />
    </div>
  )
}
