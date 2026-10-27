import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PartImage } from "@/components/ui/PartImage";
import { pocetna } from "@/content/pocetna";
import { kanal } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/** Render u panelu saradnje: menjač (sistem „Transmisija“). */
const RENDER = "menjac";

/** Saradnja za servise i firme (sekcija 6): veliki panel (r 20) sa renderom. Bez primarne akcije. */
export function Saradnja() {
  const t = pocetna.saradnja;
  const tel = kanal("telefon");
  return (
    <section aria-labelledby="saradnja-naslov" className="px-page py-section">
      <Reveal className="grid items-center gap-6 panel-raised p-6 md:grid-cols-[1fr_auto] md:gap-10 md:p-10 lg:gap-16 lg:px-14 lg:py-12">
        <div className="tile-render size-40 overflow-hidden rounded-md md:order-2 md:size-64 lg:size-80">
          <PartImage slug={RENDER} alt="" sizes="(min-width: 64rem) 320px, (min-width: 48rem) 256px, 160px" />
        </div>
        <div className="max-w-[56ch] md:order-1">
          <h2 id="saradnja-naslov" className="type-display-l text-ink-1">
            {t.naslov}
          </h2>
          <p className="mt-4 text-ink-2 md:type-lead">{t.tekst}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href={RUTE.saradnja} variant="secondary" size="lg">
              {t.link}
            </ButtonLink>
            {tel ? (
              <p className="type-body-s text-ink-2">
                {pocetna.hero.iliPozovite}{" "}
                <a
                  href={tel.href}
                  className="inline-flex min-h-11 items-center link-underline font-semibold text-ink-1 tabular-nums"
                >
                  {tel.vrednost}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
