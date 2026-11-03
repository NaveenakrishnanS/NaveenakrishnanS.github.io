import { visibleExpertise } from '../lib/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'

export function ExpertiseSection() {
  if (visibleExpertise.length === 0) return null

  return (
    <section id="expertise" data-surface="paper" aria-labelledby="expertise-title" className="section-y">
      <div className="shell">
        <SectionHeader id="expertise-title" title="What I solve, and how." />

        <ul className="grid gap-px overflow-hidden rounded-frame border border-paper-line bg-paper-line md:grid-cols-2">
          {visibleExpertise.map((item, i) => (
            <Reveal as="li" key={item.id} index={i} className="flex flex-col bg-paper p-6 md:p-10">
              {/* The area is the card's heading, so heading navigation reaches the four areas:
                  h1 (hero) → h2 (#expertise-title) → h3 per area. .meta keeps it looking the same. */}
              {/* No ordinal here. It was decorative (aria-hidden) numbering on a four-tile grid:
                  the reader can already count four tiles, so the number only added template noise. */}
              <h3 className="meta text-paper-muted">{item.area}</h3>
              {/* text-lede, not text-title: a sentence of evidence is body copy, and text-title is
                  reserved for the headings in Experience, Building and Projects. */}
              <p className="mt-8 mb-8 max-w-[30ch] text-lede md:mt-12">
                {item.evidence}
                {item.because && `, because ${item.because}`}.
              </p>
              {/* A real list separated by space, not a string joined with middle dots. Long
                  dot-chains read as template filler, and the list is what this actually is. */}
              {item.tools.length > 0 && (
                <ul
                  aria-label="Tools"
                  className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-paper-line pt-4 font-mono text-mono text-paper-muted"
                >
                  {item.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
