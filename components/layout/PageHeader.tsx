import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/layout/JsonLd";
import { ARIA } from "@/content/navigacija";
import { typographer } from "@/lib/format";
import { breadcrumbLd, type Mrvica } from "@/lib/jsonld";
import { RUTE } from "@/lib/routes";

/**
 * Zaglavlje unutrašnje strane: putanja (i njen BreadcrumbList JSON-LD), H1 velikim slovima,
 * uvod i opcione akcije. Na vrhu strane je, pa nije meta reveal-a.
 */
export function PageHeader({
  naslov,
  uvod,
  putanja,
  akcije,
  slika,
}: {
  naslov: string;
  uvod?: ReactNode;
  /** Mrvice posle „Početna“; poslednja je ova strana. */
  putanja: readonly Mrvica[];
  akcije?: ReactNode;
  /** Dekorativna slika: od 1024 px desno (kolone 9–12), na telefonu ispod akcija. */
  slika?: ReactNode;
}) {
  const mrvice = [{ naziv: ARIA.pocetna, putanja: RUTE.pocetna }, ...putanja];
  const tekst = (
    <>
      <Breadcrumbs items={mrvice} />
      <h1 className="mt-4 max-w-[22ch] type-display-l text-ink-1">{naslov}</h1>
      {uvod ? (
        <p className="mt-5 max-w-[60ch] type-lead">{typeof uvod === "string" ? typographer(uvod) : uvod}</p>
      ) : null}
      {akcije ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{akcije}</div> : null}
    </>
  );
  return (
    <header className="px-page pt-8 pb-[var(--space-block)] lg:pt-16">
      <JsonLd data={breadcrumbLd(mrvice)} />
      {slika ? (
        <div className="grid gap-block lg:grid-cols-12 lg:items-center lg:gap-gutter">
          <div className="lg:col-span-7">{tekst}</div>
          <div className="lg:col-span-4 lg:col-start-9">{slika}</div>
        </div>
      ) : (
        tekst
      )}
    </header>
  );
}
