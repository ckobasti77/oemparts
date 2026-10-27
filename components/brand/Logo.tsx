import { site } from "@/content/site";
import { cn } from "@/lib/cn";

import { LOGO_HORIZONTAL, LOGO_MARK, LOGO_STACKED } from "./logoPaths";

/**
 * Logo kao inline SVG (luk zvezda oko imena), jedna boja: `currentColor`. Veličina se zadaje
 * visinom (`h-11 w-auto`); širina prati crtež. Najmanje visine: vodoravni 44 px, uspravni
 * 128 px, mali znak 16 px. Ispod najmanje visine ide sledeći manji oblik.
 *
 * `label` je pristupačno ime; `null` kad je logo u linku koji već ima ime.
 * Logo se ne importuje u "use client" fajl (putanje su velike): prosleđuje se kao children.
 */
type LogoProps = { className?: string; label?: string | null };
type Oblik = { readonly w: number; readonly h: number; readonly d: string };

function Crtez({ oblik, label, className }: { oblik: Oblik; label: string | null; className?: string }) {
  const a11y = label === null ? ({ "aria-hidden": true } as const) : ({ role: "img", "aria-label": label } as const);
  return (
    <svg
      viewBox={`0 0 ${oblik.w} ${oblik.h}`}
      width={oblik.w}
      height={oblik.h}
      fill="none"
      focusable={false}
      xmlns="http://www.w3.org/2000/svg"
      {...a11y}
      className={cn("shrink-0", className)}
    >
      <path fill="currentColor" fillRule="evenodd" d={oblik.d} />
    </svg>
  );
}

/** Mali znak, pet zvezda: 32 px i manje. */
export function LogoMark({ className, label = site.brend.ime }: LogoProps) {
  return <Crtez oblik={LOGO_MARK} label={label} className={className} />;
}

/** Vodoravni: prsten zvezda + EUROMOTORS / PLUS — OEM Parts (header). */
export function LogoHorizontal({ className, label = site.brend.lockup }: LogoProps) {
  return <Crtez oblik={LOGO_HORIZONTAL} label={label} className={className} />;
}

/** Uspravni (osnovni): luk od dvanaest zvezda oko imena. */
export function LogoStacked({ className, label = site.brend.lockup }: LogoProps) {
  return <Crtez oblik={LOGO_STACKED} label={label} className={className} />;
}
