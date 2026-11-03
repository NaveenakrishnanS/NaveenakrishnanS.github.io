import { statusLabel, type Status } from '../data/types'
import { visibleBuilding } from '../lib/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { StatusTag } from '../components/ui/StatusTag'

const statusOrder: Status[] = ['shipped', 'in-progress', 'experimental', 'planned']

/* The grid is sized to the items that survive the content gate, so a build with one complete item
   gets one full-width row rather than a card stranded in column 4 of 4. Written as whole class
   strings because the Tailwind scanner reads source text, not constructed names. */
const columnClass = [
  '',
  '',
  'sm:grid-cols-2',
  'sm:grid-cols-2 lg:grid-cols-3',
  'sm:grid-cols-2 lg:grid-cols-4',
] as const

export function BuildingSection() {
  if (visibleBuilding.length === 0) return null
  // The legend explains only the statuses actually on show.
  const legend = statusOrder.filter((s) => visibleBuilding.some((item) => item.status === s))
  const columns = columnClass[Math.min(visibleBuilding.length, 4)]

  // A legend of one explains nothing: the StatusTag on that single card already names the status.
  const legendList =
    legend.length > 1 ? (
      <ul className="hidden gap-5 md:flex" aria-label="Status legend">
        {legend.map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span className="status-dot" data-status={s} aria-hidden="true" />
            {statusLabel[s]}
          </li>
        ))}
      </ul>
    ) : undefined

  return (
    <section id="building" data-surface="paper" aria-labelledby="building-title" className="section-y">
      <div className="shell">
        <SectionHeader
          label="Currently building"
          id="building-title"
          title="What I’m working on now."
          aside={legendList}
        />

        <ul className={`grid gap-x-8 gap-y-12 ${columns}`}>
          {visibleBuilding.map((item, i) => (
            <Reveal as="li" key={item.id} index={i} className="border-t border-paper-fg pt-5">
              <div className="flex items-center justify-between text-paper-muted">
                <span className="meta">{item.kind}</span>
                <StatusTag status={item.status} />
              </div>
              <h3 className="mt-8 text-title font-medium">{item.title}</h3>
              {item.note && <p className="mt-3 text-paper-muted">{item.note}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
