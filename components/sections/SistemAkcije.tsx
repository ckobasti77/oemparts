import { ButtonLink } from "@/components/ui/Button";
import { CTA } from "@/content/navigacija";
import { asortimanStrana } from "@/content/stranice";
import { kanal, kpHref } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/**
 * Pozivi na strani sistema (plan K01 §4.3, tačka 3): primarno „Pošaljite broj šasije“, spoljno
 * „Ponuda na KupujemProdajem“ i telefon, samo kanali sa vrednošću.
 * - < 1280 px: dugmad odmah ispod uvoda (na telefonu jedno ispod drugog);
 * - ≥ 1280 px: lepljiv panel u desnoj koloni, sa naslovom i rečenicom.
 * Roditelj je mreža od 12 kolona; panel zauzima kolone 9–12 kroz oba reda (uvod i grupe).
 * Telefon se ispod 1024 px ne ponavlja: tada ga nudi donja traka akcija (isti uslov, isti kanal).
 */
export function SistemAkcije() {
  const t = asortimanStrana.panel;
  const kp = kpHref();
  const tel = kanal("telefon");
  return (
    <aside
      aria-labelledby="sistem-akcije"
      className="xl:col-span-4 xl:col-start-9 xl:row-span-2 xl:row-start-1"
    >
      <div className="xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:panel xl:p-6">
        <h2 id="sistem-akcije" className="hidden type-h3 text-ink-1 xl:block">
          {t.naslov}
        </h2>
        <p className="mt-2 hidden type-body-s text-ink-2 xl:block">{t.tekst}</p>
        <div className="flex flex-col gap-3 sm:flex-row xl:mt-5 xl:flex-col">
          <ButtonLink href={RUTE.upit} size="lg" className="w-full sm:w-auto xl:w-full">
            {CTA.upitSasija}
          </ButtonLink>
          {kp ? (
            <ButtonLink href={kp} variant="secondary" size="lg" className="w-full sm:w-auto xl:w-full">
              {CTA.kp}
            </ButtonLink>
          ) : null}
        </div>
        {tel ? (
          <p className="mt-3 hidden type-body-s text-ink-2 lg:block">
            {t.iliPozovite}{" "}
            <a
              href={tel.href}
              className="inline-flex min-h-11 items-center link-underline font-semibold text-ink-1 tabular-nums"
            >
              {tel.vrednost}
            </a>
          </p>
        ) : null}
      </div>
    </aside>
  );
}
