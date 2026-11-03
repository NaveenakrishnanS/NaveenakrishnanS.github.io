import type { CSSProperties } from 'react'

/**
 * Scroll-linked character reveal (Jack AnimatedText), pure CSS: each character's opacity runs
 * 0.2 -> 1 on the paragraph's view timeline, offset by its position (--p). Screen readers get the
 * plain sentence; the split characters are aria-hidden. See .char-reveal in index.css.
 */
export function CharReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  const total = text.length
  // Character index where each word starts (+1 per space), computed up front.
  const starts = words.reduce<number[]>((acc, _word, i) => {
    acc.push(i === 0 ? 0 : (acc[i - 1] ?? 0) + (words[i - 1]?.length ?? 0) + 1)
    return acc
  }, [])

  return (
    <p className={`char-reveal ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => {
          const start = starts[w] ?? 0
          return (
            <span key={w}>
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, c) => (
                  <span key={c} className="char" style={{ '--p': ((start + c) / total).toFixed(3) } as CSSProperties}>
                    {ch}
                  </span>
                ))}
              </span>
              {w < words.length - 1 && ' '}
            </span>
          )
        })}
      </span>
    </p>
  )
}
