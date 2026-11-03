import { useEffect, type RefObject } from 'react'
import { FINE_POINTER } from '../lib/media'

/**
 * Writes a normalized focus point into CSS variables on `ref` (--px/--py in 0..1,
 * --dx/--dy in -1..1) via rAF — no React state, so no re-renders.
 *
 * Fine pointers: the point follows the cursor.
 * Touch / coarse pointers: there is no hover, so scrolling through the hero drives
 * the point along a path toward the name, and a tap moves it directly.
 */
export function usePointerField(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let frame = 0
    let x = 0.62
    let y = 0.42
    let scrollDirty = false

    const write = () => {
      frame = 0
      if (scrollDirty) {
        // Layout is read inside rAF, not in the scroll handler, to avoid forced reflow.
        scrollDirty = false
        const rect = el.getBoundingClientRect()
        if (rect.bottom <= 0) return // hero offscreen: nothing to update
        const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
        x = 0.62 - progress * 0.4
        y = 0.42 + progress * 0.35
      }
      el.style.setProperty('--px', x.toFixed(4))
      el.style.setProperty('--py', y.toFixed(4))
      el.style.setProperty('--dx', (x * 2 - 1).toFixed(4))
      el.style.setProperty('--dy', (y * 2 - 1).toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write)
    }

    const toPoint = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
      y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
      schedule()
    }

    const onMove = (event: PointerEvent) => {
      el.dataset.pointer = 'active'
      toPoint(event)
    }
    const onLeave = () => {
      el.dataset.pointer = 'idle'
    }

    const onScroll = () => {
      scrollDirty = true
      schedule()
    }

    const fine = window.matchMedia(FINE_POINTER).matches
    if (fine) {
      el.addEventListener('pointermove', onMove, { passive: true })
      el.addEventListener('pointerleave', onLeave)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    el.addEventListener('pointerdown', toPoint, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', toPoint)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ref, enabled])
}
