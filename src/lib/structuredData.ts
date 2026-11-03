import { site } from '../data/site'
import { visibleExperience, visibleExpertise } from './content'

/** schema.org Person for search engines, built from the same data the page renders. */
export function personJsonLd(): string {
  const current = visibleExperience.find((role) => role.end === 'Present')
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: current?.role ?? site.roles[0],
    ...(current && { worksFor: { '@type': 'Organization', name: current.company } }),
    homeLocation: { '@type': 'Place', name: site.location },
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin, site.github].filter(Boolean),
    knowsAbout: [...new Set(visibleExpertise.flatMap((area) => area.tools))],
  }
  // `<` is escaped so the JSON can never close the surrounding script tag.
  return JSON.stringify(person).replace(/</g, '\\u003c')
}
