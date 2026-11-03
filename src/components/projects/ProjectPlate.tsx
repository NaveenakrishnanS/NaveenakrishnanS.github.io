import { showPlaceholders } from '../../lib/content'

/**
 * Generated visual used until a real screenshot exists. Each index gets a different
 * line study so the plates read as a set, not as repeated placeholder boxes.
 */
const studies = [
  // Horizontal rules
  Array.from({ length: 8 }, (_, i) => <line key={i} x1="40" x2="360" y1={110 + i * 20} y2={110 + i * 20} />),
  // Concentric circles
  Array.from({ length: 7 }, (_, i) => <circle key={i} cx="200" cy="150" r={18 + i * 18} />),
  // Node graph
  [
    [80, 90, 200, 150],
    [200, 150, 320, 80],
    [200, 150, 300, 230],
    [80, 90, 110, 220],
    [110, 220, 300, 230],
  ].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />),
]

/** Decorative, so it is hidden from assistive tech; the project title is the row heading beside it. */
export function ProjectPlate({ index }: { index: number }) {
  const study = studies[index % studies.length]
  const number = String(index + 1).padStart(2, '0')

  return (
    <div aria-hidden="true" className="relative aspect-[4/3] overflow-hidden rounded-frame border border-paper-line bg-paper-2">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full text-paper-fg/25" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        {study}
        {index % studies.length === 2 &&
          [
            [80, 90],
            [200, 150],
            [320, 80],
            [300, 230],
            [110, 220],
          ].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" className="fill-paper-2" />)}
      </svg>
      <span className="absolute top-4 left-4 text-numeral font-medium text-paper-fg">
        {number}
      </span>
      {showPlaceholders && (
        <span className="meta absolute right-4 bottom-4 rounded-full bg-paper px-3 py-1.5 text-paper-muted">
          [Screenshot pending]
        </span>
      )}
    </div>
  )
}
