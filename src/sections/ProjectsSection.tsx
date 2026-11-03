import { projects } from '../data/projects'
import { site } from '../data/site'
import { publishable } from '../lib/content'
import { ProjectStack } from '../components/projects/ProjectStack'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'
import { ArrowUpRight } from '../components/ui/icons'

// Only projects with a real title and summary are shown in production (see lib/content.ts).
const shown = publishable(projects, (p) => [p.title, p.summary])

export function ProjectsSection() {
  return (
    <section
      id="work"
      data-surface="ink"
      aria-labelledby="work-title"
      className="section-y bg-ink pb-[calc(var(--section-y)+var(--sheet-pull))]"
    >
      <div className="shell">
        <MegaHeading id="work-title" className="mb-14 sm:mb-20 md:mb-24">
          Work
        </MegaHeading>

        {shown.length > 0 ? (
          <ProjectStack projects={shown} />
        ) : (
          // Honest empty state until case studies are written: point to the code itself.
          <Reveal className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
            <p className="text-statement text-pretty">Case studies are being written up.</p>
            <p className="text-lede text-ink-muted text-pretty">
              In the meantime, my code and experiments are on GitHub.
            </p>
            {site.github && (
              <a href={site.github} target="_blank" rel="noreferrer" className="pill pill-ghost">
                GitHub <ArrowUpRight />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
