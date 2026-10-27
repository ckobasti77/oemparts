import Link from "next/link";

import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { ChipLink } from "@/components/ui/Chip";
import { CTA } from "@/content/navigacija";
import { SISTEMI } from "@/content/asortiman";
import { asortimanStrana } from "@/content/stranice";
import { grupeSistema } from "@/lib/asortiman";
import { RUTE, grupaRuta, sistemRuta } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...asortimanStrana.meta, putanja: RUTE.asortiman });

/** Asortiman (osnova iz K02; K04 dodaje rendere i kartice grupa). */
export default function AsortimanPage() {
  return (
    <>
      <PageHeader
        naslov={asortimanStrana.naslov}
        uvod={asortimanStrana.uvod}
        putanja={[{ naziv: asortimanStrana.naslov, putanja: RUTE.asortiman }]}
      />
      <nav aria-label={asortimanStrana.brzaNavigacija} className="px-page">
        <ul className="flex flex-wrap gap-2">
          {SISTEMI.map((s) => (
            <li key={s.slug}>
              <ChipLink href={`#${s.slug}`}>{s.naziv}</ChipLink>
            </li>
          ))}
        </ul>
      </nav>
      {SISTEMI.map((s) => (
        <Section
          key={s.slug}
          id={s.slug}
          naslov={s.naziv}
          uvod={s.opis}
          akcija={
            <Link href={sistemRuta(s.slug)} className="inline-flex min-h-11 items-center link-underline">
              {CTA.sveOSistemu}: {s.naziv}
            </Link>
          }
        >
          <ul className="flex flex-wrap gap-2">
            {grupeSistema(s.slug).map((g) => (
              <li key={g.slug}>
                <ChipLink href={grupaRuta(s.slug, g.slug)}>{g.naziv}</ChipLink>
              </li>
            ))}
          </ul>
        </Section>
      ))}
      <CtaBand />
    </>
  );
}
