import type { CSSProperties } from 'react'
import { site } from './data/site'
import { visibleNav } from './lib/content'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

// Homepage, the strongest proof section on the page, and contact. Only sections that exist are linked.
const proof = visibleNav.find((item) => item.id === 'work') ?? visibleNav.find((item) => item.id === 'experience')
const helpfulLinks = [
  { href: '/', label: 'Homepage' },
  ...[proof, visibleNav.find((item) => item.id === 'contact')]
    .filter((item) => item !== undefined)
    .map((item) => ({ href: `/#${item.id}`, label: item.label })),
]

/**
 * Static 404 page, prerendered into dist/404.html and never hydrated.
 * src/not-found.tsx only wires the back button. Links are root-relative so they work at any missing URL.
 */
export function NotFound() {
  return (
    <div className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip">
      <div className="nf-backdrop" aria-hidden="true" />

      <header className="shell fade-in flex h-(--nav-h) items-center justify-between gap-6" style={delay(100)}>
        <a href="/" className="inline-flex min-h-11 items-center text-brand font-medium tracking-tight">
          {site.name}
          <span className="sr-only">, homepage</span>
        </a>
        {/* .pill, not a square box of its own: every other control in the project is a rounded pill,
            and .pill lives in @layer components, so it is in this sheet for 404.html too. */}
        <a href="/" className="pill pill-solid-light">
          Homepage
          <span className="nf-dot" aria-hidden="true" />
        </a>
      </header>

      <main className="shell flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <p className="meta fade-in text-ink-muted" style={delay(200)}>
            Page was not found
          </p>
          {/* One base copy sets the box; three clipped copies form top / band / bottom, with the band shifted. */}
          <div className="nf-code fade-in mt-4 text-error-code font-medium" style={delay(300)} aria-hidden="true">
            <span className="nf-code-base">404</span>
            <span className="nf-slice nf-slice-top">404</span>
            <span className="nf-slice nf-slice-band">404</span>
            <span className="nf-slice nf-slice-bottom">404</span>
          </div>
        </div>

        <div className="grid gap-10 border-t border-ink-line py-8 md:grid-cols-3 md:gap-8 md:py-10">
          <div className="fade-in" style={delay(450)}>
            <h1 className="text-title font-medium">That page doesn’t exist.</h1>
            <p className="mt-4 max-w-[36ch] text-ink-muted">
              The link may be old, or the address may have a small typo. Nothing is broken on your side.
            </p>
          </div>

          <div className="fade-in" style={delay(550)}>
            <h2 className="meta text-ink-muted">What you can do</h2>
            <ol className="mt-3">
              <li className="flex min-h-11 items-center gap-4">
                <span className="meta text-ink-muted" aria-hidden="true">01</span>
                <span>Check the address for typos.</span>
              </li>
              <li className="flex min-h-11 items-center gap-4">
                <span className="meta text-ink-muted" aria-hidden="true">02</span>
                <span data-no-js>Use your browser’s Back button to return to the last page.</span>
                <button type="button" className="nf-link" data-back hidden>
                  <span>Go back to the last page</span>
                </button>
              </li>
              {/* No "start again from the homepage" step: the header pill and the Helpful links
                  entry below already carry that route, on a page this short. */}
            </ol>
          </div>

          <nav aria-label="Helpful links" className="fade-in" style={delay(650)}>
            <h2 className="meta text-ink-muted">Helpful links</h2>
            <ul className="mt-3">
              {helpfulLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="nf-link">
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  )
}
