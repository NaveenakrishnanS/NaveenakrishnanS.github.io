import { useEffect, useRef, useState } from 'react'

type Options = {
  typeMs?: number
  deleteMs?: number
  holdMs?: number
  /** false shows the first word statically (reduced motion). */
  enabled?: boolean
  /** true freezes the cycle in place (e.g. offscreen) and resumes from the same point. */
  paused?: boolean
}

type Typewriter = {
  text: string
  /** false once the cycle has finished, so the caller can drop the caret and its blink. */
  running: boolean
}

/**
 * Types through the words once and stops on the last one, complete. The first word starts complete
 * and held, so the server render, the no-JS render and first paint all read it: content never waits
 * on the animation. Stopping matters for WCAG 2.2.2: nothing here moves for the life of the page.
 */
export function useTypewriter(words: readonly string[], options: Options = {}): Typewriter {
  const { typeMs = 70, deleteMs = 35, holdMs = 2200, enabled = true, paused = false } = options
  const [text, setText] = useState(words[0] ?? '')
  const [done, setDone] = useState(false)
  // Cycle position survives pauses so resuming does not restart or jump. `nextMs` is the wait before
  // the next tick: the opening hold first, then the ordinary step once the cycle is under way.
  const cursor = useRef({ word: 0, chars: words[0]?.length ?? 0, deleting: true, nextMs: holdMs })

  useEffect(() => {
    // One word is already fully rendered, so there is nothing to cycle through.
    if (!enabled || paused || done || words.length < 2) return

    const c = cursor.current
    let timer: number

    const tick = () => {
      c.nextMs = typeMs
      const word = words[c.word] ?? ''
      if (!c.deleting) {
        c.chars += 1
        setText(word.slice(0, c.chars))
        if (c.chars >= word.length) {
          // The last word is now whole: rest here rather than loop forever.
          if (c.word === words.length - 1) {
            setDone(true)
            return
          }
          c.deleting = true
          timer = window.setTimeout(tick, holdMs)
          return
        }
        timer = window.setTimeout(tick, typeMs)
      } else {
        c.chars -= 1
        setText(word.slice(0, c.chars))
        if (c.chars <= 0) {
          c.deleting = false
          c.word = (c.word + 1) % words.length
        }
        timer = window.setTimeout(tick, deleteMs)
      }
    }

    // The first run picks up the opening hold; later runs (resume after a pause, or a remount under
    // StrictMode) pick up the ordinary step, so neither the hold nor the cycle restarts.
    timer = window.setTimeout(tick, c.nextMs)
    return () => window.clearTimeout(timer)
  }, [words, typeMs, deleteMs, holdMs, enabled, paused, done])

  return {
    text: enabled ? text : (words[0] ?? ''),
    running: enabled && !done && words.length > 1,
  }
}
