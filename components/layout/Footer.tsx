import Link from "next/link";

import { IKONA_KANALA } from "@/components/layout/ContactChannels";
import { ButtonLink } from "@/components/ui/Button";
import { SISTEMI } from "@/content/asortiman";
import { ARIA, CTA, FOOTER, MENI, PRAVNO } from "@/content/navigacija";
import { site } from "@/content/site";
import { formatRadnoVreme } from "@/lib/format";
import { kanali, kpHref } from "@/lib/links";
import { RUTE, sistemRuta } from "@/lib/routes";

const linkKlasa = "inline-flex min-h-11 items-center text-ink-2 transition-control hover:text-ink-1";

/**
 * Footer (osnova iz K02, K03 dovršava): logo, linkovi na sve strane, kanali sa vrednošću,
 * podaci firme samo ako postoje, napomena o žigovima (P6). Traka dodiruje ivice ekrana.
 */
export function Footer() {
  const kp = kpHref();
  const lista = kanali().filter((k) => k.kanal !== "kp");
  const radnoVreme = formatRadnoVreme(site.radnoVreme);
  const adresa = [site.adresa.ulica, [site.adresa.postanskiBroj, site.adresa.mesto].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const firma = [
    site.firma.naziv,
    site.firma.pib && `PIB ${site.firma.pib}`,
    site.firma.mb && `MB ${site.firma.mb}`,
  ].filter(Boolean);
  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="grid gap-10 px-page py-14 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1.2fr] xl:gap-8">
        <div className="flex flex-col items-start gap-5">
          <Link href={RUTE.pocetna} aria-label={ARIA.pocetnaLogo} className="inline-flex rounded-xs">
            {/* eslint-disable-next-line @next/next/no-img-element -- statičan SVG iz kita, keš između strana */}
            <img
              src="/images/brand/logo-stacked-night.svg"
              width={199}
              height={128}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-32 w-auto"
            />
          </Link>
          <p className="max-w-[40ch] type-body-s text-ink-2">{FOOTER.opis}</p>
          {kp ? (
            <ButtonLink href={kp} variant="secondary">
              {CTA.kp}
            </ButtonLink>
          ) : null}
        </div>
        <nav aria-label={FOOTER.asortiman}>
          <h2 className="type-label text-ink-3">{FOOTER.asortiman}</h2>
          <ul className="mt-3 type-body-s">
            {SISTEMI.map((s) => (
              <li key={s.slug}>
                <Link href={sistemRuta(s.slug)} className={linkKlasa}>
                  {s.naziv}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={FOOTER.informacije}>
          <h2 className="type-label text-ink-3">{FOOTER.informacije}</h2>
          <ul className="mt-3 type-body-s">
            {MENI.map((s) => (
              <li key={s.ruta}>
                <Link href={RUTE[s.ruta]} className={linkKlasa}>
                  {s.oznaka}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="type-label text-ink-3">{FOOTER.kontakt}</h2>
          <ul className="mt-3 type-body-s">
            {lista.map((k) => {
              const Ikona = IKONA_KANALA[k.kanal];
              return (
                <li key={k.kanal}>
                  <a
                    href={k.href}
                    className={`${linkKlasa} gap-3`}
                    {...(k.spoljni ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Ikona size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                    <span>
                      {k.oznaka}
                      {k.vrednost ? <span className="ml-2 text-ink-1">{k.vrednost}</span> : null}
                      {k.spoljni ? <span className="sr-only"> {ARIA.noviProzor}</span> : null}
                    </span>
                  </a>
                </li>
              );
            })}
            {radnoVreme ? <li className="py-2 text-ink-2">{radnoVreme}</li> : null}
            {adresa ? <li className="py-2 text-ink-2">{adresa}</li> : null}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-line px-page py-6 type-caption font-normal text-ink-3 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex max-w-[90ch] flex-col gap-2">
          <p>
            © {new Date().getFullYear()} {site.brend.ime}
            {firma.length ? ` · ${firma.join(" · ")}` : ""}
          </p>
          <p>{FOOTER.zigovi}</p>
        </div>
        <nav aria-label={ARIA.pravno}>
          <ul className="flex flex-wrap gap-x-5">
            {PRAVNO.map((s) => (
              <li key={s.ruta}>
                <Link href={RUTE[s.ruta]} className="inline-flex min-h-11 items-center link-underline text-ink-2">
                  {s.oznaka}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
