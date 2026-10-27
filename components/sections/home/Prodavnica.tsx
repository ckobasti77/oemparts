import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { CTA } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { kpHref } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/**
 * Poziv na KupujemProdajem (sekcija 8). Bez KP linka u content/site.ts sekcije nema (P4).
 * Ispod 640 px naslov je 6,3vw: reč „KupujemProdajem“ (≈ 13,7 em) tada zauzima ≈ 86vw i uvek
 * staje u red bez preloma i bez horizontalnog skrola.
 */
export function Prodavnica() {
  const kp = kpHref();
  if (!kp) return null;
  const t = pocetna.kp;
  return (
    <section aria-labelledby="kp-naslov" className="bg-bg-raised px-page py-section">
      <Reveal className="max-w-[52rem]">
        <h2 id="kp-naslov" className="type-display-l text-ink-1 max-sm:text-[6.3vw]">
          {t.naslov}
        </h2>
        <p className="mt-4 max-w-[52ch] type-lead">{t.tekst}</p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href={kp} size="lg" className="w-full sm:w-auto">
            {CTA.kpOtvori}
          </ButtonLink>
          <TextLink href={RUTE.upit} arrow>
            {CTA.upit}
          </TextLink>
        </div>
      </Reveal>
    </section>
  );
}
