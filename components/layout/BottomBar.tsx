import { IKONA_KANALA } from "@/components/layout/ContactChannels";
import { ARIA, BRZE_AKCIJE } from "@/content/navigacija";
import { brzeAkcije } from "@/lib/links";

/**
 * Donja traka akcija (< 1024 px, plan K01 §4.0, ODLUKA K01-21): Pozovite · Viber ·
 * KupujemProdajem, samo kanali sa vrednošću; neutralne boje. Server komponenta.
 * Prostor rezerviše `--bottom-bar-h` (atribut `data-bottom-bar` na `<html>` iz layout-a), pa traka
 * nikad ne pokriva footer ni poslednji red sadržaja. Bez ijednog kanala traka se ne renderuje.
 */
export function BottomBar() {
  const lista = brzeAkcije();
  if (lista.length === 0) return null;
  return (
    <nav
      aria-label={ARIA.brzeAkcije}
      className="bar-surface fixed inset-x-0 bottom-0 z-[var(--z-bar)] border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-[36rem] items-stretch px-1 py-1">
        {lista.map((k) => {
          const Ikona = IKONA_KANALA[k.kanal];
          return (
            <li key={k.kanal} className="flex min-w-0 flex-1">
              <a
                href={k.href}
                {...(k.spoljni ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-sm type-caption text-ink-2 transition-control hover:text-ink-1 active:bg-surface-2 active:text-ink-1"
              >
                <Ikona size={24} aria-hidden="true" className="shrink-0" />
                <span className="max-w-full truncate px-0.5 max-[24rem]:text-[0.75rem]">
                  {BRZE_AKCIJE[k.kanal as keyof typeof BRZE_AKCIJE]}
                  {k.vrednost && k.kanal === "telefon" ? <span className="sr-only"> {k.vrednost}</span> : null}
                  {k.spoljni ? <span className="sr-only"> {ARIA.noviProzor}</span> : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Da li strana ima donju traku (za `data-bottom-bar` na `<html>`). */
export function imaDonjuTraku(): boolean {
  return brzeAkcije().length > 0;
}
