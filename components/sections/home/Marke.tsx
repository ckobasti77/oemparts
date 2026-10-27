import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { pocetna } from "@/content/pocetna";
import { MARKE } from "@/content/vozila";
import { markaRuta, RUTE } from "@/lib/routes";

/** Marke (plan K01 §4.1, sekcija 2): pet imena kao krupni linkovi, samo tekst (P6). */
export function Marke() {
  const t = pocetna.marke;
  return (
    <section aria-labelledby="marke-naslov" className="px-page pt-12 pb-[var(--space-section)] lg:pt-16">
      <div className="grid gap-block lg:grid-cols-12 lg:gap-gutter">
        <Reveal className="lg:col-span-4">
          <h2 id="marke-naslov" className="max-w-[16ch] type-display-l text-ink-1">
            {t.naslov}
          </h2>
        </Reveal>
        <div className="lg:col-span-8">
          <RevealGroup as="ul" className="flex flex-wrap items-baseline gap-x-7 gap-y-1 md:gap-x-10">
            {MARKE.map((m) => (
              <RevealItem as="li" key={m.slug}>
                <Link
                  href={markaRuta(m.slug)}
                  className="inline-flex min-h-12 items-center type-display-m text-ink-1 link-underline decoration-2 underline-offset-[0.3em]"
                >
                  {m.naziv}
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-6 flex flex-col items-start gap-2 border-t border-line pt-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="max-w-[52ch] text-ink-2">{t.tekst}</p>
            <TextLink href={RUTE.vozila} arrow className="shrink-0">
              {t.link}
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
