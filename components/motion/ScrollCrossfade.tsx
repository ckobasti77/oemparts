"use client";

/**
 * Pretapanje na skrol (P9, plan K01 §5.5): `overlay` stoji preko `base` i prelazi opacity 0 → 1
 * dok se skroluje (GSAP ScrollTrigger, scrub 0,5, bez easinga). `base` se nikad ne animira i uvek
 * je na opacity 1, pa LCP slika nije sakrivena.
 *
 * - ≥ 1024 px: okidač je najbliži `[data-crossfade-scope]` (hero), od vrha ispod header-a do 60 %
 *   visine ekrana skrola;
 * - < 1024 px: okidač je sam okvir slike, od „vrh na 75 %“ do „dno na 40 %“ ekrana;
 * - bez JS-a i pod `prefers-reduced-motion` overlay je skriven (`motion-reduce:hidden`, pa se lenja
 *   slika ni ne učita) i stoji `base`.
 *
 * GSAP i ScrollTrigger se učitavaju lenjo, posle prvog iscrtavanja.
 */
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { MEDIA } from "@/lib/motion";

import { loadScrollTrigger } from "./gsap";

const DESKTOP = `${MEDIA.desktop} and ${MEDIA.ok}`;
const MOBILNI = `(max-width: 63.99rem) and ${MEDIA.ok}`;

export function ScrollCrossfade({
  base,
  overlay,
  className,
}: {
  base: ReactNode;
  overlay: ReactNode;
  className?: string;
}) {
  const okvir = useRef<HTMLDivElement>(null);
  const sloj = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = okvir.current;
    const gornji = sloj.current;
    if (!el || !gornji || window.matchMedia(MEDIA.reduce).matches) return;

    let ugaseno = false;
    let pocisti: (() => void) | null = null;

    loadScrollTrigger()
      .then(({ gsap, ScrollTrigger }) => {
        if (ugaseno) return;
        const mm = gsap.matchMedia();
        const scope = el.closest<HTMLElement>("[data-crossfade-scope]") ?? el;

        mm.add(DESKTOP, () => {
          gsap.fromTo(
            gornji,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: scope, start: "top 64px", end: "+=60%", scrub: 0.5, invalidateOnRefresh: true },
            },
          );
        });
        mm.add(MOBILNI, () => {
          gsap.fromTo(
            gornji,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 40%", scrub: 0.5, invalidateOnRefresh: true },
            },
          );
        });

        // Pozicije se računaju posle fontova i slike (rAF, jednom po talasu događaja).
        let raf = 0;
        const osvezi = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        document.fonts?.addEventListener("loadingdone", osvezi);
        const slika = el.querySelector("img");
        if (slika && !slika.complete) slika.addEventListener("load", osvezi, { once: true });

        pocisti = () => {
          cancelAnimationFrame(raf);
          document.fonts?.removeEventListener("loadingdone", osvezi);
          slika?.removeEventListener("load", osvezi);
          mm.revert();
        };
      })
      .catch(() => {
        // Bez GSAP-a ostaje sklopljen auto; ništa nije sakriveno.
      });

    return () => {
      ugaseno = true;
      pocisti?.();
    };
  }, []);

  return (
    <div ref={okvir} className={cn("relative", className)}>
      {base}
      <div ref={sloj} aria-hidden="true" className="absolute inset-0 opacity-0 motion-reduce:hidden">
        {overlay}
      </div>
    </div>
  );
}
