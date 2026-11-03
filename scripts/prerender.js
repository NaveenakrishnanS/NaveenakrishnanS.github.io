// Post-build step:
//   1. injects the server-rendered app into dist/index.html (prerendering)
//   2. preloads the primary web font and the hero portrait
//   3. when SITE_URL is set (e.g. SITE_URL=https://example.com npm run build): adds canonical +
//      og:url, makes og:image absolute (link previews require it), and writes sitemap.xml plus a
//      Sitemap line in robots.txt
// Finally removes the temporary SSR bundle.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`
const indexPath = `${dist}/index.html`
const ssrEntry = pathToFileURL(`${root}dist-ssr/entry-server.js`).href

const { render } = await import(ssrEntry)
let html = await readFile(indexPath, 'utf8')
const placeholder = '<div id="root"></div>'
if (!html.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in dist/index.html`)
html = html.replace(placeholder, `<div id="root">${render()}</div>`)

// Preload the Latin Geist file: otherwise it is only discovered after the CSS downloads, which
// delays the hero name. Vite fingerprints the name, so find it.
const assets = await readdir(`${dist}/assets`)
const font = assets.find((f) => /^geist-latin-wght-normal-.*\.woff2$/.test(f))
const head = []
if (font) head.push(`<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`)
// The hero portrait is referenced only from the prerendered markup; preload it at high priority.
const portrait = html.match(/src="(\/images\/portrait-cutout\.[a-z]+)"/)?.[1]
if (portrait) head.push(`<link rel="preload" href="${portrait}" as="image" fetchpriority="high" />`)

const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '')
if (siteUrl) {
  if (!/^https:\/\//.test(siteUrl)) throw new Error(`prerender: SITE_URL must start with https:// (got "${siteUrl}")`)
  head.push(`<link rel="canonical" href="${siteUrl}/" />`, `<meta property="og:url" content="${siteUrl}/" />`)
  html = html.replace('content="/og-image.jpg"', `content="${siteUrl}/og-image.jpg"`)
  const today = new Date().toISOString().slice(0, 10)
  await writeFile(
    `${dist}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
  )
  const robots = await readFile(`${dist}/robots.txt`, 'utf8')
  await writeFile(`${dist}/robots.txt`, `${robots.trimEnd()}\nSitemap: ${siteUrl}/sitemap.xml\n`)
}

html = html.replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
await writeFile(indexPath, html)
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`prerender: wrote dist/index.html (head tags: ${head.length}${siteUrl ? `, site: ${siteUrl}` : ', no SITE_URL'})`)
