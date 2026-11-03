import { ArrowUpRight } from './icons'

type IslandLinkProps = { href: string; label: string }

/**
 * Primary "island" action: a cream pill with its arrow nested in its own circle (button-in-button).
 * On hover the inner circle drifts up-right; on press the pill compresses.
 */
export function IslandLink({ href, label }: IslandLinkProps) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 rounded-full bg-ink-fg py-1.5 pr-1.5 pl-5 text-sm font-medium text-ink transition-transform duration-500 ease-rise active:scale-[0.98]"
    >
      {label}
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-full bg-ink/10 transition-transform duration-500 ease-rise group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105"
      >
        <ArrowUpRight />
      </span>
    </a>
  )
}
