// Injects the server-rendered pages into dist/index.html and dist/404.html, then removes the temporary SSR bundle.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const ssrEntry = pathToFileURL(`${root}dist-ssr/entry-server.js`).href

const { render, renderHead, renderNotFound, omittedContent } = await import(ssrEntry)
const pages = [
  { file: 'index.html', render, head: renderHead() },
  { file: '404.html', render: renderNotFound, head: '' },
]
const placeholder = '<div id="root"></div>'

for (const page of pages) {
  const path = `${root}dist/${page.file}`
  const template = await readFile(path, 'utf8')
  if (!template.includes(placeholder)) throw new Error(`prerender: ${placeholder} not found in dist/${page.file}`)
  const html = template
    .replace(placeholder, `<div id="root">${page.render()}</div>`)
    .replace('</head>', `${page.head}</head>`)
  await writeFile(path, html)
  console.log(`prerender: wrote dist/${page.file}`)
}

// Unfinished content is left out of production builds (src/lib/content.ts); say what, so it is not forgotten.
if (omittedContent.length > 0) {
  console.warn(`prerender: ${omittedContent.length} item(s) left out until their [placeholders] are filled:`)
  for (const label of omittedContent) console.warn(`  - ${label}`)
}

await rm(`${root}dist-ssr`, { recursive: true, force: true })
