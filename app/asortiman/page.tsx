import { AnchorNav } from "@/components/layout/AnchorNav";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GroupCard } from "@/components/sections/GroupCard";
import { TextLink } from "@/components/ui/TextLink";
import { SISTEMI } from "@/content/asortiman";
import { CTA } from "@/content/navigacija";
import { asortimanStrana } from "@/content/stranice";
import { brojGrupa, grupeSistema } from "@/lib/asortiman";
import { RUTE, sistemRuta } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...asortimanStrana.meta, putanja: RUTE.asortiman });

/** Broj rendera u prvom redu na telefonu (2 kolone). */
const PRVI_RED = 2;

/**
 * Asortiman (plan K01 §4.2): uvod, čipovi sistema, pa za svaki sistem sekcija sa naslovom,
 * opisom, linkom na stranu sistema i karticama grupa (2 / 3 / 5 kolona), na kraju CtaBand.
 * Renderi su `loading="lazy"` (ODLUKA K04): React 19 od `eager` slike pravi preload
 * nagoveštaj, a Next ga primenjuje i kad prefetch-uje ovu stranu sa drugih strana (link
 * „Asortiman“ u header-u), pa bi svaka strana preuzimala rendere koje ne prikazuje.
 * Izuzetak (K07): prvi red prvog sistema je LCP na telefonu, pa ide odmah i sa visokim
 * prioritetom, u `<picture>` (bez preload nagoveštaja, vidi `PartImage`).
 */
export default function AsortimanPage() {
  const t = asortimanStrana;
  const sistemi = [...SISTEMI].sort((a, b) => a.redosled - b.redosled);
  return (
    <>
      <PageHeader naslov={t.naslov} uvod={t.uvod} putanja={[{ naziv: t.naslov, putanja: RUTE.asortiman }]} />
      <div className="px-page">
        <AnchorNav oznaka={t.brzaNavigacija} stavke={sistemi.map((s) => ({ href: `#${s.slug}`, naziv: s.naziv }))} />
        {sistemi.map((s, si) => {
          const grupe = grupeSistema(s.slug);
          return (
            <section
              key={s.slug}
              id={s.slug}
              aria-labelledby={`${s.slug}-naslov`}
              className="mt-12 border-t border-line pt-8 lg:mt-16 lg:pt-10"
            >
              <Reveal className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
                <div className="max-w-[60ch]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 id={`${s.slug}-naslov`} className="type-h2 text-ink-1">
                      {s.naziv}
                    </h2>
                    <span className="type-caption text-ink-3">{brojGrupa(grupe.length)}</span>
                  </div>
                  <p className="mt-2 text-ink-2">{s.opis}</p>
                </div>
                <TextLink href={sistemRuta(s.slug)} arrow className="shrink-0">
                  {CTA.sveOSistemu}: {s.naziv}
                </TextLink>
              </Reveal>
              <RevealGroup as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
                {grupe.map((g, gi) => (
                  <RevealItem as="li" key={g.slug}>
                    <GroupCard grupa={g} prioritet={si === 0 && gi < PRVI_RED} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          );
        })}
        <p className="mt-6 type-caption text-ink-3">{t.napomenaSlike}</p>
      </div>
      <CtaBand />
    </>
  );
}
