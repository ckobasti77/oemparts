import Link from "next/link";

import { ARIA } from "@/content/navigacija";
import { cn } from "@/lib/cn";
import { RUTE } from "@/lib/routes";

import { LogoHorizontal, LogoMark } from "./Logo";

/**
 * Logo kao link na početnu. Vodoravni oblik 44 px od 360 px širine; ispod toga mali znak
 * (vodoravni ispod 44 px ne sme). Link nosi ime, crtež je skriven od čitača ekrana.
 */
export function BrandLink({ className }: { className?: string }) {
  return (
    <Link
      href={RUTE.pocetna}
      aria-label={ARIA.pocetnaLogo}
      className={cn("inline-flex min-h-11 min-w-11 shrink-0 items-center rounded-xs text-ink-1", className)}
    >
      <LogoMark label={null} className="h-8 w-auto min-[22.5rem]:hidden" />
      <LogoHorizontal label={null} className="hidden h-11 w-auto min-[22.5rem]:block" />
    </Link>
  );
}
