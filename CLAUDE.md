# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static single-page portfolio for https://naveenakrishnans.github.io/ (source repo: `NaveenakrishnanS/NaveenakrishnanS.github.io`). Plain HTML, CSS and vanilla JS, with no package manifest or build. This folder is a local working copy, not a git repository, so changes have to be pushed to that repo separately. The owner chose to stay on plain HTML; don't propose frameworks or a build step unless asked.

## Commands (Windows PowerShell + Chrome/Edge, nothing to install)

- `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1`: full suite (81 checks). It must end `FAIL 0` before anything is called done. Output and screenshots go to `tests/output/`.
- `powershell -ExecutionPolicy Bypass -File tools/update-csp.ps1`: rerun after touching any inline `<script>` (CSP hashes).
- `powershell -ExecutionPolicy Bypass -File tools/build-images.ps1`: regenerates `assets/images/og-card.png` and the PNG icons from `brand-kit/og-card.html` and `brand-kit/icon.html`.
- There's no single-test flag. To check one thing, run the suite and read that line, or drive Chrome yourself (see Verifying below).

## Things that span files

- **The repo root is the published site.** GitHub Pages deploys from `main` / `(root)`. Pages runs Jekyll, so `_config.yml` excludes repo-only paths (`README.md`, `CLAUDE.md`, `brand-kit/`, `tools/`, `tests/`). Add any new non-site path there, or it goes live; the suite checks this list.
- **Content Security Policy.** Both pages carry a `<meta>` CSP. Scripts are `'self'` plus SHA-256 hashes of the inline scripts, so no inline event handlers (`onclick=`, `onerror=`) and no new inline scripts without rerunning `tools/update-csp.ps1`. JSON-LD blocks are exempt. `style-src` allows inline styles for `style="--i:N"`.
- **Load guard.** The inline `<head>` script adds `.js` and, on `load`, removes it again unless `main.js` set `window.__siteReady` on its last line. Keep that assignment last: any earlier error then reveals all content instead of leaving `data-reveal` sections hidden.
- **Theming is token-only.** Colours, radii, spacing, easing and z-index are custom properties at the top of `main.css`, redefined for dark mode. Print and forced-colors blocks at the end of the file override them. One accent (`--accent`).
- **Shape rule** (top of `main.css`): interactive controls are pills, containers use the double bezel (`.bezel` + `.bezel-core`), chips use `--r-sm`.
- **Reveal contract.** `data-reveal` (optional `style="--i:N"` stagger) is hidden only with `.js` and motion allowed; `main.js` adds `.is-visible`. The hero animates by CSS keyframe on first paint (better LCP); only later sections use the observer.
- **Nav wiring.** `.nav-links` and the mobile `<nav id="menu">` use `#section` hrefs; `aria-current` comes from an IntersectionObserver; `.nav-sentinel` drives the elevated nav. No `window` scroll listeners. While the menu is open, `main`, the footer and the skip link are `inert`.
- **Section IDs are public anchors** (`#about`, `#skills`, `#experience`, `#projects`, `#education`, `#contact`, `#top`). Keep them stable.
- **Facts are repeated** in the JSON-LD (`<head>`), `brand-kit/og-card.html` (then rebuild images) and `sitemap.xml` `<lastmod>`. Update them with content changes.

## Content conventions

- No em or en dashes in visible text (dates use `-`). No emoji. One label per intent: the contact CTA is always "Get in touch". The suite checks dashes.
- No third-party requests (the suite checks this). Fonts are self-hosted with `OFL.txt`. Icons are an inline Phosphor-light `<symbol>` sprite in `index.html`, used as `<svg class="icon"><use href="#i-NAME"/></svg>`. Copy official paths from `@phosphor-icons/core`; don't draw icons.
- **Brand mark** (two stems + separate diagonal link + endpoint dot) lives in `assets/icons/favicon.svg` (switches colours via `prefers-color-scheme` inside the SVG), the inline nav logo in `index.html` (must stay inline because `.m-stem`, `.m-link` and `.m-dot` animate), the inline copy in `404.html`, and `brand-kit/` (board, `icon.html`, `og-card.html`). Keep them in sync.
- **Portrait:** transparent cutout `portrait-cutout.webp` (+ `.png`) in a `<picture>`. A CSS mask fades its bottom edge and hides a stray arm at the bottom-left, so keep the mask. If it fails to load, `main.js` removes the `<picture>` and the "NS" monogram shows.
- **404.html** is modelled on the Dynacap page (404s.design). A `document.write`'d `<base>` makes relative paths work at nested missing URLs (`/`) and from disk (`./`). Its "Go back" logic is in `assets/js/not-found.js`. It's always dark (`.nf` token overrides). The numerals are `.glitch-top` / `.glitch-band` / `.glitch-bottom` over an invisible `.glitch-base`, with the band shifted left about one stroke width over the 4's crossbar.
- **Print:** `@media print` in `main.css`, plus `beforeprint`/`afterprint` in `main.js` that reveal everything, expand roles (accumulated in a Set, because browsers can fire `beforeprint` twice) and finish counters.

## Motion layer

In the `/* Motion layer */` block of `main.css` (inside `prefers-reduced-motion: no-preference`) plus `main.js`. No animation libraries.

- Word masks: `.w > .w-i` with `--wi`. The hero `<h1>` is pre-split in HTML; `data-split="rise"` (headings) and `data-split="scrub"` (about statement) are split by `splitWords()`. Rise words align `top` (needed for the mask); scrub words align on the `baseline`, because top alignment drifts where `.muted` starts. The suite checks word alignment.
- Scroll-driven effects sit in `@supports (animation-timeline: view())`: the portrait exit and drift, the statement brightening (`--statement`) and the experience progress (`--roles` via `timeline-scope`).
- Counters use `data-count-from`, `data-count-to` and `data-count-format`; latency counts down on purpose. `data-count-done` stops them (print).
- `.btn` transform = `--mx`/`--my` (magnetic) + `--press` (`:active`). Don't set `transform` on `.btn` directly.
- Roles animate `::details-content` with `interpolate-size` (Chromium only).

## Verifying

Plain `chrome --headless --screenshot` captures the first frame, and `--virtual-time-budget` freezes CSS transitions and rAF. For real animated states, drive Chrome over the DevTools protocol with real-time waits, as `tests/run-tests.ps1` does (its `Cdp`, `Js`, `Go` and `Save-Shot` helpers). Its local server mimics GitHub Pages (404.html at any missing path).

## Project skills

`.claude/skills/` holds design skills vendored from `Leonxlnx/taste-skill` and `shadcn/ui`. The design follows `redesign-skill`, `taste-skill` (its SKILL.md is named `design-taste-frontend`), `minimalist-skill`, `soft-skill` and, for motion, `gpt-tasteskill`/`stitch-skill` adapted to no libraries. Same-named copies in the user-level `~/.claude/skills/` take precedence over these.
