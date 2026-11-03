# Naveenakrishnan S · Portfolio

Personal portfolio of Naveenakrishnan S, software engineer in Chennai. It is a single page built with Vite, React, TypeScript and Tailwind CSS v4, prerendered to static HTML at build time, with no third-party scripts, trackers or external requests.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with hot reload. Client-rendered only and shows draft content, so don't use it to judge performance or the final page. |
| `npm run build` | Type-checks, builds the client bundle and an SSR bundle, then prerenders the page into `dist/index.html`. |
| `SITE_URL=https://your.domain npm run build` | Same, plus a canonical URL, `og:url`, an absolute share-image URL, `sitemap.xml` and a sitemap line in `robots.txt`. **Use this for the real deploy.** |
| `npm run preview` | Serves `dist/` at http://localhost:4173. Use this for Lighthouse and final checks. |
| `npm run lint` | ESLint (typescript-eslint and the React Hooks rules). |
| `npm run typecheck` | TypeScript project build only. |

CI (`.github/workflows/ci.yml`) runs lint and build on every push to `main` and on pull requests.

## Editing content

All copy lives in typed files under `src/data/`, so editing content never requires touching JSX.

| File | Contents |
|---|---|
| `site.ts` | Name, roles, positioning line, location, availability, email, LinkedIn, GitHub, hero images, nav |
| `projects.ts` | Selected work: problem, what was built, decisions, stack, status, links, screenshots |
| `expertise.ts` | Engineering areas, each with an evidence statement |
| `experience.ts` | Roles: company, title, period, contributions |
| `about.ts` | About statement, principles, "Now building" items |
| `types.ts` | Shared types and the status labels (shipped, in progress, experimental, planned) |

**Drafts never ship.** Any project or "Now building" item whose title or summary is still a bracketed placeholder such as `[Project One]` appears in `npm run dev` but is left out of production builds (`src/lib/content.ts`). With no real projects, the Work section shows an honest empty state linking to GitHub. Replace the brackets with real content and the entry appears automatically.

Page metadata (title, description, share-card text, structured data) is in `index.html`. Keep it factual and in sync with `src/data/site.ts`.

## Assets

| Path | Deployed | What it is |
|---|---|---|
| `public/images/portrait-cutout.webp` | yes | Hero portrait: head-to-chest cutout, graded, rim-lit |
| `public/og-image.jpg` | yes | 1200×630 link-preview card (LinkedIn, Slack, WhatsApp, X) |
| `public/favicon.svg`, `public/apple-touch-icon.png` | yes | Browser and iOS home-screen icons |
| `public/404.html` | yes | Branded not-found page (used by Netlify, Cloudflare Pages, GitHub Pages and others) |
| `public/_headers` | yes | Security and cache headers (Netlify / Cloudflare Pages format) |
| `design/source/` | **no** | Original photo and full-quality masters. Git-ignored on purpose, so the original photo is neither published nor committed; back it up yourself. |

Fonts are Geist and Geist Mono (SIL Open Font License), self-hosted through `@fontsource-variable` and bundled by Vite.

## Project structure

```
src/
├── App.tsx              # Composes sections in narrative order
├── main.tsx             # Hydrates prerendered HTML (client-renders in dev)
├── entry-server.tsx     # Build-time render used by scripts/prerender.js
├── sections/            # One component per page section
├── components/          # Section-specific parts, plus ui/ primitives
├── hooks/               # Viewport, pointer and motion behavior
├── lib/content.ts       # Draft filtering (placeholders never ship)
├── data/                # All content (see above)
└── styles/index.css     # Design tokens, component classes, motion
scripts/prerender.js     # Prerender + preloads + SITE_URL metadata/sitemap
docs/references/         # Design references (logic only, never copied)
```

## Design system

`src/styles/index.css` holds all design tokens: one dark theme (`ink`), cream (`paper`) as the single light tone, one accent, the type scale (`text-mega`, `text-number`, `text-title`, …), radii, easing curves, the layout variables and the z-index scale. Each section sets `data-surface="ink"` or `"paper"`, which the fixed bar reads to switch tone.

The hero follows `docs/references/marcus-bennet.md` and the other sections follow `docs/references/jack-sections.md`, using their design logic only.

## Motion

- **Hero:** entrance choreography (mask-rise name, curtain portrait, drawn rule), depth parallax with the cursor, and a scroll exit.
- **Sections:** chapter headings that rise as you scroll, drawn dividers, sticky stacking project cards, a character-by-character About statement, spotlight cards, a reading-progress hairline and breathing "in progress" dots.
- **Implementation:** native CSS scroll timelines and rAF-written CSS variables, with no animation library and no scroll listeners.
- **Reduced motion:** turns all of it off. Touch devices skip the pointer effects. Browsers without scroll-timeline support (Firefox for now) get the finished static state.

## Quality

- **Accessibility:** semantic landmarks, skip link, visible focus, full keyboard use. The mobile menu traps focus, closes on Escape and restores focus. Hover effects also work on focus and tap.
- **Rendering:** the page renders without JavaScript (prerendered), and a print stylesheet shows all content.
- **Measured** on a local `npm run preview` build: Lighthouse desktop 100/100/100/100, mobile performance 97–99 (the hero entrance animation is deliberate), with 100 for accessibility, best practices and SEO. axe reports 0 violations. Re-measure on the live URL.

## Deployment

`npm run build` outputs a static site to `dist/`, which any static host can serve.

1. Build with your real domain: `SITE_URL=https://your.domain npm run build`.
2. Deploy `dist/`. On Netlify or Cloudflare Pages, `_headers` applies the security policy (CSP, nosniff, referrer policy, HSTS) and long-term caching for `/assets/*`. On other hosts, translate those headers into the host's config.
3. Check the share card with LinkedIn's Post Inspector and the page with Lighthouse on the live URL.

Browser support follows Tailwind CSS v4: Safari 16.4+, Chrome 111+, Firefox 128+.

## Privacy

The site sets no cookies, runs no analytics and loads nothing from third parties, so no consent banner is needed. The only personal data on the page is what's shown deliberately: name, city, email, LinkedIn and GitHub.
