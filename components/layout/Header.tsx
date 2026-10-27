import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";

import { BrandLink } from "@/components/brand/BrandLink";
import { NavLink } from "@/components/layout/NavLink";
import { ButtonLink } from "@/components/ui/Button";
import { ARIA, CTA, GLAVNA_NAVIGACIJA } from "@/content/navigacija";
import { kanal } from "@/lib/links";
import { RUTE } from "@/lib/routes";

/**
 * Header (osnova iz K02; K03 dodaje sažimanje na skrol, meni za telefon i donju traku).
 * Sticky, 56 px (< 1024) / 64 px. Navigacija od 1280 px, KP dugme od 1024 px.
 */
export function Header() {
  const tel = kanal("telefon");
  const kp = kanal("kp");
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-bg-raised/92 backdrop-blur-md">
      <div className="flex h-header items-center gap-4 px-page">
        <BrandLink className="mr-auto xl:mr-6" />
        <nav aria-label={ARIA.glavnaNavigacija} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {GLAVNA_NAVIGACIJA.map((s) => (
              <li key={s.ruta}>
                <NavLink
                  href={RUTE[s.ruta]}
                  className="relative inline-flex min-h-11 items-center rounded-xs px-3 type-button font-medium text-ink-2 transition-control hover:text-ink-1 aria-[current=page]:text-ink-1 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:bg-accent"
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
              className="hidden min-h-12 min-w-12 items-center justify-center gap-2 rounded-sm px-3 type-button text-ink-2 transition-control hover:bg-surface-2 hover:text-ink-1 lg:inline-flex"
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
        </div>
      </div>
    </header>
  );
}
