export type Status = 'shipped' | 'in-progress' | 'experimental' | 'planned'

export const statusLabel: Record<Status, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  experimental: 'Experimental',
  planned: 'Planned',
}

export type SectionId = 'top' | 'work' | 'expertise' | 'experience' | 'about' | 'building' | 'contact'

export type NavItem = { id: SectionId; label: string }

export type SocialLink = { label: string; href: string; external: boolean }

export type Site = {
  name: string
  roles: readonly string[]
  /** Hero subtext. Max 20 words. */
  positioning: string
  location: string
  availability: string
  email: string
  linkedin: string
  github?: string
  /**
   * Optional hero photography (Marcus / Bennet layering). Paths under /public.
   * background: full-bleed photo behind the name marquee.
   * portrait: transparent cutout placed in front of the marquee.
   * Leave undefined until real assets exist; the hero renders without them.
   */
  heroImages?: { background?: string; portrait?: { src: string; width: number; height: number } }
}

export type ProjectLinks = { live?: string; github?: string; caseStudy?: string }

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
  /** Real screenshots under /public, with alt text. First is the large frame. */
  images?: { src: string; alt: string }[]
}

export type ExpertiseArea = {
  id: string
  area: string
  /** "I solved X using Y because Z": evidence, not adjectives. */
  evidence: string
  tools: string[]
}

export type Role = {
  id: string
  company: string
  role: string
  period: string
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
