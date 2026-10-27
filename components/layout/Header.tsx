import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, ListIcon, PhoneIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import { BrandLink } from "@/components/brand/BrandLink";
import { IKONA_KANALA } from "@/components/layout/ContactChannels";
import { HeaderState } from "@/components/layout/HeaderState";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLink } from "@/components/layout/NavLink";
import { ButtonLink } from "@/components/ui/Button";
import { ARIA, CTA, GLAVNA_NAVIGACIJA, MENI, MENI_TEKST } from "@/content/navigacija";
import { kanal, kanali } from "@/lib/links";
import { RUTE } from "@/lib/routes";

export const HEADER_ID = "zaglavlje";

/**
 * Header (plan K01 §4.0, §5.6). Sticky, 56 px (< 1024) / 64 px; visina se ne menja. Na vrhu je
 * providan, a posle 24 px skrola dobija podlogu i logo se blago smanji (HeaderState + CSS).
 * - ≥ 1280: logo · navigacija · telefon (tekst od 1440, ikona 1280–1439) · KP (primarno);
 * - 1024–1279: logo · telefon (ikona) · KP · Meni;
 * - < 1024: logo · Meni (telefon, Viber i KP su u donjoj traci).
 * Primarno dugme u header-u je jedina narandžasta u toj oblasti.
 */
export function Header() {
  const tel = kanal("telefon");
  const kp = kanal("kp");
  return (
    <header id={HEADER_ID} data-condensed="false" className="site-header print:hidden">
      <div aria-hidden="true" className="header-surface" />
      <div className="relative flex h-header items-center gap-2 px-page sm:gap-3">
        <BrandLink className="header-logo mr-auto xl:mr-6" />
        <nav aria-label={ARIA.glavnaNavigacija} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {GLAVNA_NAVIGACIJA.map((s) => (
              <li key={s.ruta}>
                <NavLink
                  href={RUTE[s.ruta]}
                  className="relative inline-flex min-h-11 items-center rounded-xs px-3 type-button font-medium text-ink-2 transition-control hover:text-ink-1 aria-[current=page]:text-ink-1 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-accent"
                >
                  {s.oznaka}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 xl:ml-auto">
          {tel ? (
            <a
              href={tel.href}
              aria-label={`${CTA.pozovite} ${tel.vrednost}`}
              className="hidden min-h-12 min-w-12 items-center justify-center gap-2 rounded-sm px-3 type-button text-ink-2 tabular-nums transition-control hover:bg-surface-2 hover:text-ink-1 lg:inline-flex"
            >
              <PhoneIcon size={20} aria-hidden="true" />
              <span className="hidden 2xl:inline">{tel.vrednost}</span>
            </a>
          ) : null}
          {kp ? (
            // Prikaz se zadaje omotaču: `hidden` na samom dugmetu bi se sudario sa njegovim `inline-flex`.
            <div className="hidden lg:block">
              <ButtonLink href={kp.href}>{CTA.kp}</ButtonLink>
            </div>
          ) : null}
          <div className="xl:hidden">
            <MobileMenu
              oznaka={MENI_TEKST.otvori}
              oznakaZatvori={MENI_TEKST.zatvori}
              ariaZatvori={ARIA.zatvoriMeni}
              ariaMeni={ARIA.meni}
              ikonaMeni={<ListIcon size={24} />}
              ikonaZatvori={<XIcon size={24} />}
              logo={<MeniLogo />}
            >
              <MeniSadrzaj />
            </MobileMenu>
          </div>
        </div>
      </div>
      <HeaderState headerId={HEADER_ID} />
    </header>
  );
}

/** Logo u meniju: SVG fajl iz kita (putanje se ne dupliraju u HTML-u), od 360 px širine. */
function MeniLogo() {
  return (
    <Link
      href={RUTE.pocetna}
      aria-label={ARIA.pocetnaLogo}
      className="hidden min-h-11 shrink-0 items-center rounded-xs min-[22.5rem]:inline-flex"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- statičan SVG iz kita, keš između strana */}
      <img
        src="/images/brand/logo-horizontal-night.svg"
        width={236}
        height={44}
        alt=""
        decoding="async"
        fetchPriority="low"
        className="h-11 w-auto rounded-none"
      />
    </Link>
  );
}

/** Sadržaj menija: sve strane, kanali sa vrednošću (bez KP-a) i KP kao primarno dugme. */
function MeniSadrzaj() {
  const lista = kanali().filter((k) => k.kanal !== "kp");
  const kp = kanal("kp");
  return (
    <>
      <nav aria-label={ARIA.glavnaNavigacija}>
        <ul className="flex flex-col">
          {MENI.map((s) => (
            <li key={s.ruta} data-menu-item="">
              <NavLink
                href={RUTE[s.ruta]}
                className="group -mx-3 flex min-h-14 items-center justify-between gap-3 rounded-sm px-3 md:min-h-12 type-h3 text-ink-2 transition-control hover:bg-surface-2 hover:text-ink-1 aria-[current=page]:text-ink-1"
              >
                <span className="decoration-accent decoration-2 underline-offset-8 group-aria-[current=page]:underline">
                  {s.oznaka}
                </span>
                <ArrowRightIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {lista.length > 0 ? (
        <>
          <div data-menu-item="" aria-hidden="true" className="my-4 h-px bg-line" />
          <ul className="flex flex-col">
            {lista.map((k) => {
              const Ikona = IKONA_KANALA[k.kanal];
              const oznaka = k.kanal === "telefon" ? MENI_TEKST.pozovite : k.oznaka;
              const vrednost = k.kanal === "telefon" || k.kanal === "email" ? k.vrednost : "";
              return (
                <li key={k.kanal} data-menu-item="">
                  <a
                    href={k.href}
                    {...(k.spoljni ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="-mx-3 flex min-h-12 items-center gap-3 rounded-sm px-3 text-ink-1 transition-control hover:bg-surface-2"
                  >
                    <Ikona size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
                    <span className="min-w-0">
                      {oznaka}
                      {vrednost ? <span className="ml-2 text-ink-2 tabular-nums">{vrednost}</span> : null}
                      {k.spoljni ? <span className="sr-only"> {ARIA.noviProzor}</span> : null}
                    </span>
                    {k.spoljni ? (
                      <ArrowUpRightIcon size={16} aria-hidden="true" className="ml-auto shrink-0 text-ink-3" />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      {kp ? (
        <div data-menu-item="" className="mt-auto pt-6">
          <ButtonLink href={kp.href} size="lg" fullWidth>
            {CTA.kp}
          </ButtonLink>
        </div>
      ) : null}
    </>
  );
}
