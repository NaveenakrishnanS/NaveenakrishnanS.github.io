import type { NavItem, Site, SocialLink } from './types'

// Bracketed values are placeholders. Replace with real details; never invent them.
export const site: Site = {
  // Display name as set by the user (2026-10-02).
  name: 'Naveenakrishnan S',
  roles: ['Software Engineer', 'Product Builder', 'AI Engineer'],
  // From the user's LinkedIn profile (2026-10-02): backend focus, cross-platform apps, exploring AI.
  positioning: "I build secure, scalable backend systems and cross-platform apps, and I'm exploring where AI fits in real products.",
  location: 'Chennai, India',
  // LinkedIn: "Actively seeking backend or full-stack opportunities".
  availability: 'Open to backend and full-stack roles',
  email: 'snaveenakrishnan@gmail.com',
  linkedin: 'https://www.linkedin.com/in/naveenakrishnan-s/',
  github: 'https://github.com/NaveenakrishnanS',
  // Head-to-chest bust cut from public/photo1.png (background removed locally, cinematic grade,
  // rim light). Full-length master: public/images/portrait-full.png.
  heroImages: { portrait: { src: '/images/portrait-cutout.webp', width: 768, height: 780 } },
}

export const nav: NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const social: SocialLink[] = [
  { label: 'LinkedIn', href: site.linkedin, external: true },
  ...(site.github ? [{ label: 'GitHub', href: site.github, external: true }] : []),
  { label: 'Email', href: `mailto:${site.email}`, external: false },
]
