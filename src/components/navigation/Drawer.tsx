import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { nav, social } from '../../data/site'
import type { SectionId } from '../../data/types'

type DrawerProps = {
  open: boolean
  onClose: () => void
  active: SectionId | null
  /** The morphing toggle stays above the drawer, so it is part of the focus loop. */
  toggleRef: RefObject<HTMLButtonElement | null>
}

const focusable = 'a[href], button:not([disabled])'
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` }) as CSSProperties

/**
 * Right-side panel over a blurred backdrop (Marcus / Bennet mobile drawer).
 * Inert when closed; traps focus with the toggle; Escape and backdrop close it; locks page scroll.
 */
export function Drawer({ open, onClose, active, toggleRef }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel?.querySelector<HTMLElement>(focusable)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>(focusable)].filter(
        (el): el is HTMLElement => el !== null,
      )
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
  }, [open, onClose, toggleRef])

  // Items rise in only while opening; closing is immediate.
  const item = (ms: number, from: string) =>
    open
      ? { className: 'translate-y-0 opacity-100 transition-[transform,opacity] duration-700 ease-rise', style: delay(ms) }
      : { className: `${from} opacity-0`, style: undefined }

  const groupLabel = (ms: number) => {
    const s = item(ms, 'translate-y-4')
    return { className: `meta mb-5 text-ink-muted ${s.className}`, style: s.style }
  }

  return (
    <div className="site-chrome sm:hidden" inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-(--z-drawer) bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        id="site-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-(--z-drawer) flex w-[80%] max-w-sm flex-col bg-ink-2 px-8 pt-24 pb-10 text-ink-fg transition-transform duration-[600ms] ease-line ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav aria-label="Mobile">
          <p {...groupLabel(250)}>Index</p>
          <ul className="flex flex-col gap-2">
            {nav.map((link, i) => {
              const s = item(300 + i * 80, 'translate-y-6')
              return (
                <li key={link.id} className={s.className} style={s.style}>
                  <a
                    href={`#${link.id}`}
                    onClick={onClose}
                    aria-current={active === link.id ? 'true' : undefined}
                    className="link-fade block text-menu font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-auto">
          <p {...groupLabel(500)}>Elsewhere</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {social.map((link, i) => {
              const s = item(550 + i * 60, 'translate-y-4')
              return (
                <li key={link.label} className={s.className} style={s.style}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="link-fade inline-flex min-h-6 items-center"
                  >
                    {link.label}
                    {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
