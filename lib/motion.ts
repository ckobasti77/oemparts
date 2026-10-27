/**
 * Konstante pokreta (plan K01 §5.2). Ogledalo CSS tokena `--dur-*` i `--ease-*` u
 * app/globals.css. GSAP se koristi samo kroz components/motion/.
 */

/** Linija otkrivanja: 18 % visine ekrana iznad donje ivice (kao stari sajt). */
export const REVEAL_LINE = 0.18;
/** Element viši od 60 % ekrana otkriva se kad mu vrh pređe liniju, ne sredina. */
export const REVEAL_TALL = 0.6;

export const REVEAL = {
  durationS: 0.52,
  fadeS: 0.36,
  liftPx: 16,
  liftNarrowPx: 12,
  narrowMedia: "(max-width: 47.99rem)",
  stepMs: 60,
  budgetMs: 180,
  ease: "expo.out",
} as const;

export const DUR = { instant: 0.08, quick: 0.14, base: 0.22, panel: 0.28, panelExit: 0.18 } as const;

export const EASE = { out: "expo.out", in: "power2.in", inOut: "power2.inOut", scrub: "none" } as const;

export const MEDIA = {
  reduce: "(prefers-reduced-motion: reduce)",
  ok: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 64rem)",
} as const;

/**
 * Kašnjenje stavke `index` u paketu od `count` stavki (ms): `stepMs` razmak, a poslednja
 * kreće najviše `budgetMs` posle prve.
 */
export function staggerDelayMs(
  index: number,
  count: number,
  t: { stepMs: number; budgetMs: number } = REVEAL,
): number {
  if (index <= 0 || count <= 1) return 0;
  const step = Math.min(t.stepMs, t.budgetMs / (count - 1));
  return Math.round(Math.min(index, count - 1) * step);
}
