# Portfolio Website

Static personal site for GitHub Pages at https://naveenakrishnans.github.io/. Plain HTML, CSS and JavaScript: no build step, no dependencies, no third-party requests.

## Folder structure

```text
.
├── index.html              # The whole site (single page)
├── 404.html                # GitHub Pages not-found page
├── portfolio.html          # Legacy redirect to the home page
├── robots.txt, sitemap.xml, site.webmanifest
├── assets/
│   ├── css/main.css        # All styles (design tokens at the top; print + high-contrast at the end)
│   ├── js/main.js          # Nav, menu, reveals, motion, print, copy-email
│   ├── js/not-found.js     # 404 "Go back" button
│   ├── fonts/              # Self-hosted Geist + Geist Mono, with OFL.txt licence
│   ├── images/             # Portrait (webp + png fallback), og-card.png social preview
│   └── icons/              # favicon.svg (adapts to light/dark tabs) + PNG app icons
├── brand-kit/              # Brand board, logo files, sources for og-card and icons   (not published)
├── tools/                  # update-csp.ps1, build-images.ps1                        (not published)
├── tests/                  # run-tests.ps1, vendored axe-core, output/               (not published)
├── _config.yml             # Keeps repo-only folders off the live site
└── README.md
```

## Editing content

All text lives in `index.html`. Each section starts with a boxed `<!-- SECTION -->` comment explaining what to copy to add an item and which rules apply. The common edits:

| To add or change | Copy this block |
|---|---|
| A job | `<details class="role" data-reveal> … </details>` (newest first; only the current role is `open`) |
| A project | `<li class="project" data-reveal> … </li>` |
| A skill | `<li class="chip">` inside a skills tile |
| A degree or certification | `<article class="bezel" data-reveal> … </article>` |
| A contact link | `<li>` inside `.social` |

House rules: dates use a plain hyphen (`Apr 2025 - Present`), with no em or en dashes and no emoji. The contact button label is always "Get in touch".

If you change facts that also appear elsewhere, update those too:
- **Job title, employer, skills, links:** the JSON-LD block in `<head>` of `index.html` (what Google reads).
- **Headline or role:** `brand-kit/og-card.html`, then run `tools/build-images.ps1` to regenerate the social preview.
- **Any edit:** bump `<lastmod>` in `sitemap.xml`.

## Tools (Windows PowerShell + Chrome or Edge; nothing to install)

| Command | When |
|---|---|
| `powershell -ExecutionPolicy Bypass -File tools/update-csp.ps1` | After editing any inline `<script>` in `index.html` or `404.html`. The Content Security Policy allows inline scripts by hash, so a stale hash blocks the script. |
| `powershell -ExecutionPolicy Bypass -File tools/build-images.ps1` | After changing the brand mark, headline or portrait. Regenerates `og-card.png` and the PNG app icons. |
| `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1` | Before every publish. |

## Tests

`tests/run-tests.ps1` serves the site locally the way GitHub Pages does, drives headless Chrome, and runs 81 checks:

- **Static:** broken references, dead anchors, duplicate ids, heading order, image attributes, banned dashes, inline handlers, CSP hash freshness, SEO tags, JSON-LD, sitemap, robots, manifest, `_config.yml` exclusions, font licence, page-weight budget, external links.
- **Runtime:** JS errors, CSP violations, failed requests, third-party requests.
- **Accessibility:** axe-core in light and dark mode, skip link on first Tab, reduced motion, menu focus handling.
- **Layout:** no sideways scroll, headline length and nav height at 320 / 390 / 768 / 1024 / 1440 / 1920 px, word alignment in animated headings.
- **Resilience:** no JavaScript, main.js failing to load, portrait failing to load.
- **Interaction:** mobile menu, Escape key, copy-email success and failure, role toggles.
- **Print:** all content shown, roles expanded and restored, counters final, PDF page count.
- **Performance:** LCP and CLS on Slow 4G with a 4x slower CPU, request count and size.
- **404 and redirect:** nested missing paths, styling, Go back, `portfolio.html`.

It exits with code 1 on any failure. Results, full-page screenshots and `print.pdf` go to `tests/output/`.

## Publishing checklist

1. Run `tests/run-tests.ps1`: it must report `FAIL 0`.
2. Push to `main` of `NaveenakrishnanS/NaveenakrishnanS.github.io`.
3. GitHub → Settings → Pages: **Deploy from a branch → `main` / `(root)`**, and tick **Enforce HTTPS**.
4. After it deploys, check:
   - https://naveenakrishnans.github.io/ loads
   - https://naveenakrishnans.github.io/anything shows the 404 page
   - Paste the URL into https://www.linkedin.com/post-inspector/ to refresh the LinkedIn preview
5. Optional: add the site to Google Search Console and submit `sitemap.xml`.

## Known limits

- GitHub Pages can't send custom HTTP headers, so security headers are limited to what a `<meta>` CSP can do (no `frame-ancestors`, HSTS is GitHub's). Low risk for a static page with no forms or logins.
- `style-src` allows inline styles, because `style="--i:N"` attributes drive animation timing.
- The PNG portrait (`portrait-cutout.png`, about 500 KB) only loads in browsers without WebP support.

## Local preview

Open `index.html` directly, or run the test suite, which starts a local server at `http://127.0.0.1:8123` while it runs.
