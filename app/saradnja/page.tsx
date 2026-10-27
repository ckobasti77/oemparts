import { CheckIcon, GarageIcon, TruckIcon, WrenchIcon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { CtaBand } from "@/components/layout/CtaBand";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Koraci } from "@/components/sections/Koraci";
import { ButtonLink } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { PartImage } from "@/components/ui/PartImage";
import { CTA } from "@/content/navigacija";
import { FAQ_SARADNJA, KOME, KORACI_SARADNJE, STA_POSLATI, saradnjaStrana } from "@/content/saradnja";
import { faqLd } from "@/lib/jsonld";
import { kanal } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...saradnjaStrana.meta, putanja: RUTE.saradnja });

/** Ikone za „Kome je namenjeno“, redom kao u content/saradnja.ts (servisi, mehaničari, firme sa vozilima). */
const IKONE_KOME: readonly Icon[] = [GarageIcon, WrenchIcon, TruckIcon];

/**
 * Saradnja za servise i firme (O6, plan K01 §4.6): uvod sa pozivima i dekorativnim renderom,
 * koraci saradnje, šta poslati i kome je namenjeno, česta pitanja i poziv na kraju. Bez
 * obećanja popusta, rabata i rokova (P5; stavke su u docs/PODACI-OD-KLIJENTA.md).
 */
export default function SaradnjaPage() {
  const t = saradnjaStrana;
  const tel = kanal("telefon");
  return (
    <>
      <JsonLd data={faqLd(FAQ_SARADNJA)} />
      <PageHeader
        naslov={t.naslov}
        uvod={t.uvod}
        putanja={[{ naziv: t.naslov, putanja: RUTE.saradnja }]}
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
        slika={
          // Okvir 4:3 (render je kvadrat u sredini), da slika ne bude viša od teksta pored nje.
          <div
            aria-hidden="true"
            className="flex aspect-[4/3] w-full justify-center overflow-hidden rounded-lg border border-line tile-render max-lg:max-h-56"
          >
            <div className="aspect-square h-full">
              <PartImage slug="menjac" alt="" sizes="(min-width: 80rem) 300px, (min-width: 64rem) 22vw, 224px" />
            </div>
          </div>
        }
      />

      <Section id="koraci" naslov={t.koraciNaslov} ton="raised">
        <Koraci koraci={KORACI_SARADNJE} />
      </Section>

      <div className="grid gap-block px-page py-section md:grid-cols-2 md:gap-gutter lg:grid-cols-12">
        <Reveal as="section" aria-labelledby="poslati-naslov" className="lg:col-span-6">
          <h2 id="poslati-naslov" className="type-h2 text-ink-1">
            {t.staPoslatiNaslov}
          </h2>
          <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {STA_POSLATI.map((s) => (
              <li key={s} className="flex items-start gap-3 py-4 text-ink-1">
                <CheckIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-2" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal as="section" aria-labelledby="kome-naslov" className="lg:col-span-5 lg:col-start-8">
          <h2 id="kome-naslov" className="type-h2 text-ink-1">
            {t.komeNaslov}
          </h2>
          <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {KOME.map((k, i) => {
              const Ikona = IKONE_KOME[i] ?? TruckIcon;
              return (
                <li key={k} className="flex items-center gap-3 py-4 text-ink-1">
                  <Ikona size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  <span>{k}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      {/* Bez gornjeg i donjeg razmaka: daju ga liste iznad i CtaBand ispod. */}
      <section aria-labelledby="pitanja-naslov" className="px-page">
        <Reveal className="max-w-[var(--container-reading)]">
          <h2 id="pitanja-naslov" className="type-h2 text-ink-1">
            {t.pitanjaNaslov}
          </h2>
          <div className="mt-6 border-t border-line">
            {FAQ_SARADNJA.map((p) => (
              <Disclosure key={p.pitanje} summary={p.pitanje}>
                <p className="max-w-[60ch]">{p.odgovor}</p>
              </Disclosure>
            ))}
          </div>
        </Reveal>
      </section>

      <CtaBand naslov={t.cta.naslov} tekst={t.cta.tekst} />
    </>
  );
}
