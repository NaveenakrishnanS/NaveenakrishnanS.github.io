import './styles/index.css'

/** Swaps the no-JS hint for a real back button. A direct visit has no previous entry, so it goes home instead. */
function enhanceBackButton() {
  const button = document.querySelector<HTMLButtonElement>('[data-back]')
  if (!button) return
  document.querySelector('[data-no-js]')?.remove()
  button.hidden = false
  button.addEventListener('click', () => {
    if (history.length > 1) history.back()
    else location.assign('/')
  })
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

// Production HTML is prerendered (scripts/prerender.js) and ships without React. The dev server serves an
// empty root, so render it there; this branch is dropped from the production bundle.
if (import.meta.env.DEV && !root.hasChildNodes()) {
  Promise.all([import('react'), import('react-dom'), import('react-dom/client'), import('./NotFound')]).then(
    ([{ createElement }, { flushSync }, { createRoot }, { NotFound }]) => {
      flushSync(() => createRoot(root).render(createElement(NotFound)))
      enhanceBackButton()
    },
  )
} else {
  enhanceBackButton()
}
