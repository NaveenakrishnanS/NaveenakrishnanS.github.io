/** Decorative layers behind the hero: base grid, pointer lens, warm glow and crosshair axes. */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-lens" />
      <div className="hero-axis">
        <div className="hero-axis-x" />
        <div className="hero-axis-y" />
      </div>
      {/* Fade into the paper surface below so the hero hands off calmly. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink-line" />
    </div>
  )
}
