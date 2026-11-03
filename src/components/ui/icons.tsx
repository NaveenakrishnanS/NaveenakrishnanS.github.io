// Small inline icon set on a 16px grid with a uniform 1.5 stroke.
type IconProps = { className?: string }

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'square' as const,
  'aria-hidden': true,
}

export const ArrowUpRight = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
)

export const ArrowDown = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M8 3v10M4 9l4 4 4-4" />
  </svg>
)

export const Plus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M8 3v10M3 8h10" />
  </svg>
)

export const Copy = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5.5 5.5h7v7h-7zM3.5 10.5v-7h7" />
  </svg>
)

export const Check = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
)
