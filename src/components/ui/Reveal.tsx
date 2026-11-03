import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RevealProps = {
  as?: ElementType
  index?: number
  className?: string
  children: ReactNode
}

/** Fades content up on first entry into the viewport. Visible by default if JS or IO is unavailable. */
export function Reveal({ as: Tag = 'div', index = 0, className = '', children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // The server snapshot is false, so the first post-hydration pass can set 'pending' before
    // useReducedMotion reports the real value. Clear it here, or reduced-motion users keep opacity 0 forever.
    if (reduced || !('IntersectionObserver' in window)) {
      delete el.dataset.reveal
      return
    }
    // Content already on screen at hydration (e.g. deep link) stays put instead of blinking out and back.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.dataset.reveal = 'pending'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.reveal = 'shown'
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-index': index } as CSSProperties}>
      {children}
    </Tag>
  )
}
