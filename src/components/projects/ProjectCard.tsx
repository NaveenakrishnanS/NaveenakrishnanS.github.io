import type { ReactNode } from 'react'
import type { Project } from '../../data/types'
import { StatusTag } from '../ui/StatusTag'
import { ArrowUpRight } from '../ui/icons'
import { MediaFrame } from './MediaFrame'

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink-line pt-3">
      <dt className="meta text-ink-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}

/** One stacked project card (Jack): number, meta and actions on top; evidence and media below. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')
  const { live, github, caseStudy } = project.links ?? {}

  return (
    <article
      aria-labelledby={`project-${project.id}`}
      // spotlight: cursor-lit edge ring + surface light (fine pointers only).
      className="spotlight rounded-card border-2 border-card-line bg-ink p-5 sm:p-7 md:p-9"
    >
      <header className="grid items-end gap-x-6 gap-y-4 sm:grid-cols-[auto_1fr_auto]">
        {/* tabular-nums keeps every card's text column at the same x (see ExpertiseSection). */}
        <span aria-hidden="true" className="text-number font-black tabular-nums">
          {number}
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <span>{project.category}</span>
            <span>{project.year}</span>
            <StatusTag status={project.status} />
          </p>
          <h3 id={`project-${project.id}`} className="mt-2 text-title font-medium uppercase">
            {project.title}
          </h3>
        </div>
        {live && (
          <a href={live} target="_blank" rel="noreferrer" className="pill pill-ghost justify-self-start sm:justify-self-end">
            Live project <ArrowUpRight />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_3fr] md:gap-10">
        <div>
          <p className="text-lede">{project.summary}</p>
          <dl className="mt-6 grid gap-4 text-sm">
            <Detail label="Problem">{project.problem}</Detail>
            <Detail label="What I built">{project.built}</Detail>
            <Detail label="Role">{project.role}</Detail>
            <Detail label="Decisions">
              <ul className="space-y-1.5">
                {project.decisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Detail>
            <Detail label="Stack">
              <span className="font-mono">{project.stack.join(', ')}</span>
            </Detail>
          </dl>
          {(github || caseStudy) && (
            <p className="mt-5 flex gap-6 text-sm">
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="link-fade inline-flex items-center gap-1.5">
                  Source <ArrowUpRight />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {caseStudy && (
                <a href={caseStudy} className="link-fade inline-flex items-center gap-1.5">
                  Case study <ArrowUpRight />
                </a>
              )}
            </p>
          )}
        </div>
        <MediaFrame project={project} />
      </div>
    </article>
  )
}
