# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Hard rules from the user

- **Keep everything local.** Never publish anything with the Artifact tool, and never upload content to external services.
- **No fabrication.** Never invent personal facts: employers, dates, clients, projects, metrics, certifications, awards, user counts or production experience. Where real content is missing, use a visible bracketed placeholder such as `[Project title]`, kept in `src/data/*`.
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

- **Measure performance on `npm run build && npm run preview` (port 4173), never on the dev server.** The dev server is unbundled, runs dev-mode React and has no prerendered HTML, so it scores about 40 on mobile Lighthouse. The baseline after the redesign is:
  - **Desktop:** 100/100/100/100.
  - **Mobile:** 97–99 performance, 100 for accessibility, best practices and SEO. The portrait (LCP element) and the deliberate hero entrance choreography put LCP at about 2.2–2.3s, with CLS 0 and TBT about 10ms. This machine has low free memory, so expect ±2 run-to-run, and a crashed run shows all zeros.
  - **axe:** 0 violations, including the open drawer once its stagger settles.

  Treat any further drop as a regression. Hero chrome links must stay 24px-tall targets.
- **Tooling:** for screenshots, axe or Lighthouse, use headless Chrome or Edge through `puppeteer-core`, `axe-core` and `lighthouse`. Install them in a temporary directory outside the project; never add them to `package.json`.
- **Viewports:** capture at 1440×900, 820×1180 and 390×844 with touch emulation (`isMobile` + `hasTouch`, which makes `(hover: hover) and (pointer: fine)` false). Check for horizontal overflow.
- **Other checks:** hydration warnings in the console, the no-JS render (body text should be present), the drawer focus trap and Escape, and reduced motion.
- **Capture artifacts:** full-page captures show the fixed nav mid-page and can catch fades partway through. That comes from the capture method, not from the site. `html { scroll-behavior: smooth }` delays programmatic scrolling, so use `behavior: 'instant'` in scripts.

`src/styles/index.css` imports Tailwind with `source('..')` so that it scans only `src/`. Without that, the skill markdown in `.claude/skills` doubles the CSS size.

## Architecture

The stack is Vite, React 19, TypeScript and Tailwind CSS v4, through `@tailwindcss/vite` with no `tailwind.config`. There is no router: it is a single page with anchor-scrolled sections.

The page is prerendered at build time:
- `src/entry-server.tsx` renders `<App/>` to a string, and `scripts/prerender.js` writes it into `dist/index.html`.
- `src/main.tsx` hydrates when the root has content and does a client render otherwise (the dev server).
- Components must therefore render the same markup on the server and on first client render. Never read `window` during render: use effects, or `useSyncExternalStore` with a server snapshot.
- Check production builds for hydration warnings in the console.

- `src/data/` holds all content as typed data, with types in `src/data/types.ts`. Sections render from this data, so change content here, not in JSX. Placeholders live here too.
- `src/sections/` holds one component per page section, composed in `src/App.tsx` in narrative order: Hero, Work, Expertise, Experience, About, Building, Contact.
- `src/components/<area>/` holds section-specific parts. `src/components/ui/` holds shared primitives.
- `src/hooks/` holds behavior hooks: reduced motion, in-view (pauses the marquee offscreen), element-in-view (hero visibility), active section (tracks every section, not just nav targets), nav surface detection, and `usePointerMotion` (hero depth parallax and delegated spotlight cards, via rAF-written CSS variables, fine pointers only).
- `src/lib/content.ts` holds `publishable()`, which drops placeholder entries from production builds.
- `src/components/navigation/SiteChrome.tsx` holds the page-level chrome:
  - the skip link
  - a slim fixed bar that slides in only after the hero leaves view, since the hero has its own header
  - the mobile `MenuToggle` and `Drawer`, which is inert when closed and keeps the toggle in its focus loop
- `src/styles/index.css` is the design-token source of truth:
  - **Theme block:** the Tailwind `@theme` block holds colors (`ink`, `ink-2`, `ink-fg`, `ink-muted`, `ink-line`, the light sheet `paper*`, one locked `accent`) and fonts.
  - **Type scale:** `text-mega`, `text-number`, `text-title`, `text-lede`, `text-statement`, `text-contact`, `text-menu`, `text-meta`, `text-ui`.
  - **Radii:** `rounded-card`, `rounded-media` and the sheet radius. The rule is sheets 40/56px top, cards 32px, media 20px, pills full.
  - **Easings:** `ease-rise`, `ease-line`, `ease-reveal`.
  - **Layout variables:** `:root` holds `--gutter`, `--section-y`, `--nav-h`, `--sheet-pull` and the z-index scale (`--z-sheet` < `--z-portrait` < `--z-chrome` < `--z-nav` < `--z-drawer` < `--z-toggle` < `--z-skip`).
  - **Component classes:** `.sheet`, `.mega-tone`, `.pill-ghost` / `.pill-solid`, `.link-fade`, `.reveal`, the hero `.anim-*` choreography, `.marquee-track`, and the scroll-driven `.char-reveal` / `.stack-card`.
  - Add new tokens there; don't scatter hex values, radii or font sizes across components. Composition-specific values such as `ch` measures, grid templates and aspect ratios can stay inline.
- **Scroll-linked effects are pure CSS scroll timelines** inside `@supports (animation-timeline: view())`, gated by `prefers-reduced-motion: no-preference`. Unsupported browsers and reduced-motion users get the static final state. Don't add `window` scroll listeners.
- **Sticky stack guard:** `ProjectStack` measures cards and sets `data-stack="off"` when any card is taller than the viewport space below its sticky offset. Otherwise the next card would cover undisplayed details. The fallback CSS rule is deliberately unlayered so it beats the `md:sticky` utility. Keep project card copy short.
- Every section root carries `data-surface="ink"` or `data-surface="paper"`. The fixed bar reads it to switch tone, so new sections must set it.

### Scroll and visual architecture

The architecture is hybrid: a full-viewport, cinematic hero, then normal-scrolling content sections. There is no site-wide scroll snapping or scroll-jacking.

The user's reference mapping, set on 2026-10-01, is authoritative:

| Part of the site | Reference | File |
|---|---|---|
| Hero | Marcus / Bennet | `docs/references/marcus-bennet.md` |
| Every other section | Jack | `docs/references/jack-sections.md` |

The earlier "Mainframe" hero reference is superseded and no longer awaited.

Both files are references, not specs. Reproduce their *design logic* faithfully, but never their identity, names, copy, claims, services, project names, image or GIF URLs, external webfonts, Lucide icons or purple gradients. Those conflict with this file's hard rules. Their details sit at priority 4 in the conflict order below.

**Hero: Marcus / Bennet logic.**
  - **Composition:** one full-viewport (`100dvh`, no scroll) composition. The name is a giant marquee (about 26vh desktop, 16vh mobile, roughly 14vh from the top, 30s linear loop of two identical halves).
  - **Layering:** background photo, then the marquee name, then a cutout portrait in front of the name so the letters pass behind the subject, then the chrome, then the drawer. The cutout needs a real transparent portrait asset, so don't fake one.
  - **Chrome:** brand top-left. At top-right, the year plus *vertical* nav and social columns: plain text links, no pills, hover `opacity-60` over 300ms.
  - **Rule and footer:** a thin cream rule above the footer draws in left to right (`scaleX`). The footer has two blocks, descriptors on the left and a right-aligned note.
  - **Choreography:**

    | Element | Animation | Delay |
    |---|---|---|
    | Background | fade, 1.2s | 0 |
    | Portrait | rise + scale from 1.03, 1.4s | 300ms |
    | Marquee | fade-up | 500ms |
    | Brand | fade-up | 800ms |
    | Chrome | fade-up, staggered 80ms | 900–1150ms |
    | Rule | `scaleX` draw, 1.1s | 1200ms |
    | Footer | fade-up | 1400 / 1550ms |

    Easings are `cubic-bezier(0.22,1,0.36,1)` for rises and `cubic-bezier(0.76,0,0.24,1)` for the line and drawer. Reduced motion collapses everything.
  - **Mobile:** hamburger morphs to an X. A right-side panel (80%, `max-w-sm`, `#141414`) slides in over a blurred black backdrop, with staggered "index" and "social" groups and body scroll locked.
  - **Palette:** cream `#efeee9` on dark photography. Note that our `--color-paper` is `#f4f1ea`, slightly lighter.
  - **No pills, no CTA buttons in the hero.** The chrome is plain text links.

**Other sections: Jack logic,** mapped onto this portfolio's sections:

- **Global language:**
  - A near-black base (`#0C0C0C`) with cool light text (`#D7E2EA`).
  - Huge, black-weight, uppercase, centered section headings (`clamp(3rem, 12vw, 160px)`, `leading-none`) with a subtle vertical steel gradient (`#646973` → `#BBCCD7`). That gradient is not purple, so it's allowed.
  - Fluid `clamp()` type throughout, mobile-first.
- **Sheets:** sections alternate surfaces as rounded-top "sheets" (`rounded-t` 40/50/60px at base/sm/md). The following sheet is pulled up (`-mt-10` / `-mt-12` / `-mt-14`, `z-10`) so it overlaps the one before it, giving dark → white → dark stacking.
- **Expertise uses Jack's "Services" logic:**
  - A white sheet with the huge heading centered, then a numbered vertical list (`max-w-5xl`, centered).
  - In each row, a huge number sits on the left (`clamp(3rem, 10vw, 140px)`). The name (uppercase, medium) and description (light, 60% opacity, `max-w-2xl`) stack on the right.
  - Rows are separated by 1px dividers (`rgba(12,12,12,.15)`), padded `py-8` / `py-10` / `py-12`, and fade in staggered by `i × 0.1s`.
  - Our "solved X using Y because Z" evidence goes in the description slot.
- **Work uses Jack's "Projects" logic:**
  - A dark sheet pulled over the previous one, holding sticky stacking cards.
  - Each card sits in an `h-[85vh]` slot, is `sticky top-24 md:top-32`, and is offset `top: i × 28px`. It scales toward `1 − (n − 1 − i) × 0.03` as later cards scroll over it.
  - Cards have a 40–60px radius and a 2px `#D7E2EA` border.
  - The top row holds the number, category, name and a ghost "Live" pill. Below that is a 40/60 image grid: two stacked images on the left, one tall image on the right.
  - Master rules still apply: problem, what I built, decisions and status must stay reachable inside the card (progressive disclosure), and reduced motion gets a plain stacked list with no scaling.
  - Images only come from real screenshots. Without them, use the existing drawn plates.
- **About uses Jack's "About" logic:**
  - A `min-h-screen` centered composition with the huge heading.
  - The statement paragraph uses a scroll-linked, character-by-character opacity reveal (0.2 → 1 over `['start 0.8', 'end 0.2']`). Give the paragraph a real accessible name, keep the per-character spans `aria-hidden`, and render it fully opaque under reduced motion.
  - The four corner objects slide in from the sides (x ±80, 0.9s). There are no real assets for them, so leave them out rather than inventing 3D art.
  - A contact action sits below.
- **Image marquee strip:** two rows of tiles move in opposite directions, linked to scroll (`offset = (scrollY − sectionTop + innerHeight) × 0.3`). Use it only with real project screenshots, never filler GIFs. Without screenshots, omit it.
- **Experience, Currently building and Contact** have no Jack counterpart. Style them in Jack's language: sheets, huge centered headings, numbered and divider-separated rows, ghost pills.
- **Buttons:** ghost pills (2px border, uppercase, `tracking-widest`, hover `bg/10`). The Jack contact button's purple–magenta gradient is **rejected**, because purple is banned by prompt.txt §46 and by the hero reference. Use a solid light pill instead.
- **Motion:** the Jack FadeIn (`whileInView` once, y 30, 0.7s, ease `[0.25,0.1,0.25,1]`) maps onto the existing `Reveal`, so tune its values; don't add Framer Motion. Build the scroll-linked effects with native APIs (rAF reading layout inside the frame, IntersectionObserver gating, or CSS scroll-driven animations with a fallback). Adding Framer Motion needs the user's approval, because prompt.txt prefers no unnecessary dependencies.

- **Hero versus sections:** the hero bans pills and buttons, while the sections use ghost pills. The hero is warm cream on photography; Jack is cool `#D7E2EA` on `#0C0C0C` and white. Keep each reference's rules in its own part of the site, but unify the shared tokens (type family, base dark, rule and border weights) so it still reads as one portfolio.
- When a section prompt gives a reference, reproduce its *design logic* faithfully. That covers layout relationships, hierarchy, scale, alignment, layering, interaction model and responsive transformation, not "vaguely inspired".
- When instructions conflict, the priority order is: current user instruction > master rules (this file) > section prompt > reference details > implementation convenience.
- **One portfolio, not a Frankenstein:** sections can differ but must share the same type system, spacing, colors, borders, motion language, nav and voice.

## Current status

*(Updated 2026-10-02, after the production-readiness pass.)*

- **Identity:** name "Naveenakrishnan S" (user's choice). Real content comes from the user's LinkedIn profile only:
  - Associate Software Engineer at Clarium Managed Services, Chennai, 3 yrs 9 mos, current, full-time.
  - Stack, summary and links: LinkedIn `naveenakrishnan-s`, GitHub `NaveenakrishnanS`, email `snaveenakrishnan@gmail.com`.
  - Never add facts beyond what the user supplies.
- **Hero (the user's own reference screenshot is authoritative over Marcus / Bennet where they differ):**
  - Uppercase black-weight name marquee at eye level, passing behind the head.
  - A large head-to-chest bust (`public/images/portrait-cutout.webp`, cut from the user's photo, cinematic grade and rim light), anchored to the hero's bottom edge and **in front of the rule**. Footer text stays above it.
  - Index and Elsewhere link columns; the Year column was removed at the user's request.
  - The footer holds numbered roles plus the positioning line and one island **Contact** button.
  - Depth parallax with the cursor.
- **Sections:** Work, Expertise, Experience, About, Now building, Contact. Contact carries LinkedIn, GitHub and Copy email pills. GitHub was promoted from the footer at the user's request, and the footer is © plus Back to top.
- **Drafts:** `src/lib/content.ts` filters out placeholder entries in production builds; the dev server still shows them.
  - Work has no real projects yet, so production shows an honest empty state with a GitHub link.
  - Now building shows only "Exploring AI technologies".
  - Never remove this filter; fill content instead.
- **Typeface:** Geist and Geist Mono, self-hosted via `@fontsource-variable` (OFL, bundled, no external requests). This supersedes the earlier Helvetica decision, after the user found Arial-fallback typography cheap.
- **Palette, motion, radii:**
  - Palette: one dark theme, with cream `#efeee9` as the only light tone and one accent `#d9481c`.
  - Motion: native, with no animation libraries.
  - Radii: the documented rule above.
  - Note that the user's own `favicon.svg` uses a blue dot `#8AA4F5`, which doesn't match the accent. It's the user's file, so leave it unless asked.
- **Production assets:**
  - `public/og-image.jpg` (share card), `public/apple-touch-icon.png`, `public/404.html`.
  - `public/_headers`: CSP, nosniff, referrer policy, HSTS and immutable `/assets` caching, in Netlify / Cloudflare Pages format.
  - JSON-LD `Person` in `index.html`.
  - `.github/workflows/ci.yml`: lint and build.
  - Build with `SITE_URL=https://domain npm run build` to emit canonical, `og:url`, an absolute `og:image` and `sitemap.xml`.
- **Originals:** the user's photo and the masters live in `design/source/`, which is git-ignored on purpose (privacy). Never move them back into `public/`.
- **Still open (user decisions):**
  - The hero roles say "Software Engineer · Product Builder · AI Engineer", but LinkedIn says Associate Software Engineer and "exploring AI". The user has been asked twice and hasn't answered, so don't change this unilaterally. Page metadata deliberately uses the factual "Software Engineer".
  - Projects (names, problem, built, decisions, screenshots) and the other Now building items are not yet supplied.
  - Domain and hosting provider are not yet supplied.
  - The hero positioning line and section headings are Claude's wording, derived from the profile.
- **Taste rules in force:** no em-dashes, no section-number eyebrows, one marquee, status dots only for real status, one label per intent ("Contact").
- **Legacy wording above:** the reference notes still mention `#f4f1ea` paper, `h-[85vh]` slots and "no CTA in the hero". The tokens, the components and this section are the source of truth.

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
