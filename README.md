# Portfolio

Personal portfolio for a Software Engineer, Product Builder and AI Engineer. It is a single page built with Vite, React, TypeScript and Tailwind CSS, and the HTML is prerendered at build time.

> **Status:** the structure, design system and interactions are complete. Personal content is still bracketed placeholders (e.g. `[Your Name]`) in `src/data/`.

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot reload. It renders on the client only, so don't use it to measure performance. |
| `npm run build` | Type-checks, builds the client bundle, builds an SSR bundle, then prerenders the page into `dist/index.html`. |
| `npm run preview` | Serves `dist/` at http://localhost:4173. Use this for Lighthouse and other performance checks. |
| `npm run lint` | Runs ESLint with typescript-eslint and the React Hooks rules. |
| `npm run typecheck` | Runs the TypeScript project build only. |

## Editing content

All copy and project data live in typed files under `src/data/`. Section components render from these files, so editing content never requires touching JSX.

Anything not yet supplied is a bracketed placeholder such as `[Project title]`. The dev server shows placeholders so the gaps stay visible. Production builds leave out any item that still has one, and a section with nothing left disappears together with its nav link. `npm run build` ends with a list of what was left out. To publish an item, replace its placeholders with real content; nothing else needs changing.

| File | Contents |
|---|---|
| `site.ts` | Name, roles, positioning line, location, availability, email, LinkedIn, GitHub, nav items |
| `projects.ts` | Selected work: problem, what was built, decisions, stack, status, links |
| `expertise.ts` | Engineering areas, each with one "solved X using Y because Z" statement |
| `experience.ts` | Roles: company, title, period, contributions |
| `about.ts` | About statement, principles, and "Currently building" items |
| `types.ts` | Shared types and the `Status` labels (shipped, in progress, experimental, planned) |

Also update the `<title>` and meta tags in `index.html`, and add a canonical URL and `og:image` once the domain is known.

## Project structure

```
src/
├── App.tsx              # Composes sections in narrative order
├── main.tsx             # Hydrates prerendered HTML (client-renders in dev)
├── entry-server.tsx     # Build-time render used by scripts/prerender.js
├── NotFound.tsx         # 404 page, prerendered into dist/404.html (entry: not-found.ts)
├── sections/            # One component per page section
├── components/          # Section-specific parts, plus ui/ primitives
├── hooks/               # Motion, viewport and pointer behavior
├── lib/media.ts         # Media queries shared with JS
├── data/                # All content (see above)
└── styles/index.css     # Design tokens and global component classes
scripts/prerender.js     # Injects the rendered app into dist/index.html
```

## Design system

`src/styles/index.css` holds all design tokens.

- **Theme tokens:** a Tailwind v4 `@theme` block defines colors (ink, paper and one accent), the type scale (`text-display`, `text-headline`, `text-title`, …), the corner radius and easing curves. Tailwind generates utilities from these.
- **Layout variables:** `:root` holds the gutter, section spacing, nav height and z-index layers, used as `pt-(--section-y)` or `z-(--z-drawer)`.
- **Surfaces:** each section sets `data-surface="ink"` (dark) or `data-surface="paper"` (cream). The fixed navbar reads this attribute to switch its tone.

The page uses system fonts (Helvetica Neue, falling back to Arial) and has no external assets: all visuals are CSS and inline SVG.

## Accessibility and performance

- Uses semantic landmarks, a skip link, visible focus states and full keyboard operation.
- The mobile menu traps focus, closes on Escape and returns focus to the menu button.
- Every hover interaction also works on focus and tap.
- With `prefers-reduced-motion`, decorative motion stops and all content shows immediately.
- Decorative animation pauses while offscreen. Cursor effects write CSS variables in `requestAnimationFrame` instead of updating React state.
- A print stylesheet shows all content and hides decorative layers.
- On a local `npm run preview` build, Lighthouse scored 100 in all four categories on both mobile and desktop, and axe reported 0 violations. Re-measure on the deployed URL.

## Deployment

`npm run build` outputs a static site to `dist/`, which any static host can serve. `dist/404.html` is the not-found page; GitHub Pages, Netlify, Vercel and Cloudflare Pages serve it automatically for missing paths when the site is hosted at the domain root. Configure security headers, caching and HTTPS on the host.

Browser support follows Tailwind CSS v4: Safari 16.4+, Chrome 111+ and Firefox 128+.
