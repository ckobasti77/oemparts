import { ClockIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";

import { ChannelList } from "@/components/layout/ChannelList";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { MapaNaKlik } from "@/components/sections/kontakt/MapaNaKlik";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { CTA } from "@/content/navigacija";
import { site } from "@/content/site";
import { kontaktStrana } from "@/content/stranice";
import { cn } from "@/lib/cn";
import { adresaTekst, formatRadnoVreme } from "@/lib/format";
import { prodavnicaLd } from "@/lib/jsonld";
import { kpHref, mapaLink, popuniKanale } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/** Meta opis pominje samo kanale koji postoje, a KP samo kad postoji link (P4). */
const opis = [
  popuniKanale(kontaktStrana.meta.opis, kontaktStrana.kanaliMeta, "instr"),
  kpHref() ? kontaktStrana.meta.opisKp : "",
]
  .filter(Boolean)
  .join(" ");

export const metadata = pageMetadata({ naslov: kontaktStrana.meta.naslov, opis, putanja: RUTE.kontakt });

/**
 * Kontakt (plan K01 §4.9): kanali kao redovi (levo) i panel upita (desno); ispod, samo ako
 * postoje, radno vreme, adresa sa mapom na klik (P3) i podaci firme (P4).
 */
export default function KontaktPage() {
  const t = kontaktStrana;
  const radnoVreme = formatRadnoVreme(site.radnoVreme);
  const adresa = adresaTekst(site.adresa);
  const mapaUpit = site.adresa.mapaUpit.trim() || adresa;
  const firma = (
    [
      ["naziv", site.firma.naziv],
      ["sediste", site.firma.sediste],
      ["pib", site.firma.pib],
      ["mb", site.firma.mb],
    ] as const
  ).filter(([, v]) => v.trim());
  const ima = { radnoVreme: Boolean(radnoVreme), adresa: Boolean(adresa), firma: firma.length > 0 };
  /** Desna kolona (radno vreme, firma); bez adrese su one levo. */
  const desno = cn("self-start", ima.adresa ? "lg:col-span-4 lg:col-start-9" : "lg:col-span-6");

  return (
    <>
      <JsonLd data={prodavnicaLd()} />
      <PageHeader naslov={t.naslov} uvod={t.uvod} putanja={[{ naziv: t.naslov, putanja: RUTE.kontakt }]} />
      <div className="grid gap-block px-page pb-[var(--space-section)] lg:grid-cols-12 lg:gap-gutter">
        <section aria-labelledby="kanali-naslov" className="lg:col-span-7">
          <h2 id="kanali-naslov" className="sr-only">
            {t.kanaliNaslov}
          </h2>
          <ChannelList />
        </section>
        <section
          aria-labelledby="upit-naslov"
          className="flex flex-col items-start gap-4 self-start panel p-6 md:p-8 lg:col-span-4 lg:col-start-9"
        >
          <h2 id="upit-naslov" className="type-h3 text-ink-1">
            {t.upitNaslov}
          </h2>
          <p className="text-ink-2">{t.upitTekst}</p>
          <ButtonLink href={RUTE.upit} size="lg" className="mt-2 w-full sm:w-auto lg:w-full">
            {CTA.upit}
          </ButtonLink>
        </section>

        {ima.radnoVreme || ima.adresa || ima.firma ? (
          // Telefon: radno vreme → adresa i mapa → firma. Od 1024 px adresa sa mapom levo (7 kolona),
          // radno vreme i firma desno (4 kolone), poravnati sa panelom upita iznad.
          <div className="grid gap-block border-t border-line pt-[var(--space-block)] lg:col-span-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-gutter">
            {ima.radnoVreme ? (
              <section aria-labelledby="radno-vreme-naslov" className={cn(desno, "lg:row-start-1")}>
                <h2 id="radno-vreme-naslov" className="flex items-center gap-2 type-h3 text-ink-1">
                  <ClockIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  {t.radnoVreme}
                </h2>
                <p className="mt-3 text-ink-2 tabular-nums">{radnoVreme}</p>
              </section>
            ) : null}
            {ima.adresa ? (
              <section aria-labelledby="adresa-naslov" className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
                <h2 id="adresa-naslov" className="flex items-center gap-2 type-h3 text-ink-1">
                  <MapPinIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  {t.adresa}
                </h2>
                <p className="mt-3 text-ink-2">{adresa}</p>
                <div className="mt-5">
                  <MapaNaKlik upit={mapaUpit} adresa={adresa} oznake={t.mapa} ikona={<MapPinIcon size={24} />} />
                </div>
                <TextLink href={mapaLink(mapaUpit)} external className="mt-3">
                  {t.otvoriMapu}
                </TextLink>
              </section>
            ) : null}
            {ima.firma ? (
              <section
                aria-labelledby="firma-naslov"
                className={cn(desno, ima.radnoVreme ? "lg:row-start-2" : "lg:row-start-1")}
              >
                <h2 id="firma-naslov" className="type-h3 text-ink-1">
                  {t.firma}
                </h2>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 type-body-s">
                  {firma.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-ink-3">{t.firmaPolja[k]}</dt>
                      <dd className="text-ink-1 tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
