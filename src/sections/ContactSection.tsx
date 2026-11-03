import { site } from '../data/site'
import { CopyEmail } from '../components/contact/CopyEmail'
import { Reveal } from '../components/ui/Reveal'
import { ArrowUpRight } from '../components/ui/icons'

const [emailLocal, emailDomain] = site.email.split('@')

export function ContactSection() {
  return (
    /* Paper, not ink. The hero is the page's one theme switch; a second inversion down here made
       the visitor feel they had walked into a different site, and it contradicted the project's
       own rule that everything after the hero sits on paper. The closing section still separates
       itself, but with a tonal step (bg-paper-2) inside the same theme rather than a flip. */
    <section id="contact" data-surface="paper" aria-labelledby="contact-title" className="bg-paper-2 text-paper-fg">
      <div className="shell section-y pb-0">
        <div className="meta flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-paper-line pt-4 text-paper-muted">
          <span>Contact</span>
          <span className="inline-flex items-center gap-2">
            {/* No data-status: availability is not a Building state, so it takes the plain solid dot. */}
            <span className="status-dot" aria-hidden="true" />
            {site.availability}
          </span>
        </div>

        <Reveal>
          <h2 id="contact-title" className="mt-12 max-w-[14ch] text-balance text-headline font-medium md:mt-20">
            Have something worth building? Let’s talk.
          </h2>
        </Reveal>

        <Reveal index={1} className="mt-14 md:mt-20">
          {/* The address breaks after the "@" or not at all: break-all split "gmail.co / m" on small
              phones. The text content is unchanged, so copy and the mailto still match. */}
          <a
            href={`mailto:${site.email}`}
            className="link-draw block w-fit wrap-anywhere text-contact font-medium"
          >
            {emailLocal}@<wbr />
            {emailDomain}
          </a>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="pill pill-solid-dark">
              LinkedIn <ArrowUpRight />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {site.github && (
              <a href={site.github} target="_blank" rel="noreferrer" className="pill pill-ghost-dark">
                GitHub <ArrowUpRight />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {/* No "Email me" pill: the address above is already the mailto link, a few centimetres
                away. Copy email stays, with the visible-text fallback the project rules require. */}
            <CopyEmail email={site.email} />
          </div>
        </Reveal>

        <footer className="meta mt-(--section-y) flex flex-col gap-4 border-t border-paper-line py-6 text-paper-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            {/* Build year, not the visitor's clock: the prerendered HTML and hydration must agree. */}
            © {__BUILD_YEAR__} {site.name}
          </span>
          {/* min-h-11 matches .pill and .nf-link: 44px, the project's own target size. */}
          <a href="#top" className="link-draw inline-flex min-h-11 w-fit items-center">
            Back to top
          </a>
        </footer>
      </div>
    </section>
  )
}
