import { experience } from '../data/experience'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'

/** Dark sheet pulled over Expertise. Scannable as company, role, period, contribution. */
export function ExperienceSection() {
  return (
    <section id="experience" data-surface="ink" aria-labelledby="experience-title" className="sheet section-y bg-ink">
      <div className="shell">
        <MegaHeading id="experience-title" className="mb-14 sm:mb-20 md:mb-24">
          Experience
        </MegaHeading>

        <ol className="mx-auto max-w-5xl">
          {experience.map((job, i) => (
            <Reveal
              as="li"
              key={job.id}
              delay={i * 100}
              className="relative grid gap-5 py-8 md:grid-cols-[2fr_3fr] md:gap-12 md:py-12"
            >
              {/* Rule above each role, drawn left to right as it enters. */}
              <span aria-hidden="true" className="rule-draw absolute inset-x-0 top-0 h-px bg-ink-line" />
              <div>
                <h3 className="text-title font-medium uppercase">{job.company}</h3>
                {/* The role carries the same size as the contributions and more weight, so the
                    company, role, period scan is not outranked by the evidence beside it. */}
                <p className="mt-2 text-lede font-medium">{job.role}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  <time>{job.period}</time>
                  {job.location && <span>, {job.location}</span>}
                </p>
              </div>
              <div>
                <ul className="space-y-3 text-lede font-light">
                  {job.contributions.map((c, j) => (
                    <li key={j}>{c}</li>
                  ))}
                </ul>
                {job.stack && (
                  <p className="mt-5 font-mono text-sm text-ink-muted">
                    <span className="sr-only">Stack: </span>
                    {job.stack.join(', ')}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
