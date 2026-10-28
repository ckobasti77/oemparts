import { ContactChannels } from "@/components/layout/ContactChannels";
import { RadnoVremeAdresa } from "@/components/layout/RadnoVremeAdresa";
import { Reveal } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { CTA } from "@/content/navigacija";
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
          <RadnoVremeAdresa radnoVreme={radnoVreme} adresa={adresa} className="mt-6 grid gap-3 sm:grid-cols-2" />
        </Reveal>
      </div>
    </section>
  );
}
