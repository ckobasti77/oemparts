import { InfoIcon } from "@phosphor-icons/react/dist/ssr";

import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CTA } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { popuniKanale } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/**
 * Ćelije broja šasije, grupisane kao delovi VIN-a (3 + 6 + 8 = 17); samo ukras. Bez podloge i
 * niže od polja, da ne liče na polje za unos (unos je na /upit/).
 */
const GRUPE_VIN = [3, 6, 8];

/** Upit po šasiji (sekcija 7): kratko, primarno „Pošaljite upit“ → /upit/. */
export function Upit() {
  const t = pocetna.upit;
  return (
    <section aria-labelledby="upit-naslov" className="px-page pb-[var(--space-section)]">
      <div className="grid gap-block lg:grid-cols-12 lg:items-center lg:gap-gutter">
        <Reveal className="lg:col-span-6">
          <h2 id="upit-naslov" className="max-w-[16ch] type-display-l text-ink-1">
            {t.naslov}
          </h2>
          <p className="mt-4 max-w-[48ch] type-lead">{popuniKanale(t.tekst, pocetna.kanaliUpit, "gen")}</p>
          <div className="mt-8">
            <ButtonLink href={RUTE.upit} size="lg" className="w-full sm:w-auto">
              {CTA.upit}
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal className="panel p-5 md:p-7 lg:col-span-5 lg:col-start-8">
          <div aria-hidden="true" className="flex gap-2.5 md:gap-3">
            {GRUPE_VIN.map((n, g) => (
              <div key={g} className="flex gap-1 md:gap-1.5" style={{ flexGrow: n }}>
                {Array.from({ length: n }, (_, i) => (
                  <span
                    key={i}
                    className="h-8 min-w-0 flex-1 rounded-xs border border-line-strong md:h-10"
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="mt-5 flex gap-3 type-body-s text-ink-2">
            <InfoIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
            <span>{t.napomena}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
