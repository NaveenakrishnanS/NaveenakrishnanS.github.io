import { site } from '../data/site'
import { visibleAboutStatement, visiblePrinciples } from '../lib/content'
import { Marquee } from '../components/about/Marquee'
import { Reveal } from '../components/ui/Reveal'

export function AboutSection() {
  return (
    <section id="about" data-surface="paper" aria-labelledby="about-title" className="section-y bg-paper-2 pt-0">
      <Marquee items={site.roles} />

      <div className="shell pt-(--section-y)">
        <div className="meta mb-12 flex justify-between gap-6 border-t border-paper-line pt-4 text-paper-muted md:mb-20">
          <span>About</span>
          <span>{site.location}</span>
        </div>

        {/*
          md: portrait beside the statement, principles full-width below.
          lg: portrait spans both rows; statement and principles share the right column.
        */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
          {/* Portrait slot: layered editorial composition, offset label over the frame. */}
          <Reveal className="relative max-w-[22rem] md:col-span-5 md:max-w-none lg:col-span-4 lg:row-span-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-frame border border-paper-line bg-paper">
              {site.portrait ? (
                /* Zoomed 1.3x and lifted so the frame shows head to chest (about 10%–68% of the cutout's height).
                   That also keeps the background-removal leftover at the source's lower-left edge out of view. */
                <picture>
                  <source srcSet={site.portrait.src} type="image/webp" />
                  <img
                    src={site.portrait.fallback}
                    alt={site.portrait.alt}
                    width={site.portrait.width}
                    height={site.portrait.height}
                    loading="lazy"
                    decoding="async"
                    className="absolute top-[-18%] left-1/2 h-auto w-[130%] max-w-none -translate-x-1/2"
                  />
                </picture>
              ) : (
                <>
                  <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full text-paper-fg/15" fill="none" stroke="currentColor" aria-hidden="true">
                    <circle cx="150" cy="150" r="58" />
                    <path d="M50 400c0-70 45-120 100-120s100 50 100 120" />
                  </svg>
                  <span className="meta absolute bottom-4 left-4 text-paper-muted">Portrait pending</span>
                </>
              )}
            </div>
          </Reveal>

          <div className="md:col-span-7 md:self-end lg:col-start-6 lg:self-start">
            <h2 id="about-title" className="sr-only">
              About
            </h2>
            {visibleAboutStatement && (
              <Reveal>
                <p className="text-statement">{visibleAboutStatement}</p>
              </Reveal>
            )}
          </div>

          {visiblePrinciples.length > 0 && (
            <ol className="border-b border-paper-line md:col-span-12 lg:col-span-7 lg:col-start-6">
              {visiblePrinciples.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.id}
                  index={i}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-t border-paper-line py-6 sm:grid-cols-[3rem_12rem_1fr] sm:gap-6"
                >
                  <span className="meta pt-1 text-paper-muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="col-start-2 text-paper-muted sm:col-start-auto">{p.body}</p>
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
