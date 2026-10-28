import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CTA, CTA_TRAKA } from "@/content/navigacija";
import { typographer } from "@/lib/format";
import { kpHref } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/**
 * Traka sa pozivom na kraju strane: primarno „Pošaljite broj šasije“ → /upit/ i sekundarno
 * spoljno „Ponuda na KupujemProdajem“ (samo ako KP link postoji).
 */
export function CtaBand({
  naslov = CTA_TRAKA.naslov,
  tekst = CTA_TRAKA.tekst,
}: {
  naslov?: string;
  tekst?: string;
}) {
  const kp = kpHref();
  return (
    <div className="px-page py-section">
      <Reveal className="flex flex-col gap-6 panel-raised p-6 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-[52ch]">
          <h2 className="type-h2 text-ink-1">{typographer(naslov)}</h2>
          <p className="mt-3 text-ink-2">{typographer(tekst)}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={RUTE.upit} size="lg">
            {CTA.upitSasija}
          </ButtonLink>
          {kp ? (
            <ButtonLink href={kp} variant="secondary" size="lg">
              {CTA.kp}
            </ButtonLink>
          ) : null}
        </div>
      </Reveal>
    </div>
  );
}
