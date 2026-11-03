import type { NavItem, Site } from './types'

// Bracketed values are placeholders — replace with real details. Do not invent them.
export const site: Site = {
  name: 'Naveenakrishnan S',
  shortName: 'NS',
  roles: ['Software Engineer', 'Product Builder', 'AI Engineer'],
  // Draft derived only from the stated positioning; rewrite in your own words.
  positioning:
    'I build software end to end, from system architecture to the interface, with AI where it earns its place.',
  location: 'Chennai, India',
  availability: 'Open to backend and full-stack roles',
  email: 'snaveenakrishnan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/naveenakrishnan-s/',
  github: 'https://github.com/NaveenakrishnanS',
  portrait: {
    src: '/images/portrait-cutout.webp',
    fallback: '/images/portrait-cutout.png',
    width: 768,
    height: 1364,
    alt: 'Portrait of Naveenakrishnan S in a dark shirt and sunglasses',
  },
}

// Page order, so the nav reads the same way the page scrolls. Items whose section is left out of a
// build are dropped by visibleNav (src/lib/content.ts).
export const nav: NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]
