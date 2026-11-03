import { expertise } from '../data/expertise'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'

/** Jack "Services" logic: the page's one light sheet, a numbered list of evidence. */
export function ExpertiseSection() {
  return (
    <section
      id="expertise"
      data-surface="paper"
      aria-labelledby="expertise-title"
      className="sheet section-y bg-paper pb-[calc(var(--section-y)+var(--sheet-pull))] text-paper-fg"
    >
      <div className="shell">
        <MegaHeading id="expertise-title" tone="paper" className="mb-16 sm:mb-20 md:mb-28">
          Expertise
        </MegaHeading>

        <ol className="mx-auto max-w-5xl">
          {expertise.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 100}
              className="relative grid grid-cols-[auto_1fr] items-start gap-x-6 py-8 sm:gap-x-10 sm:py-10 md:gap-x-14 md:py-12"
            >
              {/* Divider between rows, drawn left to right as the row enters. */}
              {i > 0 && <span aria-hidden="true" className="rule-draw absolute inset-x-0 top-0 h-px bg-paper-line" />}
              {/* tabular-nums: the auto first column is sized by the glyphs, so proportional digits
                  would start every row's text at a different x. */}
              <span aria-hidden="true" className="num-slide text-number font-black tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1 md:pt-3">
                <h3 className="text-title font-medium uppercase">{item.area}</h3>
                <p className="mt-3 max-w-2xl text-lede font-light text-paper-muted">{item.evidence}</p>
                <p className="mt-4 font-mono text-sm text-paper-muted">
                  <span className="sr-only">Tools: </span>
                  {item.tools.join(', ')}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
