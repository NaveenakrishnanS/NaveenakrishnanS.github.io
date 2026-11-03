import { aboutStatement, building, principles } from '../data/about'
import { experience } from '../data/experience'
import { expertise } from '../data/expertise'
import { projects } from '../data/projects'
import { nav } from '../data/site'
import type { SectionId } from '../data/types'

/**
 * Content gate. Bracketed values such as `[Project title]` mark content that has not been supplied.
 * The dev server shows them so gaps stay visible while editing; production builds leave out anything
 * unfinished, so visitors never see a placeholder. scripts/prerender.js lists what was left out.
 */
export const showPlaceholders = import.meta.env.DEV

const PLACEHOLDER = /\[[^\]]*\]/

/** The value, or undefined when it is missing or (in production) still a placeholder. */
const filled = (value: string | undefined) =>
  value && (showPlaceholders || !PLACEHOLDER.test(value)) ? value : undefined
const filledList = (values: readonly string[] | undefined) => (values ?? []).filter((value) => filled(value))

const omitted: string[] = []
const keep = (label: string, complete: boolean) => {
  if (!complete) omitted.push(label)
  return complete
}

export const visibleProjects = projects
  .filter((p) => keep(`project ${p.title}`, [p.title, p.summary, p.problem, p.built, p.role].every(filled)))
  .map((p) => ({
    ...p,
    category: filled(p.category) ?? '',
    year: filled(p.year) ?? '',
    decisions: filledList(p.decisions),
    stack: filledList(p.stack),
  }))

export const visibleExpertise = expertise
  .filter((e) => keep(`expertise ${e.area}`, Boolean(filled(e.evidence))))
  .map((e) => ({ ...e, because: filled(e.because), tools: filledList(e.tools) }))

export const visibleExperience = experience
  .filter((r) => keep(`role at ${r.company}`, Boolean(filled(r.company) && filled(r.role))))
  .map((r) => ({
    ...r,
    start: filled(r.start),
    location: filled(r.location),
    contributions: filledList(r.contributions),
    stack: filledList(r.stack),
  }))

export const visiblePrinciples = principles.filter((p) =>
  keep(`principle ${p.title}`, Boolean(filled(p.title) && filled(p.body))),
)

export const visibleBuilding = building
  .filter((b) => keep(`building item ${b.title}`, Boolean(filled(b.title))))
  .map((b) => ({ ...b, note: filled(b.note) ?? '' }))

export const visibleAboutStatement = filled(aboutStatement)
keep('about statement', Boolean(visibleAboutStatement))

/** Labels of content left out of this build because it still has placeholders. */
export const omittedContent: readonly string[] = omitted

const sectionVisible: Record<SectionId, boolean> = {
  top: true,
  work: visibleProjects.length > 0,
  expertise: visibleExpertise.length > 0,
  experience: visibleExperience.length > 0,
  about: true,
  building: visibleBuilding.length > 0,
  contact: true,
}
const sectionOrder: SectionId[] = ['top', 'work', 'expertise', 'experience', 'about', 'building', 'contact']
const visibleSections = sectionOrder.filter((id) => sectionVisible[id])

/**
 * Every section this build actually renders, in page order, including the hero and the ones the nav
 * leaves out. The scroll observer watches all of them, so no unwatched section can leave the nav
 * marking a stale item.
 */
export const visibleSectionIds: readonly SectionId[] = visibleSections

export const visibleNav = nav.filter((item) => sectionVisible[item.id])

/** First section after the hero; the skip link's target. */
export const firstContentId: SectionId = visibleSections[1] ?? 'contact'

type LeadCandidate = { id: SectionId; label: string }

/**
 * Candidates for the hero's leading action, strongest proof first. Contact is last and always
 * renders, so the button can never point at a section this build left out.
 */
const leadFallback: LeadCandidate = { id: 'contact', label: 'Get in touch' }
const leadCandidates: readonly LeadCandidate[] = [
  { id: 'work', label: 'View selected work' },
  { id: 'expertise', label: 'See what I solve' },
  leadFallback,
]

/** The hero's leading action points at the strongest section that actually renders. */
const lead = leadCandidates.find((candidate) => sectionVisible[candidate.id]) ?? leadFallback
export const leadAction = { href: `#${lead.id}`, label: lead.label }
