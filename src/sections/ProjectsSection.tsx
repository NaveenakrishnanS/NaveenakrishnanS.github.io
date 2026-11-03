import { visibleProjects } from '../lib/content'
import { ProjectIndex } from '../components/projects/ProjectIndex'
import { SectionHeader } from '../components/ui/SectionHeader'

/** Left out entirely until at least one project is complete; the nav and hero adapt (lib/content.ts). */
export function ProjectsSection() {
  if (visibleProjects.length === 0) return null

  return (
    <section id="work" data-surface="paper" aria-labelledby="work-title" className="section-y">
      <div className="shell">
        <SectionHeader
          label="Selected work"
          id="work-title"
          title="The work, and the decisions behind it."
          aside={
            <span>
              {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}
            </span>
          }
        />
        <ProjectIndex projects={visibleProjects} />
      </div>
    </section>
  )
}
