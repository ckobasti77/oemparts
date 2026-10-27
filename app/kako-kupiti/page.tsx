import { CtaBand } from "@/components/layout/CtaBand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { FAQ_KUPOVINA, KORACI_KUPOVINE, kupovinaStrana } from "@/content/kupovina";
import { CTA } from "@/content/navigacija";
import { faqLd } from "@/lib/jsonld";
import { kpHref, popuniPitanja } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...kupovinaStrana.meta, putanja: RUTE.kakoKupiti });

/**
 * Kako kupiti (plan K01 §4.8): tri koraka (u prvom dva poziva) i česta pitanja. FAQPage JSON-LD
 * nosi isti tekst kao strana, sa kanalima koji postoje (P4).
 */
export default function KakoKupitiPage() {
  const pitanja = popuniPitanja(FAQ_KUPOVINA);
  const kp = kpHref();
  return (
    <>
      <JsonLd data={faqLd(pitanja)} />
      <PageHeader
        naslov={kupovinaStrana.naslov}
        uvod={kupovinaStrana.uvod}
        putanja={[{ naziv: kupovinaStrana.naslov, putanja: RUTE.kakoKupiti }]}
      />
      <RevealGroup as="ol" className="px-page">
        {KORACI_KUPOVINE.map((k, i) => (
          <RevealItem
            as="li"
            key={k.naslov}
            className="grid gap-4 border-t border-line py-8 last:border-b md:grid-cols-12 md:gap-gutter"
          >
            <span
              aria-hidden="true"
              className="flex size-16 items-center justify-center rounded-xs border border-line-strong bg-surface-1 type-display-m text-ink-2 tabular-nums md:col-span-2"
            >
              {i + 1}
            </span>
            <div className="md:col-span-7">
              <h2 className="type-h2 text-ink-1">{k.naslov}</h2>
              <p className="mt-3 max-w-[52ch] text-ink-2">{k.tekst}</p>
              {i === 0 ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {kp ? (
                    <ButtonLink href={kp} size="lg">
                      {CTA.kp}
                    </ButtonLink>
                  ) : null}
                  <ButtonLink href={RUTE.upit} variant={kp ? "secondary" : "primary"} size="lg">
                    {CTA.upit}
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <Section id="pitanja" naslov={kupovinaStrana.pitanjaNaslov}>
        <div className="max-w-[var(--container-reading)] border-t border-line">
          {pitanja.map((p) => (
            <Disclosure key={p.pitanje} summary={p.pitanje}>
              <p>{p.odgovor}</p>
            </Disclosure>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
