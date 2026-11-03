// Minimal inline glyph set (16px grid, 1.5 stroke). Kept in-house to avoid an icon dependency for three glyphs.
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

export const ArrowUpRight = () => (
  <svg {...base}>
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
)

export const Copy = () => (
  <svg {...base}>
    <path d="M5.5 5.5h7v7h-7zM3.5 10.5v-7h7" />
  </svg>
)

export const Check = () => (
  <svg {...base}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
)
