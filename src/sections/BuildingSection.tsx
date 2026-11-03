import { building } from '../data/about'
import { publishableSection } from '../lib/content'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'
import { StatusTag } from '../components/ui/StatusTag'

// Only real items ship, and the section needs at least two of them to be worth a mega heading
// (see lib/content.ts). Below that the array is empty and the section returns null.
const shown = publishableSection(building, (b) => [b.title, b.note])

/** Present momentum. Exactly one tile per item (no empty grid cells); status is always explicit. */
export function BuildingSection() {
  if (shown.length === 0) return null
  // One item: a single centred tile. Otherwise a 2-column grid; an odd last tile spans both columns.
  const single = shown.length === 1

  return (
    <section
      id="building"
      data-surface="ink"
      aria-labelledby="building-title"
      className="section-y bg-ink pb-[calc(var(--section-y)+var(--sheet-pull))]"
    >
      <div className="shell">
        <MegaHeading id="building-title" className="mb-14 sm:mb-20 md:mb-24">
          Now building
        </MegaHeading>

        <ul className={`mx-auto grid gap-4 ${single ? 'max-w-2xl' : 'max-w-5xl sm:grid-cols-2'}`}>
          {shown.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 100}
              className={`spotlight flex flex-col rounded-card border-2 border-card-line-2 p-6 md:p-8 ${
                !single && shown.length % 2 === 1 && i === shown.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-sm text-ink-muted">
                <span>{item.kind}</span>
                <StatusTag status={item.status} />
              </div>
              <h3 className="mt-10 text-title font-medium uppercase md:mt-14">{item.title}</h3>
              <p className="mt-3 text-ink-muted">{item.note}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
