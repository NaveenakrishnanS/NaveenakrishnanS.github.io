import { useState } from 'react'
import type { Project } from '../../data/types'
import { Reveal } from '../ui/Reveal'
import { Plus } from '../ui/icons'
import { ProjectDetail } from './ProjectDetail'
import { ProjectPlate } from './ProjectPlate'
import { LARGE_SCREEN } from '../../lib/media'

/**
 * Editorial project index. One project is always selected.
 * ≥lg: list on the left, sticky detail panel on the right.
 * <lg: rows expand inline (accordion), so nothing depends on hover.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? '')
  const activeIndex = Math.max(0, projects.findIndex((p) => p.id === activeId))
  const active = projects[activeIndex]

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ol className="border-b border-paper-line lg:col-span-7">
        {projects.map((project, i) => {
          const isActive = project.id === activeId
          return (
            <Reveal as="li" key={project.id} index={i} className="border-t border-paper-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`project-${project.id}`}
                  onClick={() => {
                    // The desktop panel always shows a project; only the mobile accordion collapses.
                    const collapsible = !window.matchMedia(LARGE_SCREEN).matches
                    setActiveId(isActive && collapsible ? '' : project.id)
                  }}
                  className={`group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 text-left transition-colors duration-300 md:grid-cols-[3.5rem_1fr_auto_auto] md:py-8 ${
                    isActive ? 'text-paper-fg' : 'text-paper-fg/60 hover:text-paper-fg'
                  }`}
                >
                  <span className="meta text-paper-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-title font-medium transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    {project.title}
                  </span>
                  <span className="meta hidden text-paper-muted md:inline">{project.year}</span>
                  <Plus
                    className={`self-center transition-transform duration-500 ease-out-expo ${isActive ? 'rotate-45' : ''}`}
                  />
                </button>
              </h3>

              {/* Inline detail for small screens */}
              <div id={`project-${project.id}`} hidden={!isActive} className="pb-10 lg:hidden">
                <div className="mb-6">
                  <ProjectPlate index={i} />
                </div>
                <ProjectDetail project={project} />
              </div>
            </Reveal>
          )
        })}
      </ol>

      {/* Sticky detail panel for large screens */}
      <aside aria-label="Selected project" className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--nav-h)+2rem)]">
          {active && activeId ? (
            <div key={active.id} className="fade-in">
              <ProjectPlate index={activeIndex} />
              <div className="mt-8">
                <ProjectDetail project={active} />
              </div>
            </div>
          ) : (
            <p className="meta text-paper-muted">Select a project to see details.</p>
          )}
        </div>
      </aside>
    </div>
  )
}
