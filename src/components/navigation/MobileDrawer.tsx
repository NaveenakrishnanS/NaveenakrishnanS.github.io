import { useEffect, useRef, type CSSProperties } from 'react'
import { site } from '../../data/site'
import type { SectionId } from '../../data/types'
import { visibleNav } from '../../lib/content'
import { ArrowUpRight } from '../ui/icons'

type MobileDrawerProps = { open: boolean; onClose: () => void; active: SectionId | null }

const focusableSelector = 'a[href], button:not([disabled])'

/** Full-screen menu: traps focus, closes on Escape or link selection, locks page scroll. */
export function MobileDrawer({ open, onClose, active }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel?.querySelector<HTMLElement>(focusableSelector)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <div
      id="mobile-drawer"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      className="fixed inset-0 z-(--z-drawer) flex flex-col bg-ink text-ink-fg md:hidden"
    >
      <div className="shell flex h-(--nav-h) items-center justify-between border-b border-ink-line">
        <span className="font-medium tracking-tight">{site.name}</span>
        <button type="button" className="meta -mr-2 h-11 px-2" onClick={onClose}>
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-between pt-10 pb-8">
        <ol className="flex flex-col">
          {visibleNav.map((item, i) => (
            <li key={item.id} className="fade-in border-b border-ink-line" style={{ '--delay': `${80 + i * 60}ms` } as CSSProperties}>
              {/* Unnumbered: the drawer order follows visibleNav, which is not the page's section order,
                  so any numeral here would contradict the page. */}
              <a
                href={`#${item.id}`}
                onClick={onClose}
                aria-current={active === item.id ? 'true' : undefined}
                className="block py-4 text-menu font-medium aria-[current=true]:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>

        {/* Off-site destinations only. Contact is already a row in the list above, so a pill
            repeating it would be the same link twice in one short panel. */}
        <div className="flex flex-wrap gap-3">
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="pill pill-solid-light">
            LinkedIn <ArrowUpRight />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {site.github && (
            <a href={site.github} target="_blank" rel="noreferrer" className="pill pill-ghost-light">
              GitHub <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </nav>
    </div>
  )
}
