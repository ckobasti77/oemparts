import Link from "next/link";
import { ArrowUpRightIcon, ClockIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";

import { IKONA_KANALA } from "@/components/layout/ContactChannels";
import { ButtonLink } from "@/components/ui/Button";
import { SISTEMI } from "@/content/asortiman";
import { ARIA, CTA, FOOTER, MENI, PRAVNO } from "@/content/navigacija";
import { site } from "@/content/site";
import { adresaTekst, formatRadnoVreme } from "@/lib/format";
import { kanali, kpHref } from "@/lib/links";
import { RUTE, sistemRuta } from "@/lib/routes";

const linkKlasa = "inline-flex min-h-11 items-center text-ink-2 transition-control hover:text-ink-1";

/**
 * Footer (plan K01 §4.0): logo, rečenica i KP; asortiman i informacije; kontakt (samo kanali sa
 * vrednošću, radno vreme i adresa ako postoje); podaci firme ako postoje (P4); pravne strane i
 * napomena o žigovima (P6). Traka dodiruje ivice ekrana, pa nema radijus. Nije meta reveal-a.
 */
export function Footer() {
  const kp = kpHref();
  const lista = kanali().filter((k) => k.kanal !== "kp");
  const radnoVreme = formatRadnoVreme(site.radnoVreme);
  const adresa = adresaTekst(site.adresa);
  const firma = [
    site.firma.naziv,
    site.firma.sediste,
    site.firma.pib && `${FOOTER.pib} ${site.firma.pib}`,
    site.firma.mb && `${FOOTER.mb} ${site.firma.mb}`,
  ].filter(Boolean);
  const sistemi = [...SISTEMI].sort((a, b) => a.redosled - b.redosled);
  return (
    <footer className="border-t border-line bg-bg-raised print:hidden">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-page py-14 lg:grid-cols-[1.25fr_1fr_0.8fr_1.2fr] lg:gap-x-8 lg:py-16">
        <div className="col-span-2 flex flex-col items-start gap-5 lg:col-span-1">
          <Link href={RUTE.pocetna} aria-label={ARIA.pocetnaLogo} className="inline-flex rounded-xs">
            {/* eslint-disable-next-line @next/next/no-img-element -- statičan SVG iz kita, keš između strana */}
            <img
              src="/images/brand/logo-stacked-night.svg"
              width={199}
              height={128}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-32 w-auto rounded-none"
            />
          </Link>
          <p className="max-w-[38ch] type-body-s text-ink-2">{FOOTER.opis}</p>
          {kp ? (
            <ButtonLink href={kp} variant="secondary">
              {CTA.kp}
            </ButtonLink>
          ) : null}
        </div>
        <nav aria-labelledby="footer-asortiman">
          <h2 id="footer-asortiman" className="type-label text-ink-3">
            {FOOTER.asortiman}
          </h2>
          <ul className="mt-3 type-body-s">
            {sistemi.map((s) => (
              <li key={s.slug}>
                <Link href={sistemRuta(s.slug)} className={linkKlasa}>
                  {s.naziv}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-informacije">
          <h2 id="footer-informacije" className="type-label text-ink-3">
            {FOOTER.informacije}
          </h2>
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
        <div className="col-span-2 lg:col-span-1">
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
                      {k.vrednost ? <span className="ml-2 text-ink-1 tabular-nums">{k.vrednost}</span> : null}
                      {k.spoljni ? <span className="sr-only"> {ARIA.noviProzor}</span> : null}
                    </span>
                    {k.spoljni ? <ArrowUpRightIcon size={14} aria-hidden="true" className="shrink-0 text-ink-3" /> : null}
                  </a>
                </li>
              );
            })}
          </ul>
          {radnoVreme || adresa ? (
            <dl className="mt-3 flex flex-col gap-3 type-body-s text-ink-2">
              {radnoVreme ? (
                <div className="flex gap-3">
                  <ClockIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  <div>
                    <dt className="sr-only">{FOOTER.radnoVreme}</dt>
                    <dd>{radnoVreme}</dd>
                  </div>
                </div>
              ) : null}
              {adresa ? (
                <div className="flex gap-3">
                  <MapPinIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                  <div>
                    <dt className="sr-only">{FOOTER.adresa}</dt>
                    <dd>{adresa}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-line px-page py-6 type-caption font-normal text-ink-3 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex max-w-[62ch] flex-col gap-2">
          <p>
            © {new Date().getFullYear()} {site.brend.ime}
            {firma.length ? ` · ${firma.join(" · ")}` : ""}
          </p>
          <p>{FOOTER.zigovi}</p>
        </div>
        <nav aria-label={ARIA.pravno} className="shrink-0">
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
