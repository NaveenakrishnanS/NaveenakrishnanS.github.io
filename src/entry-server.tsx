import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** Build-time render used by scripts/prerender.js so the shipped HTML contains the full page. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
