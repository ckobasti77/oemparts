import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CTA } from "@/content/navigacija";
import { KORACI_SARADNJE, saradnjaStrana } from "@/content/saradnja";
import { kanal } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...saradnjaStrana.meta, putanja: RUTE.saradnja });

/** Saradnja za servise i firme (O6). Osnova iz K02; K05 dovršava. */
export default function SaradnjaPage() {
  const tel = kanal("telefon");
  return (
    <>
      <PageHeader
        naslov={saradnjaStrana.naslov}
        uvod={saradnjaStrana.uvod}
        putanja={[{ naziv: saradnjaStrana.naslov, putanja: RUTE.saradnja }]}
        akcije={
          <>
            <ButtonLink href={RUTE.upit} size="lg">
              {CTA.upit}
            </ButtonLink>
            {tel ? (
              <ButtonLink href={tel.href} variant="secondary" size="lg">
                {CTA.pozovite}
              </ButtonLink>
            ) : null}
          </>
        }
      />
      <Section id="koraci" naslov={saradnjaStrana.koraciNaslov}>
        <RevealGroup as="ol" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {KORACI_SARADNJE.map((k, i) => (
            <RevealItem as="li" key={k.naslov} className="panel p-6">
              <span aria-hidden="true" className="type-display-m text-ink-3">
                {i + 1}
              </span>
              <h3 className="mt-3 type-h3 text-ink-1">{k.naslov}</h3>
              <p className="mt-2 text-ink-2">{k.tekst}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
      <CtaBand />
    </>
  );
}
