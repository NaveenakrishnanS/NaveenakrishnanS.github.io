import { site } from '../data/site'
import { CopyEmail } from '../components/contact/CopyEmail'
import { MegaHeading } from '../components/ui/MegaHeading'
import { Reveal } from '../components/ui/Reveal'
import { ArrowUpRight } from '../components/ui/icons'

/** The conclusion: one sheet, the address, then LinkedIn, GitHub and copy-email. Primary actions only. */
export function ContactSection() {
  const year = new Date().getFullYear()

  return (
    // The sheet fill (ink-2) sits only 1.07:1 over the ink page, so the closing chapter's edge needs
    // a hairline to exist at all. ink-line, the same rule token the hero and the footer use, rather
    // than a lighter fill: lifting ink-2 would lower the contrast of every line of text on it.
    <section id="contact" data-surface="ink" aria-labelledby="contact-title" className="sheet border-t border-ink-line bg-ink-2">
      <div className="shell section-y pb-0">
        <MegaHeading id="contact-title">Contact</MegaHeading>

        <Reveal delay={100} className="mt-12 flex flex-col items-center text-center md:mt-16">
          <p className="text-ink-muted">{site.availability}</p>
          {/* Break after "@" on narrow screens (via <wbr>), never mid-word like "gmail.co / m". */}
          <a href={`mailto:${site.email}`} className="link-underline mt-4 pb-1 text-contact font-medium [overflow-wrap:anywhere]">
            {site.email.split('@').map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 && (
                  <>
                    @<wbr />
                  </>
                )}
              </span>
            ))}
          </a>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="pill pill-solid">
              LinkedIn <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {/* GitHub sits beside LinkedIn: the code is evidence, so it gets a real action, not a footer link. */}
            {site.github && (
              <a href={site.github} target="_blank" rel="noreferrer" className="pill pill-ghost">
                GitHub <ArrowUpRight />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <CopyEmail email={site.email} />
          </div>
        </Reveal>

        <footer className="mt-(--section-y) flex flex-col gap-4 border-t border-ink-line py-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {site.name}
          </span>
          <a href="#top" className="link-fade inline-flex min-h-6 w-fit items-center">
            Back to top
          </a>
        </footer>
      </div>
    </section>
  )
}
