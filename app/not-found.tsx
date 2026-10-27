import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { ChipLink } from "@/components/ui/Chip";
import { PartImage } from "@/components/ui/PartImage";
import { CTA } from "@/content/navigacija";
import { greske } from "@/content/stranice";
import { naslovStrane } from "@/lib/seo";
import { RUTE } from "@/lib/routes";

export const metadata: Metadata = {
  title: { absolute: naslovStrane(greske.nijePronadjeno.meta.naslov) },
  description: greske.nijePronadjeno.meta.opis,
  robots: { index: false, follow: true },
};

/** Ukras desno (≥ 1024 px): render kočionog diska, bez značenja. */
const RENDER = "kocioni-diskovi";

/**
 * 404 (u izvozu out/404.html), plan K01 §4.11: naslov, rečenica, primarno „Pošaljite upit“ i
 * sekundarno „Na početnu“, pa putevi nazad kao čipovi. Bez reveal-a.
 */
export default function NotFound() {
  const t = greske.nijePronadjeno;
  return (
    <div className="grid items-center gap-10 px-page py-[var(--space-section)] lg:min-h-[calc(100svh-var(--header-h)-12rem)] lg:grid-cols-12 lg:gap-gutter">
      <div className="max-w-[var(--container-reading)] lg:col-span-7">
        <h1 className="type-display-l text-ink-1">{t.naslov}</h1>
        <p className="mt-5 type-lead">{t.tekst}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={RUTE.upit} size="lg">
            {CTA.upit}
          </ButtonLink>
          <ButtonLink href={RUTE.pocetna} variant="secondary" size="lg">
            {CTA.pocetna}
          </ButtonLink>
        </div>
        <p className="mt-10 type-body-s text-ink-3">{t.mozdaTrazite}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {t.predlozi.map((p) => (
            <li key={p.ruta}>
              <ChipLink href={RUTE[p.ruta]}>{p.oznaka}</ChipLink>
            </li>
          ))}
        </ul>
      </div>
      <div
        aria-hidden="true"
        className="hidden overflow-hidden rounded-lg border border-line tile-render lg:col-span-4 lg:col-start-9 lg:block"
      >
        <PartImage slug={RENDER} alt="" sizes="(min-width: 80rem) 400px, 33vw" />
      </div>
    </div>
  );
}
