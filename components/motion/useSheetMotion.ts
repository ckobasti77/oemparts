"use client";

/**
 * Ulaz i izlaz panela menija (plan K01 §5.1, §5.3). GSAP se učitava lenjo, posle prvog iscrtavanja
 * i samo ispod 1280 px (isti memoizovan uvoz kao RevealEngine). Dok ne stigne, panel se otvara i
 * zatvara bez animacije.
 *
 * - ulaz: panel opacity 0 → 1 i y −8 → 0 (280 ms, expo.out); stavke redom, 30 ms razmaka,
 *   poslednja najviše 150 ms posle prve;
 * - izlaz: opacity → 0 i y −8 (180 ms, power2.in);
 * - reduced motion: samo opacity, 120 ms, bez pomeranja.
 */
import { useCallback, useEffect, useRef, type RefObject } from "react";

import { DUR, EASE } from "@/lib/motion";

import { loadGsap, posleUcitavanja, prefersReducedMotion } from "./gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>;

const STAVKE_KORAK_S = 0.03;
const STAVKE_BUDZET_S = 0.15;
const REDUCE_S = 0.12;
/** Od ove širine navigacija je u header-u (isto kao MobileMenu). */
const SIROKO = "(min-width: 80rem)";

export function useSheetMotion(
  panel: RefObject<HTMLElement | null>,
  stavke = "[data-menu-item]",
): { enter(): void; exit(): Promise<void>; reset(): void } {
  const gsapRef = useRef<Gsap | null>(null);

  useEffect(() => {
    let ziv = true;
    const ucitaj = () =>
      loadGsap()
        .then((g) => {
          if (ziv) gsapRef.current = g;
        })
        .catch(() => {});
    // Od 1280 px meni se ne koristi, pa GSAP ne treba (K07).
    const otkazi = window.matchMedia(SIROKO).matches ? () => {} : posleUcitavanja(ucitaj, 2000);
    return () => {
      ziv = false;
      otkazi();
    };
  }, []);

  const enter = useCallback(() => {
    const g = gsapRef.current;
    const el = panel.current;
    if (!g || !el) return;
    const lista = Array.from(el.querySelectorAll<HTMLElement>(stavke));
    g.killTweensOf([el, ...lista]);
    if (prefersReducedMotion()) {
      g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: REDUCE_S, ease: "none", clearProps: "opacity" });
      return;
    }
    g.fromTo(
      el,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: DUR.panel, ease: EASE.out, clearProps: "opacity,transform" },
    );
    if (lista.length > 0) {
      const korak = lista.length > 1 ? Math.min(STAVKE_KORAK_S, STAVKE_BUDZET_S / (lista.length - 1)) : 0;
      g.fromTo(
        lista,
        { opacity: 0, y: -6 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.panel,
          ease: EASE.out,
          stagger: korak,
          delay: 0.04,
          clearProps: "opacity,transform",
        },
      );
    }
  }, [panel, stavke]);

  const exit = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const g = gsapRef.current;
        const el = panel.current;
        if (!g || !el) {
          resolve();
          return;
        }
        g.killTweensOf([el, ...Array.from(el.querySelectorAll(stavke))]);
        const reduce = prefersReducedMotion();
        g.to(el, {
          opacity: 0,
          ...(reduce ? {} : { y: -8 }),
          duration: reduce ? REDUCE_S : DUR.panelExit,
          ease: reduce ? "none" : EASE.in,
          onComplete: () => resolve(),
          onInterrupt: () => resolve(),
        });
      }),
    [panel, stavke],
  );

  /** Posle zatvaranja: panel i stavke bez ostataka tween-a (sledeće otvaranje kreće od nule). */
  const reset = useCallback(() => {
    const g = gsapRef.current;
    const el = panel.current;
    if (!g || !el) return;
    const lista = Array.from(el.querySelectorAll(stavke));
    g.killTweensOf([el, ...lista]);
    g.set([el, ...lista], { clearProps: "opacity,transform" });
  }, [panel, stavke]);

  return { enter, exit, reset };
}
