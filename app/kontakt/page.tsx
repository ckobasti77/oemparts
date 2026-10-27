import { ContactChannels } from "@/components/layout/ContactChannels";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { CTA } from "@/content/navigacija";
import { kontaktStrana } from "@/content/stranice";
import { prodavnicaLd } from "@/lib/jsonld";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...kontaktStrana.meta, putanja: RUTE.kontakt });

/** Kontakt (osnova iz K02; K05 dodaje radno vreme, adresu, mapu na klik i podatke firme). */
export default function KontaktPage() {
  return (
    <>
      <JsonLd data={prodavnicaLd()} />
      <PageHeader
        naslov={kontaktStrana.naslov}
        uvod={kontaktStrana.uvod}
        putanja={[{ naziv: kontaktStrana.naslov, putanja: RUTE.kontakt }]}
      />
      <div className="grid gap-8 px-page pb-[var(--space-section)] lg:grid-cols-[1fr_24rem]">
        <ContactChannels className="content-start" />
        <section className="flex flex-col items-start gap-4 panel p-6" aria-labelledby="upit-naslov">
          <h2 id="upit-naslov" className="type-h3 text-ink-1">
            {kontaktStrana.upitNaslov}
          </h2>
          <p className="text-ink-2">{kontaktStrana.upitTekst}</p>
          <ButtonLink href={RUTE.upit}>{CTA.upit}</ButtonLink>
        </section>
      </div>
    </>
  );
}
