import { useEffect, type RefObject } from 'react'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED = '(prefers-reduced-motion: reduce)'

/** Pointer effects only make sense with a precise, hovering pointer and motion allowed. */
function pointerMotionAllowed() {
  return window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED).matches
}

/**
 * Depth parallax: writes the pointer position over `ref` as --mx / --my (-1..1) via rAF, and
 * eases back to 0 on leave. Consumed by .depth-name / .depth-portrait in index.css.
 */
export function usePointerDepth(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !pointerMotionAllowed()) return

    let frame = 0
    let x = 0
    let y = 0
    const write = () => {
      frame = 0
      el.style.setProperty('--mx', x.toFixed(3))
      el.style.setProperty('--my', y.toFixed(3))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      y = ((event.clientY - rect.top) / rect.height) * 2 - 1
      schedule()
    }
    const onLeave = () => {
      x = 0
      y = 0
      schedule()
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref])
}

/**
 * Spotlight cards: one delegated listener for every `.spotlight` element on the page. Writes the
 * cursor position relative to the hovered card as --sx / --sy (px) and toggles `data-lit`.
 */
export function useSpotlightDelegation() {
  useEffect(() => {
    if (!pointerMotionAllowed()) return

    let frame = 0
    let current: HTMLElement | null = null
    let px = 0
    let py = 0

    const write = () => {
      frame = 0
      if (!current) return
      const rect = current.getBoundingClientRect()
      current.style.setProperty('--sx', `${(px - rect.left).toFixed(1)}px`)
      current.style.setProperty('--sy', `${(py - rect.top).toFixed(1)}px`)
    }
    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.spotlight') : null
      if (target !== current) {
        current?.removeAttribute('data-lit')
        current = target
        current?.setAttribute('data-lit', '')
      }
      if (!current) return
      px = event.clientX
      py = event.clientY
      if (!frame) frame = requestAnimationFrame(write)
    }
    const onLeaveWindow = () => {
      current?.removeAttribute('data-lit')
      current = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      current?.removeAttribute('data-lit')
    }
  }, [])
}
