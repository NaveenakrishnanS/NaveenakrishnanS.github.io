import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../../data/site'
import type { SectionId } from '../../data/types'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { useSurfaceUnderNav } from '../../hooks/useSurfaceUnderNav'
import { firstContentId, visibleNav, visibleSectionIds } from '../../lib/content'
import { MEDIUM_SCREEN } from '../../lib/media'
import { ArrowUpRight } from '../ui/icons'
import { MobileDrawer } from './MobileDrawer'

// Module constants: a fresh array each render would restart the observer effect.
// Watch every rendered section, including the hero and the ones the nav leaves out, so the band
// sitting over one of those clears the nav instead of stranding the previous item.
const sectionIds: readonly SectionId[] = visibleSectionIds
const navIds = new Set<SectionId>(visibleNav.map((item) => item.id))

export function Navbar() {
  const surface = useSurfaceUnderNav()
  const current = useActiveSection(sectionIds)
  const active = current && navIds.has(current) ? current : null
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeDrawer = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  // The drawer is md:hidden. Rotating a phone to landscape crosses md while it is open, which would
  // otherwise leave page scroll locked and focus trapped in a dialog nobody can see.
  useEffect(() => {
    if (!open) return
    const mql = window.matchMedia(MEDIUM_SCREEN)
    const onChange = () => {
      if (mql.matches) setOpen(false)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [open])

  const scrolled = useScrolled()

  const onInk = surface === 'ink'
  // Transparent only at the very top of the hero; once content can slide beneath, give it a backing.
  const tone = onInk
    ? scrolled
      ? 'text-ink-fg border-ink-line bg-ink/80 backdrop-blur-md'
      : 'text-ink-fg border-transparent'
    : 'text-paper-fg border-paper-line bg-paper/80 backdrop-blur-md'

  return (
    <>
      <a
        href={`#${firstContentId}`}
        className="meta fixed top-3 left-3 z-(--z-skip) -translate-y-20 rounded-full bg-ink-fg px-4 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        data-site-header
        className={`fixed inset-x-0 top-0 z-(--z-nav) h-(--nav-h) border-b transition-[background-color,color,border-color] duration-500 ${tone}`}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          {/* The "Portfolio" suffix and the wider link gap wait for lg: between md and lg the five nav
              items plus the LinkedIn pill would otherwise push the bar past the gutter and wrap the name. */}
          <a href="#top" className="flex shrink-0 items-baseline gap-3 font-medium tracking-tight whitespace-nowrap">
            <span className="text-brand">{site.name}</span>
            <span className={`meta hidden lg:inline ${onInk ? 'text-ink-muted' : 'text-paper-muted'}`}>
              Portfolio
            </span>
            <span className="sr-only">, back to top</span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6 text-ui lg:gap-8">
              {visibleNav.map((item) => (
                <li key={item.id}>
                  {/* min-h-6 lifts the target to the 24px WCAG 2.5.8 minimum; the underline still sits at pb-0.5. */}
                  <a
                    href={`#${item.id}`}
                    className="link-draw inline-flex min-h-6 items-center pb-0.5"
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
                  className={`pill ${onInk ? 'pill-ghost-light' : 'pill-ghost-dark'}`}
                >
                  LinkedIn <ArrowUpRight />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="meta -mr-2 flex h-11 items-center gap-2 px-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(true)}
          >
            Menu
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3/5 self-end bg-current" />
            </span>
          </button>
        </div>
      </header>

      <MobileDrawer open={open} onClose={closeDrawer} active={active} />
    </>
  )
}
