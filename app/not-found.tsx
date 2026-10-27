import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { ChipLink } from "@/components/ui/Chip";
import { CTA, MENI } from "@/content/navigacija";
import { greske } from "@/content/stranice";
import { naslovStrane } from "@/lib/seo";
import { RUTE } from "@/lib/routes";

export const metadata: Metadata = {
  title: { absolute: naslovStrane(greske.nijePronadjeno.meta.naslov) },
  description: greske.nijePronadjeno.meta.opis,
  robots: { index: false, follow: true },
};

const PREDLOZI = MENI.filter((s) => ["asortiman", "vozila", "kakoKupiti", "kontakt"].includes(s.ruta)).map((s) => ({
  href: RUTE[s.ruta],
  oznaka: s.oznaka,
}));

/** 404 (u izvozu out/404.html). Osnova iz K02; K03 dovršava. */
export default function NotFound() {
  const t = greske.nijePronadjeno;
  return (
    <div className="max-w-[calc(var(--container-reading)+2*var(--pad))] px-page py-[var(--space-section)]">
      <h1 className="type-display-l text-ink-1">{t.naslov}</h1>
      <p className="mt-5 type-lead">{t.tekst}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={RUTE.upit}>{CTA.upit}</ButtonLink>
        <ButtonLink href={RUTE.pocetna} variant="secondary">
          {CTA.pocetna}
        </ButtonLink>
      </div>
      <p className="mt-10 type-body-s text-ink-3">{t.mozdaTrazite}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {PREDLOZI.map((p) => (
          <li key={p.href}>
            <ChipLink href={p.href}>{p.oznaka}</ChipLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
