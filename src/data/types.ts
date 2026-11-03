export type Status = 'shipped' | 'in-progress' | 'experimental' | 'planned'

export const statusLabel: Record<Status, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  experimental: 'Experimental',
  planned: 'Planned',
}

export type NavItem = { id: SectionId; label: string }

export type SectionId = 'top' | 'work' | 'expertise' | 'experience' | 'about' | 'building' | 'contact'

export type Site = {
  name: string
  shortName: string
  roles: readonly string[]
  positioning: string
  location: string
  availability: string
  email: string
  linkedin: string
  github?: string
  /** Transparent cutout; `src` is WebP, `fallback` the same image as PNG. Paths are under public/. */
  portrait?: { src: string; fallback: string; width: number; height: number; alt: string }
}

type ProjectLinks = { live?: string; github?: string; caseStudy?: string }

export type Project = {
  id: string
  title: string
  summary: string
  category: string
  year: string
  status: Status
  role: string
  problem: string
  built: string
  decisions: string[]
  stack: string[]
  links?: ProjectLinks
}

export type ExpertiseArea = {
  id: string
  area: string
  /** The "solved X using Y" part, as a plain statement of what was done. No trailing period. */
  evidence: string
  /** The "because Z" part: why that approach. Rendered as ", because …" when present. */
  because?: string
  tools: string[]
}

export type Role = {
  id: string
  company: string
  role: string
  /** e.g. 'Jan 2023'. Without it the period reads "Current role" (or just `end`). */
  start?: string
  /** 'Present' or an end month such as 'Mar 2024'. */
  end: string
  location?: string
  contributions: string[]
  stack?: string[]
}

export type BuildItem = {
  id: string
  title: string
  kind: 'Project' | 'Experiment' | 'Concept' | 'Exploration' | 'Research'
  status: Status
  note: string
}

export type Principle = { id: string; title: string; body: string }
