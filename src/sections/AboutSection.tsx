import { aboutStatement, principles } from '../data/about'
import { CharReveal } from '../components/about/CharReveal'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'

/**
 * Jack "About" logic: a centered composition with a scroll-revealed statement.
 * Full-height centring applies from lg only. Below that, one Experience role above plus the stacked
 * paddings left roughly 390px of empty ink before the heading at tablet portrait widths.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      data-surface="ink"
      aria-labelledby="about-title"
      className="flex items-center bg-ink px-(--gutter) py-20 lg:min-h-[100dvh]"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <MegaHeading id="about-title">About</MegaHeading>
          <CharReveal text={aboutStatement} className="max-w-[36rem] text-center text-statement font-medium" />
        </div>

        <ol className="grid w-full max-w-2xl gap-5 text-center">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 100}>
              <span className="font-medium">{p.title}.</span> <span className="text-ink-muted">{p.body}</span>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <a href="#contact" className="pill pill-solid">
            Contact
          </a>
        </Reveal>
      </div>
    </section>
  )
}
