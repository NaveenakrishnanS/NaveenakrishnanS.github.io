import { useEffect, useState } from 'react'
import { Check, Copy } from '../ui/icons'

type CopyState = 'idle' | 'copied' | 'failed'

/** Copies the address; the address itself stays visible and selectable as the fallback. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), 2400)
    return () => window.clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className="pill pill-ghost">
        {state === 'copied' ? <Check /> : <Copy />}
        {state === 'copied' ? 'Copied' : 'Copy email'}
      </button>
      <span role="status" className="sr-only">
        {state === 'copied' && 'Email address copied to clipboard.'}
        {state === 'failed' && 'Copy failed. The address is shown on the page.'}
      </span>
      {state === 'failed' && (
        <span className="self-center text-sm text-ink-muted">Copy unavailable. Select the address above.</span>
      )}
    </>
  )
}
