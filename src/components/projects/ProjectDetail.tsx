import type { ReactNode } from 'react'
import type { Project } from '../../data/types'
import { showPlaceholders } from '../../lib/content'
import { StatusTag } from '../ui/StatusTag'
import { ArrowUpRight } from '../ui/icons'

const linkLabels = { live: 'Live', github: 'Source', caseStudy: 'Case study' } as const

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-paper-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="meta pt-1 text-paper-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function ProjectDetail({ project }: { project: Project }) {
  const links = Object.entries(project.links ?? {}).filter((entry): entry is [keyof typeof linkLabels, string] => Boolean(entry[1]))

  return (
    <div>
      <p className="text-lede">{project.summary}</p>
      <div className="mt-4 mb-6 flex flex-wrap gap-x-6 gap-y-2 text-paper-muted">
        <StatusTag status={project.status} />
        {project.category && <span className="meta">{project.category}</span>}
      </div>

      <dl>
        <DetailRow label="Problem">{project.problem}</DetailRow>
        <DetailRow label="What I built">{project.built}</DetailRow>
        <DetailRow label="Role">{project.role}</DetailRow>
        {project.decisions.length > 0 && (
          <DetailRow label="Decisions">
            <ul className="space-y-2">
              {project.decisions.map((d, i) => (
                <li key={i} className="flex gap-3">
                  <span className="meta pt-1 text-paper-muted" aria-hidden="true">
                    {String.fromCharCode(97 + i)}.
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </DetailRow>
        )}
        {project.stack.length > 0 && (
          <DetailRow label="Stack">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-mono">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </DetailRow>
        )}
        {links.length > 0 ? (
          <DetailRow label="Links">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(([key, href]) => (
                <li key={key}>
                  <a href={href} target="_blank" rel="noreferrer" className="link-draw inline-flex items-center gap-1.5">
                    {linkLabels[key]} <ArrowUpRight />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </DetailRow>
        ) : (
          showPlaceholders && (
            <DetailRow label="Links">
              <p className="text-paper-muted">[Add live / source / case-study links]</p>
            </DetailRow>
          )
        )}
      </dl>
    </div>
  )
}
