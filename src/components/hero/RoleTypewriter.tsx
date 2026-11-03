import { useRef } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useInView } from '../../hooks/useInView'

/**
 * Types each role in turn and stops on the last one. Screen readers and reduced-motion users get the
 * full static list. Pauses offscreen. The caret goes with the animation, so its blink stops too.
 */
export function RoleTypewriter({ roles }: { roles: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref)
  const { text: typed, running } = useTypewriter(roles, { enabled: !reduced, paused: !inView })
  const all = roles.join(' + ')

  return (
    <p ref={ref} className="text-title font-normal text-ink-fg">
      <span className="sr-only">{all}</span>
      <span aria-hidden="true">
        {reduced ? (
          all
        ) : (
          <>
            {typed}
            {running && <span className="caret" />}
          </>
        )}
      </span>
    </p>
  )
}
