import { useRef, type CSSProperties, type ReactNode } from 'react'
import { nav, site, social } from '../data/site'
import { usePointerDepth } from '../hooks/usePointerMotion'
import { NameMarquee } from '../components/hero/NameMarquee'
import { IslandLink } from '../components/ui/IslandLink'

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties
const externalProps = (external: boolean) => (external ? { target: '_blank', rel: 'noreferrer' } : {})

/** A header column: micro label over a stack of 24px-tall links (WCAG 2.2 target size). */
function ChromeColumn({ label, start, children }: { label: string; start: number; children: ReactNode }) {
  return (
    <div>
      <p className="meta anim-fade-up mb-2 text-ink-muted" style={delay(start)}>
        {label}
      </p>
      {children}
    </div>
  )
}

/** Name track behind the portrait, entering by rising out of a clipped baseline. Exit wrapper is separate. */
function NameLayer() {
  return (
    // Eye level: the name passes behind the head at the forehead/glasses line (user's reference).
    <div className="hero-exit-marquee pointer-events-none absolute inset-x-0 top-[26vh] z-(--z-sheet) sm:top-[32vh]">
      {/* Depth layer: drifts opposite the portrait with the cursor (own wrapper, own transform). */}
      <div className="depth-name">
        <div className="overflow-hidden pb-[0.04em]">
          <div className="anim-mask-rise" style={delay(450)}>
            <NameMarquee text={site.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * One full-viewport composition (docs/references/marcus-bennet.md), as a 3-row grid:
 *   1. header chrome  2. the stage (the portrait fills it and stands on the rule)  3. rule + footer.
 * The name runs behind the portrait. With a fine pointer, name and portrait drift in opposite
 * directions (depth parallax via --mx / --my).
 */
export function HeroSection() {
  const { background, portrait } = site.heroImages ?? {}
  const heroRef = useRef<HTMLElement>(null)
  usePointerDepth(heroRef)

  return (
    <section
      ref={heroRef}
      id="top"
      data-surface="ink"
      aria-labelledby="hero-title"
      className="hero-timeline relative isolate grid h-[100dvh] min-h-[36rem] w-full grid-rows-[auto_1fr_auto] overflow-hidden bg-ink text-ink-fg"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name}, {site.roles.join(', ')}
      </h1>

      {background ? (
        <img src={background} alt="" fetchPriority="high" className="anim-fade-in absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div aria-hidden="true" className="hero-light anim-fade-in absolute inset-0" />
      )}

      <NameLayer />

      {/* Row 1: header chrome */}
      <header className="relative z-(--z-chrome) flex items-start justify-between px-(--gutter) pt-6 sm:pt-8">
        <a href="#top" className="anim-fade-up link-fade text-wordmark font-medium" style={delay(800)}>
          {site.name}
          <span className="sr-only">, back to top</span>
        </a>

        <div className="hidden items-start gap-14 text-sm sm:flex lg:gap-24">
          <ChromeColumn label="Index" start={960}>
            <nav aria-label="Hero">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <li key={item.id} className="anim-fade-up" style={delay(1000 + i * 80)}>
                    <a href={`#${item.id}`} className="link-fade block py-0.5 leading-5">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </ChromeColumn>
          <ChromeColumn label="Elsewhere" start={1110}>
            <ul className="flex flex-col">
              {social.map((link, i) => (
                <li key={link.label} className="anim-fade-up" style={delay(1150 + i * 80)}>
                  <a href={link.href} {...externalProps(link.external)} className="link-fade block py-0.5 leading-5">
                    {link.label}
                    {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </ChromeColumn>
        </div>
      </header>

      {/* Row 2: spacer between header and footer (the portrait is positioned on the section). */}
      <div className="min-h-0" />

      {/* Portrait: a large bust anchored to the hero's bottom edge, in front of the name AND the rule
          (user's reference). Footer text stays above it for legibility. */}
      {portrait && (
        <div className="hero-exit-portrait pointer-events-none absolute inset-0 z-(--z-portrait)">
          {/* Depth layer: drifts with the cursor, opposite the name. */}
          <div className="depth-portrait h-full">
            <div className="anim-curtain flex h-full items-end justify-center" style={delay(60)}>
              <img
                src={portrait.src}
                width={portrait.width}
                height={portrait.height}
                alt={`Portrait of ${site.name}`}
                fetchPriority="high"
                className="portrait-fade h-[74%] w-auto max-w-none object-contain object-bottom sm:h-[min(88%,96vw)]"
              />
            </div>
          </div>
        </div>
      )}

      <div aria-hidden="true" className="hero-exit-dim pointer-events-none absolute inset-0 z-(--z-dim) bg-ink opacity-0" />

      {/* Row 3: rule + footer. No z-index on this wrapper (no stacking context), so the rule can sit
          *behind* the portrait while the text sits in front of it. */}
      <div className="relative px-(--gutter) pb-6 sm:pb-8">
        <div aria-hidden="true" className="hero-rule anim-line relative z-(--z-sheet) h-px bg-ink-fg/90" style={delay(1200)} />

        {/* ≥sm: descriptors left, note + primary action right. */}
        <div className="relative z-(--z-chrome) mt-6 hidden items-end justify-between gap-10 sm:flex">
          <ul className="anim-fade-up text-sm leading-relaxed" style={delay(1400)} aria-label="Disciplines">
            {site.roles.map((role, i) => (
              <li key={role} className="flex items-baseline gap-3">
                <span className="font-mono text-meta text-ink-muted tabular-nums">0{i + 1}.</span>
                {role}
              </li>
            ))}
          </ul>
          <div className="anim-fade-up flex flex-col items-end gap-4" style={delay(1550)}>
            <p className="max-w-xs text-right text-sm leading-relaxed text-pretty text-ink-fg/85 sm:text-lede lg:max-w-sm">
              {site.positioning}
            </p>
            <IslandLink href="#contact" label="Contact" />
          </div>
        </div>

        {/* <sm: one stacked column; links surface here because the header columns are hidden. */}
        <div className="relative z-(--z-chrome) mt-5 flex flex-col gap-4 sm:hidden">
          {/* The ≥sm roles list is hidden here and the marquee only shows fragments, so the disciplines
              need a plain readable line of their own. Same copy, same data as the desktop list.
              Cream at 85%, not ink-muted, because this line sits on the portrait rather than on flat
              ink. Measured over the pixels the glyphs actually cover, from 360x640 to 639x900:
              ink-fg/85 never drops below 7.3:1, while ink-muted falls to 4.29:1 at 360x640, where the
              line wraps and the second row crosses the lit cheek (about 20% of its glyph pixels land
              under 4.5:1 there). This is also the tone the ≥sm note already uses. */}
          <p className="anim-fade-up text-ui text-ink-fg/85" style={delay(1400)}>
            {site.roles.join(' · ')}
          </p>
          <p className="anim-fade-up text-ui leading-snug text-pretty" style={delay(1470)}>
            {site.positioning}
          </p>
          <div className="anim-fade-up flex items-center justify-between gap-4" style={delay(1550)}>
            <ul className="flex gap-5 text-sm" aria-label="Elsewhere">
              {social.map((link) => (
                <li key={link.label}>
                  <a href={link.href} {...externalProps(link.external)} className="link-fade block py-0.5 leading-5 text-ink-fg/85">
                    {link.label}
                    {link.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <IslandLink href="#contact" label="Contact" />
          </div>
        </div>
      </div>
    </section>
  )
}
