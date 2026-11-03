import { visibleExperience } from '../lib/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'

const period = (start: string | undefined, end: string) =>
  start ? `${start} - ${end}` : end === 'Present' ? 'Current role' : end

/** Scannable as company → role → period → contribution; not a résumé timeline. */
export function ExperienceSection() {
  if (visibleExperience.length === 0) return null

  return (
    <section id="experience" data-surface="paper" aria-labelledby="experience-title" className="section-y">
      <div className="shell">
        <SectionHeader id="experience-title" title="Where I have done the work." />

        <ol className="border-b border-paper-line">
          {visibleExperience.map((job, i) => (
            <Reveal
              as="li"
              key={job.id}
              index={i}
              className="grid gap-4 border-t border-paper-line py-8 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-4">
                <h3 className="text-title font-medium">{job.company}</h3>
                <p className="mt-1 text-paper-muted">{job.role}</p>
              </div>
              <p className="meta text-paper-muted md:col-span-2 md:pt-2">
                <span className="block">{period(job.start, job.end)}</span>
                {job.location && <span className="block">{job.location}</span>}
              </p>
              <div className="md:col-span-6">
                <ul className="space-y-3 text-lede">
                  {job.contributions.map((c, j) => (
                    <li key={j}>{c}</li>
                  ))}
                </ul>
                {job.stack.length > 0 && (
                  <ul
                    aria-label="Stack"
                    className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-mono text-paper-muted"
                  >
                    {job.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
