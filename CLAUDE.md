# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard rules from the user

- **Keep everything local.** Never publish anything with the Artifact tool, and never upload content to external services.
- **No fabrication.** Never invent personal facts: employers, dates, clients, projects, metrics, certifications, awards, user counts or production experience. Where real content is missing, use a visible bracketed placeholder such as `[Project title]`, kept in `src/data/*`. Placeholders are visible on the dev server; production builds leave out anything still bracketed (see `src/lib/content.ts`), and `npm run build` lists what was left out.
- **No invented assets.** Don't use stock photos, remote video, external font files or made-up asset URLs. Use CSS, inline SVG and local files only. An asset supplied in a section prompt is authoritative; never substitute another.

## What this is

This is a personal portfolio for a **Software Engineer + Product Builder + AI Engineer**. It should feel like a premium digital product authored by an engineer with taste, not a template, a résumé or an "AI-themed" site. AI is presented as one engineering capability, with no neural-net glow, robots or purple gradients.

The narrative order is: attention → identity → credibility → engineering depth → product thinking → humanity → current momentum → connection.

It serves recruiters, freelance clients, engineering managers and founders through one experience, not separate tracks.

## Commands

This needs Node.js 20+ and Git. If either is missing from PATH, say so instead of assuming it is there.

```
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b, client build, SSR build, then scripts/prerender.js injects static HTML
npm run preview    # serve dist/
npm run lint       # ESLint (typescript-eslint + react-hooks), flat config in eslint.config.js
npm run typecheck  # tsc -b only
```

Run `lint` and `build` before committing. The default branch is `main`. Never push or add a remote unless the user asks.

`prompt.txt` is the user's original master prompt and the full source of truth. This file is a condensed operating version of it. `README.md` is the human-facing guide.

### Verification

There is no test suite. Verify changes in a real browser:

- **Measure performance on `npm run build && npm run preview` (port 4173), never on the dev server.** The dev server is unbundled, runs dev-mode React and has no prerendered HTML, so it scores about 40 on mobile Lighthouse. The production build scored 100/100/100/100 on mobile and desktop, with 0 axe violations. Treat any drop from that as a regression.
- **Tooling:** for screenshots, axe or Lighthouse, use headless Chrome or Edge through `puppeteer-core`, `axe-core` and `lighthouse`. Install them in a temporary directory outside the project; never add them to `package.json`.
- **Viewports:** capture at 1440×900, 820×1180 and 390×844 with touch emulation (`isMobile` + `hasTouch`, which makes `(hover: hover) and (pointer: fine)` false). Check for horizontal overflow.
- **Other checks:** hydration warnings in the console, the no-JS render (body text should be present), the drawer focus trap and Escape, and reduced motion.
- **Capture artifacts:** full-page captures show the fixed nav mid-page and can catch fades partway through. That comes from the capture method, not from the site. `html { scroll-behavior: smooth }` delays programmatic scrolling, so use `behavior: 'instant'` in scripts.

`src/styles/index.css` imports Tailwind with `source('..')` so that it scans only `src/`. Without that, the skill markdown in `.claude/skills` doubles the CSS size.

## Architecture

The stack is Vite, React 19, TypeScript and Tailwind CSS v4, through `@tailwindcss/vite` with no `tailwind.config`. There is no router: it is a single page with anchor-scrolled sections.

The page is prerendered at build time:
- `src/entry-server.tsx` renders `<App/>` to a string, and `scripts/prerender.js` writes it into `dist/index.html`. The SSR bundle goes to `dist-ssr/`, which the prerender script deletes afterwards.
- `src/main.tsx` hydrates when the root has content and does a client render otherwise (the dev server).
- Components must therefore render the same markup on the server and on first client render. Never read `window` during render: use effects, or `useSyncExternalStore` with a server snapshot.
- Check production builds for hydration warnings in the console.
- `404.html` is a second Vite input (see `vite.config.ts`). It is prerendered from `src/NotFound.tsx` with `renderToStaticMarkup` and is never hydrated. Its entry, `src/not-found.ts`, ships no React and only wires the back button. Its styles are the `nf-*` block in `index.css`, and links and assets are root-relative so the page works at nested missing URLs.

- `src/data/` holds all content as typed data, with types in `src/data/types.ts`. Sections render from this data, so change content here, not in JSX. Placeholders live here too. The "Currently building" items are the `building` export in `about.ts`; there is no separate file for them. `SectionId` in `types.ts` lists the anchor ids, so a new section must be added there.
- `src/lib/content.ts` is the content gate between data and sections. Sections import `visibleProjects`, `visibleExpertise` etc. from it, not from `src/data` directly. In production it drops items whose required fields are still `[bracketed]` and blanks optional ones; a section with nothing left returns `null`. `visibleNav`, `visibleSectionIds` (what the scroll observer watches), `firstContentId` (skip link) and `leadAction` (hero button) follow the sections that actually render, so hiding one never leaves a dead link. Sections are deliberately **not** numbered: a number derived from a build-dependent section list contradicted the mobile menu beside it, so the headline carries the hierarchy instead. A new section must be added to `sectionVisible` and `sectionOrder` there. `showPlaceholders` (dev only) gates any placeholder-only UI.
- `src/lib/structuredData.ts` builds the schema.org `Person` JSON-LD from the same data; `scripts/prerender.js` injects it into `<head>`. `__BUILD_YEAR__` (defined in `vite.config.ts`, typed in `src/vite-env.d.ts`) is the footer year, because reading the clock during render would differ between build and visit.
- `src/sections/` holds one component per page section, composed in `src/App.tsx` in narrative order: Hero, Work, Expertise, Experience, About, Building, Contact.
- `src/components/<area>/` holds section-specific parts. `src/components/ui/` holds shared primitives.
- `src/hooks/` holds behavior hooks: reduced motion, in-view (pauses decorative motion offscreen), active section, nav surface detection, scrolled state, typewriter and pointer field.
- `src/lib/media.ts` holds media queries shared with JS. `LARGE_SCREEN` must match `--breakpoint-lg` in the CSS.
- `src/styles/index.css` is the design-token source of truth:
  - The Tailwind `@theme` block holds colors, fonts, the type scale (`text-display`, `text-headline`, `text-title`, `text-lede`, `text-statement`, `text-contact`, `text-menu`, `text-numeral`, `text-meta`, `text-mono`, `text-ui`, `text-brand`), `rounded-frame` and easing. `text-meta` is the 12px uppercase mono label (`.meta`); `text-mono` is the 13px sentence-case mono line used for stack and tool lists. Don't reach for a raw `text-sm` for either.
  - **Stack and tool lists are lists, separated by space.** Render them as a `<ul>` with an `aria-label` and `flex flex-wrap gap-x-5`, never as a string joined with `' · '`. A seven-item middle-dot chain is template filler and reads as generated; the gap carries the separation and the markup then matches what the content actually is.
  - **No decorative ordinals on tiles.** The expertise grid used to stamp `01`–`04` in each card corner behind `aria-hidden`. A reader can count four tiles, so the number added nothing but the templated look. Ordinals stay only where they are semantic, as in the `<ol>` of principles and the project index.
  - **One accent, one meaning.** `--color-accent` means "current, active, focused" and nothing else: the `:focus-visible` ring, the nav underline on `.link-draw[aria-current='true']`, and the drawer's current item. Status, availability and decoration stay neutral, so status dots vary by fill (solid, half, outline, faint outline) on `currentColor` rather than by hue. Don't introduce a second hue for status; the `StatusTag` beside every dot already prints the word. The one exception is atmosphere: the hero glow and the 404 backdrop wash the same hue at under 10% alpha, where it reads as light, not as a signal.
  - `:root` holds layout and z-index variables (`--gutter`, `--section-y`, `--nav-h`, `--z-nav`, `--z-skip`, `--z-drawer`), used as `pt-(--section-y)` or `z-(--z-drawer)`.
  - Add new tokens there; don't scatter hex values, radii or font sizes across components. Composition-specific values such as `ch` measures, grid templates and aspect ratios can stay inline.
- Every section root carries `data-surface="ink"` or `data-surface="paper"`. The navbar reads it to switch tone, so new sections must set it.

### Scroll and visual architecture

The architecture is hybrid. The hero is a full-viewport, cinematic, dark (ink) composition with cursor-driven atmosphere and a typewriter role reveal. Everything after it is calm, normal-scrolling content on warm cream/paper surfaces. There is no site-wide scroll snapping or scroll-jacking.

**The hero is the page's only theme switch, and it stays that way.** Contact used to be a second ink block, which gave the page two inversions: a visitor reached the end and felt they had walked into a different site, and it contradicted the sentence above. It is now `data-surface="paper"` on `bg-paper-2`, so the closing section still separates itself, by a tonal step inside one theme rather than a flip. Do not return it, or any other section, to ink. A section that needs to stand apart gets `bg-paper-2`, not a surface change. This is also why `.pill-solid-dark` exists: it is the paper twin of `.pill-solid-light` and carries the primary LinkedIn action in Contact. It was once removed as dead code and had to be written again; it is live, so leave it.

- **Hero (reference A, "Mainframe"):** fixed minimal nav, oversized type, action pills, layered background, subtle mouse interaction, mobile drawer, carefully timed reveals.
- **Editorial sections (reference B, "Marcus/Bennet"):** cream surfaces, oversized type, marquee, layered type and imagery, precise whitespace. Use this where it fits; don't force it on every section.
- When a section prompt gives a reference, reproduce its *design logic* faithfully. That covers layout relationships, hierarchy, scale, alignment, layering, interaction model and responsive transformation, not "vaguely inspired".
- When instructions conflict, the priority order is: current user instruction > master rules (this file) > section prompt > reference details > implementation convenience.
- **One portfolio, not a Frankenstein:** sections can differ but must share the same type system, spacing, colors, borders, motion language, nav and voice.

## Current status

- **Built:** all seven sections, the nav and mobile drawer, design tokens, prerendering, accessibility, reduced motion and print styles.
- **Content:** identity, contact links, location, availability, the Clarium role and the four expertise `evidence` lines come from the user's LinkedIn profile (supplied 2026-10-02). Projects, principles, most "Currently building" items, the role's start date and every expertise `because` are still bracketed placeholders, so a production build currently has no Work section (nav, hero button and 404 links adapt) and no principles list. The about statement is Claude's condensation of the LinkedIn summary, pending approval. The hero positioning line in `site.ts` is a draft written by Claude, pending the user's approval. The section headlines ("The work, and the decisions behind it." etc.) are also Claude's wording.
- **Portrait:** `public/images/portrait-cutout.{webp,png}` is the user's own transparent cutout, shown in the About frame via `site.portrait`. The source has a background-removal leftover at its lower-left edge, so the frame crops head to chest; keep that area out of view if the crop changes.
- **Not yet supplied:** real content, project screenshots, the domain (needed for the canonical URL, `og:url` and `og:image`, plus a sitemap line in `public/robots.txt`), the hosting provider (needed for header and cache config), and the full "Mainframe" and "Marcus / Bennet" reference prompts. prompt.txt calls those references "previously supplied", but they never were. The hero and editorial sections are built from the short descriptions in prompt.txt §4, so when the real references arrive, recheck those sections for fidelity.
- **Fonts (decided 2026-10-13):** the type is Geist and Geist Mono, self-hosted through `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` (SIL Open Font License) and imported at the top of `src/styles/index.css`, not in `main.tsx`, so `404.html` gets them too through `src/not-found.ts`. Vite bundles the `woff2` files into `dist/assets`, so no external request is made. This replaced `'Helvetica Neue', Helvetica, 'Arial Nova', Arial`, which fell back to Arial on Windows and Android. Geist sets tighter at the same tracking, so display went from `-0.055em` to `-0.045em`, headline from `-0.04em` to `-0.035em` and title from `-0.025em` to `-0.02em`. The `0.5em` per character constant in `.hero-name` is still a safe cap (Geist measures `0.484em`), but re-measure it if the font or tracking changes again.

## Section prompt workflow

Section prompts will arrive later. Each should give purpose, audience, reference, fidelity, content, layout, typography, color, assets, interactions, animation, responsive behavior, accessibility, constraints and acceptance criteria. To process one:

1. Re-read this file.
2. Inspect the existing implementation.
3. Analyze the reference.
4. Split the work into reused global elements, section-specific elements and intentional deviations.
5. Implement and integrate the section without rewriting unrelated files.
6. Check it at desktop, tablet and mobile widths for clipping, overflow, z-index, wrapping, touch targets and motion.

## Non-negotiables

- **Accessibility:**
  - Use semantic landmarks and a correct heading hierarchy.
  - Provide visible `:focus-visible` states and full keyboard operation.
  - The mobile drawer traps focus, closes on Escape and restores focus.
  - Nothing may depend on hover alone: every hover reveal also works on focus and tap.
  - Text must meet contrast requirements.
- **Reduced motion:**
  - Honor `prefers-reduced-motion`: stop the marquee, typewriter, parallax and cursor effects, and show content immediately.
  - Content must never depend on animation.
- **Motion:**
  - Short, restrained and purposeful, animating `transform` and `opacity` only.
  - Primary motion leads, supporting motion follows, and the rest stays static.
  - Clean up listeners, timers and requestAnimationFrame on unmount.
- **Video (when supplied):**
  - Treat video as a visual layer behind readable text.
  - Provide a poster or fallback, avoid layout shift and pause it when offscreen.
  - Mouse-scrubbing needs throttled seeking and a touch alternative.
- **Performance:**
  - Keep dependencies minimal and prefer native APIs.
  - Lazy-load media.
  - Avoid needless re-renders; cursor effects write CSS variables through rAF, not React state.
- **Projects:**
  - Projects are proof: what it is, the problem, what I built, technical depth, decisions, status and links.
  - Use progressive disclosure.
  - Selection works by click, focus and tap.
- **Expertise:** show categories with "solved X using Y because Z" evidence. Never a keyword cloud or skill bars.
- **Experience:** must be scannable as company → role → period → contribution.
- **Currently building:** label each item clearly as shipped, in progress, experimental or planned, and don't exaggerate unfinished work.
- **Contact:** primary actions are LinkedIn and Contact. Copy-to-clipboard always has a visible-text fallback.
- **Voice:** intelligent, direct, calm and specific, preferring evidence over adjectives. No buzzwords ("elevate", "seamless", "passionate about coding", "10x") and no emojis.
- **Avoid:**
  - Generic dark dev portfolios, glassmorphism, particles and random 3D.
  - Logo walls, fake stats, testimonials, badge spam and decorative code snippets.
  - Loading screens and a giant "Hello World".

Final check: visual sophistication must never exceed the credibility of the evidence underneath.

## Project skills

`.claude/skills/` contains vendored copies, which you update by re-downloading from upstream:

- From `Leonxlnx/taste-skill`: `taste-skill`, `taste-skill-v1`, `gpt-tasteskill`, `soft-skill`, `minimalist-skill`, `brutalist-skill`, `redesign-skill`, `output-skill`, `stitch-skill`, `brandkit`, `image-to-code-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile`.
- From `shadcn-ui/ui`: `shadcn`. It isn't wired in, because the project doesn't use shadcn components.

These are design aids. This file's rules take precedence over them.
