import { notFound } from "next/navigation";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

import { AnchorNav } from "@/components/layout/AnchorNav";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GroupArticle } from "@/components/sections/GroupArticle";
import { SistemAkcije } from "@/components/sections/SistemAkcije";
import { SystemNav } from "@/components/sections/SystemNav";
import { SISTEMI } from "@/content/asortiman";
import { asortimanStrana } from "@/content/stranice";
import { grupeSistema, sistemPoSlugu } from "@/lib/asortiman";
import { typographer } from "@/lib/format";
import { RUTE, sistemRuta } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SISTEMI.map((s) => ({ sistem: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asortiman/[sistem]">) {
  const { sistem } = await params;
  const s = sistemPoSlugu(sistem);
  if (!s) return {};
  return pageMetadata({
    naslov: `${s.naziv}${asortimanStrana.sistemNaslovSufiks}`,
    opis: s.metaOpis,
    putanja: sistemRuta(s.slug),
  });
}

/**
 * Strana sistema (plan K01 §4.3): uvod, pozivi (od 1280 px lepljiv panel desno), čipovi grupa,
 * članak po grupi, „Šta da navedete u upitu“, CtaBand i ostali sistemi.
 */
export default async function SistemPage({ params }: PageProps<"/asortiman/[sistem]">) {
  const { sistem } = await params;
  const s = sistemPoSlugu(sistem);
  if (!s) notFound();
  const t = asortimanStrana;
  const grupe = grupeSistema(s.slug);
  const [prviPasus, ...ostaliPasusi] = s.uvod;
  return (
    <>
      <PageHeader
        naslov={s.naziv}
        putanja={[
          { naziv: t.naslov, putanja: RUTE.asortiman },
          { naziv: s.naziv, putanja: sistemRuta(s.slug) },
        ]}
      />
      <div className="px-page">
        <div className="grid gap-y-8 xl:grid-cols-12 xl:gap-x-[var(--gutter)] xl:gap-y-0">
          <div className="xl:col-span-8 xl:row-start-1">
            <p className="max-w-[60ch] type-lead">{typographer(prviPasus)}</p>
            {ostaliPasusi.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 max-w-[68ch] text-ink-2">
                {typographer(p)}
              </p>
            ))}
          </div>
          <SistemAkcije />
          <div className="min-w-0 xl:col-span-8 xl:row-start-2 xl:pt-[var(--space-block)]">
            {grupe.length > 1 ? (
              <AnchorNav
                oznaka={t.grupeNavigacija}
                className="mb-6"
                stavke={grupe.map((g) => ({ href: `#${g.slug}`, naziv: g.naziv }))}
              />
            ) : null}
            <div className="flex flex-col gap-4">
              {grupe.map((g) => (
                <GroupArticle key={g.slug} grupa={g} />
              ))}
            </div>
            <p className="mt-4 type-caption text-ink-3">{t.napomenaSlike}</p>
            {s.upitSaveti.length ? (
              <Reveal as="section" aria-labelledby="upit-saveti" className="mt-12 border-t border-line pt-8 lg:mt-16">
                <h2 id="upit-saveti" className="type-h2 text-ink-1">
                  {t.upitSaveti}
                </h2>
                <ul className="mt-5 grid gap-3">
                  {s.upitSaveti.map((savet) => (
                    <li key={savet} className="flex max-w-[68ch] items-start gap-3 text-ink-2">
                      <CheckIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
                      <span>{typographer(savet)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
      <CtaBand />
      <SystemNav sistem={s} />
    </>
  );
}
