import { ClockIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";

import { ContactChannels } from "@/components/layout/ContactChannels";
import { Reveal } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { CTA, FOOTER } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { site } from "@/content/site";
import { adresaTekst, formatRadnoVreme } from "@/lib/format";
import { RUTE } from "@/lib/routes";

/** Kontakt traka (sekcija 9): kanali sa vrednošću kao tiha dugmad; radno vreme i adresa samo ako postoje. */
export function Kontakt() {
  const t = pocetna.kontakt;
  const radnoVreme = formatRadnoVreme(site.radnoVreme);
  const adresa = adresaTekst(site.adresa);
  return (
    <section aria-labelledby="kontakt-naslov" className="px-page py-section">
      <div className="grid gap-block lg:grid-cols-12 lg:gap-gutter">
        <Reveal className="lg:col-span-5">
          <h2 id="kontakt-naslov" className="type-display-l text-ink-1">
            {t.naslov}
          </h2>
          <p className="mt-4 max-w-[40ch] type-lead">{t.tekst}</p>
          <TextLink href={RUTE.kontakt} arrow className="mt-4">
            {CTA.kontaktSve}
          </TextLink>
        </Reveal>
        <Reveal className="lg:col-span-7">
          <ContactChannels bezKp />
          {radnoVreme || adresa ? (
            <dl className="mt-6 grid gap-3 type-body-s text-ink-2 sm:grid-cols-2">
              {radnoVreme ? (
                <div className="flex gap-3">
                  <ClockIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  <div>
                    <dt className="sr-only">{FOOTER.radnoVreme}</dt>
                    <dd>{radnoVreme}</dd>
                  </div>
                </div>
              ) : null}
              {adresa ? (
                <div className="flex gap-3">
                  <MapPinIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  <div>
                    <dt className="sr-only">{FOOTER.adresa}</dt>
                    <dd>{adresa}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
