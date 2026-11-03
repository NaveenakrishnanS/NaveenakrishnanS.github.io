import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App'
import { NotFound } from './NotFound'
import { personJsonLd } from './lib/structuredData'

export { omittedContent } from './lib/content'

/** Build-time render used by scripts/prerender.js so the shipped HTML contains the full page. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/** Extra <head> markup for the main page. */
export function renderHead(): string {
  return `<script type="application/ld+json">${personJsonLd()}</script>`
}

/** The 404 page is never hydrated, so it renders as plain static markup. */
export function renderNotFound(): string {
  return renderToStaticMarkup(
    <StrictMode>
      <NotFound />
    </StrictMode>,
  )
}
