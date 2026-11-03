import { useRef, type CSSProperties } from 'react'
import { site } from '../data/site'
import { leadAction } from '../lib/content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePointerField } from '../hooks/usePointerField'
import { HeroBackdrop } from '../components/hero/HeroBackdrop'
import { RoleTypewriter } from '../components/hero/RoleTypewriter'
import { ArrowDown } from '../components/ui/icons'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties

/** U+00A0, written as a code point so the source holds no invisible character. */
const NBSP = String.fromCharCode(160)

/**
 * One masked line per word, except that a single-letter initial joins the word before it with a
 * non-breaking space. On a phone "Naveenakrishnan" and a lone "S" on the next line read as a
 * wrapping bug; joined, --fit-ch covers the whole line and .hero-name sizes it to fit.
 */
const splitName = (name: string) =>
  name.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1]
    if (last && word.length === 1) lines[lines.length - 1] = `${last}${NBSP}${word}`
    else lines.push(word)
    return lines
  }, [])

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  usePointerField(ref, !reduced)

  const nameLines = splitName(site.name)
  const fitCh = { '--fit-ch': Math.max(...nameLines.map((l) => l.length)) } as CSSProperties

  return (
    <section
      id="top"
      ref={ref}
      data-surface="ink"
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ink-fg"
    >
      <HeroBackdrop />

      <div className="shell relative z-10 flex flex-1 flex-col pt-[calc(var(--nav-h)+1.5rem)] pb-6 md:pb-8">
        {/* Top meta row. The roles are not repeated here: the typewriter below carries them. */}
        <dl className="meta fade-in flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-ink-muted" style={delay(150)}>
          <div>
            <dt className="sr-only">Location</dt>
            <dd>{site.location}</dd>
          </div>
          <div>
            <dt className="sr-only">Availability</dt>
            <dd className="inline-flex items-center gap-2">
              {/* No data-status: availability is not a Building state, so it takes the plain solid dot. */}
              <span className="status-dot" aria-hidden="true" />
              {site.availability}
            </dd>
          </div>
        </dl>

        {/* Identity block */}
        <div className="mt-auto pt-16">
          <div className="fade-in mb-5 md:mb-8" style={delay(500)}>
            <RoleTypewriter roles={site.roles} />
          </div>

          <h1 id="hero-title" className="hero-parallax hero-name text-display font-medium" style={fitCh}>
            {nameLines.map((line, i) => (
              <span key={line + i} className="mask-line md:mr-[0.22em] md:inline-block md:last:mr-0">
                <span style={delay(200 + i * 120)}>{line}</span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-8 border-t border-ink-line pt-6 md:mt-14 md:grid-cols-12 md:items-end">
            <p className="fade-in max-w-[38ch] text-lede text-ink-fg/85 md:col-span-6" style={delay(800)}>
              {site.positioning}
            </p>

            {/* Two actions only. LinkedIn is already a pill in the nav and the drawer, and again in the
                Contact section, so the hero keeps the lead action and the one step the nav shows only
                as a small text link. The guard avoids two Contact pills if the lead resolves there. */}
            <div className="fade-in flex flex-wrap gap-3 md:col-span-6 md:justify-end" style={delay(950)}>
              <a href={leadAction.href} className="pill pill-solid-light">
                {leadAction.label} <ArrowDown />
              </a>
              {leadAction.href !== '#contact' && (
                <a href="#contact" className="pill pill-ghost-light">
                  Contact
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
