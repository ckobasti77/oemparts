"use client";

/**
 * Reveal motor (plan K01 §5.4), montiran jednom u app/layout.tsx.
 *
 * - Server HTML je uvek vidljiv: nema CSS pred-skrivanja. Element se sakriva tek kad motor
 *   (posle lenjog učitavanja GSAP-a) potvrdi da je ceo ispod ekrana, pa nema bljeska i LCP
 *   nikad nije sakriven. Ako GSAP ne stigne, ništa nije sakriveno.
 * - Okidač: sredina elementa pređe liniju 18 % iznad dna ekrana (viši od 60 % ekrana: vrh).
 * - Paket: stavke iste grupe koje pređu liniju zajedno ulaze redom iz dokumenta, 60 ms
 *   razmaka, poslednja najviše 180 ms posle prve.
 * - Failsafe: preskočeno brzim skrolom ili skokom odmah je vidljivo; fokus u skrivenom
 *   elementu ga otkriva; pri štampi, promeni na reduced motion i odlasku sa strane sve je
 *   vidljivo; dno strane otkriva sve što je na ekranu.
 * - `prefers-reduced-motion: reduce`: ništa se ne sakriva i ništa se ne pomera.
 * - Sakriva se samo opacity (ne visibility), pa elementi ostaju fokusabilni.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { MEDIA, REVEAL, REVEAL_LINE, REVEAL_TALL, staggerDelayMs } from "@/lib/motion";

import { loadGsap } from "./gsap";

type Gsap = Awaited<ReturnType<typeof loadGsap>>;

const SELEKTOR = '[data-reveal="block"], [data-reveal-group] > [data-reveal="item"]';

function mete(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(SELEKTOR)).filter(
    (el) => !el.parentElement?.closest(SELEKTOR) && !el.closest('[data-reveal="off"]'),
  );
}

function redosled(a: HTMLElement, b: HTMLElement): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

export function RevealEngine(): null {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia(MEDIA.reduce);
    if (reduce.matches) return;

    let ugaseno = false;
    let gsap: Gsap | null = null;
    let io: IntersectionObserver | null = null;
    let tajmer = 0;
    let idle = 0;
    const cekaju = new Set<HTMLElement>();
    const vidjeni = new WeakSet<Element>();
    const sve: HTMLElement[] = [];

    const usko = () => window.matchMedia(REVEAL.narrowMedia).matches;
    const pomak = (el: HTMLElement) =>
      el.dataset.revealVariant === "fade" ? 0 : usko() ? REVEAL.liftNarrowPx : REVEAL.liftPx;

    const prikaziOdmah = (el: HTMLElement) => {
      cekaju.delete(el);
      io?.unobserve(el);
      gsap?.killTweensOf(el);
      gsap?.set(el, { clearProps: "opacity,transform" });
      el.dataset.revealState = "done";
    };

    const prikaziSve = () => {
      for (const el of Array.from(cekaju)) prikaziOdmah(el);
    };

    const sakrij = (el: HTMLElement) => {
      if (!gsap) return;
      gsap.set(el, { opacity: 0, y: pomak(el) });
      el.dataset.revealState = "pending";
      cekaju.add(el);
    };

    const animiraj = (spremni: HTMLElement[]) => {
      if (!gsap || spremni.length === 0) return;
      const grupe = new Map<Element, HTMLElement[]>();
      for (const el of spremni) {
        if (!cekaju.has(el)) continue;
        cekaju.delete(el);
        io?.unobserve(el);
        el.dataset.revealState = "running";
        const kljuc = el.dataset.reveal === "item" ? (el.parentElement ?? el) : el;
        const lista = grupe.get(kljuc) ?? [];
        lista.push(el);
        grupe.set(kljuc, lista);
      }
      for (const stavke of grupe.values()) {
        stavke.sort(redosled);
        const n = stavke.length;
        gsap.to(stavke, {
          opacity: 1,
          y: 0,
          duration: (_i: number, el: HTMLElement) =>
            el.dataset.revealVariant === "fade" ? REVEAL.fadeS : REVEAL.durationS,
          ease: REVEAL.ease,
          stagger: (i: number) => staggerDelayMs(i, n) / 1000,
          overwrite: "auto",
          clearProps: "opacity,transform",
          onComplete: () => {
            for (const el of stavke) el.dataset.revealState = "done";
          },
        });
      }
    };

    const naIntersekciju: IntersectionObserverCallback = (entries) => {
      const spremni: HTMLElement[] = [];
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (!vidjeni.has(el)) {
          vidjeni.add(el);
          // Prva odluka: sakriva se samo ono što je ceo ispod ekrana.
          if (e.boundingClientRect.top >= window.innerHeight) sakrij(el);
          else {
            el.dataset.revealState = "done";
            io?.unobserve(el);
          }
          continue;
        }
        if (!cekaju.has(el)) continue;
        const visok = e.boundingClientRect.height > window.innerHeight * REVEAL_TALL;
        if (e.isIntersecting && (visok || e.intersectionRatio >= 0.5)) spremni.push(el);
        else if (!e.isIntersecting && e.boundingClientRect.bottom < 0) prikaziOdmah(el);
      }
      animiraj(spremni);
    };

    // Rezervna provera kad skrol stane: ništa iznad linije ne ostaje sakriveno.
    const proveri = () => {
      if (cekaju.size === 0) return;
      const vh = window.innerHeight;
      const linija = vh * (1 - REVEAL_LINE);
      const naDnu = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
      const spremni: HTMLElement[] = [];
      for (const el of cekaju) {
        if (!el.isConnected) {
          cekaju.delete(el);
          continue;
        }
        const r = el.getBoundingClientRect();
        if (r.bottom < 0) prikaziOdmah(el);
        else if (r.top < linija || (naDnu && r.top < vh)) spremni.push(el);
      }
      animiraj(spremni);
    };

    const naSkrol = () => {
      window.clearTimeout(tajmer);
      tajmer = window.setTimeout(proveri, 120);
    };

    const naFokus = (e: FocusEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      for (const el of Array.from(cekaju)) if (el.contains(t)) prikaziOdmah(el);
    };

    const naReduce = () => {
      if (reduce.matches) prikaziSve();
    };

    const pokreni = async () => {
      try {
        gsap = await loadGsap();
      } catch {
        return; // bez GSAP-a ništa nije sakriveno
      }
      if (ugaseno) return;
      io = new IntersectionObserver(naIntersekciju, {
        rootMargin: `0px 0px -${REVEAL_LINE * 100}% 0px`,
        threshold: [0, 0.5],
      });
      for (const el of mete()) {
        sve.push(el);
        io.observe(el);
      }
      window.addEventListener("scroll", naSkrol, { passive: true });
      window.addEventListener("resize", naSkrol, { passive: true });
      document.addEventListener("focusin", naFokus);
      window.addEventListener("beforeprint", prikaziSve);
      window.addEventListener("pagehide", prikaziSve);
      reduce.addEventListener("change", naReduce);
    };

    // Safari nema requestIdleCallback.
    const imaIdle = "requestIdleCallback" in window;
    if (imaIdle) idle = window.requestIdleCallback(() => void pokreni(), { timeout: 1500 });
    else idle = window.setTimeout(() => void pokreni(), 200);

    return () => {
      ugaseno = true;
      if (imaIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.clearTimeout(tajmer);
      io?.disconnect();
      window.removeEventListener("scroll", naSkrol);
      window.removeEventListener("resize", naSkrol);
      document.removeEventListener("focusin", naFokus);
      window.removeEventListener("beforeprint", prikaziSve);
      window.removeEventListener("pagehide", prikaziSve);
      reduce.removeEventListener("change", naReduce);
      for (const el of sve) {
        gsap?.killTweensOf(el);
        if (el.dataset.revealState !== "done") {
          gsap?.set(el, { clearProps: "opacity,transform" });
          el.dataset.revealState = "done";
        }
      }
      cekaju.clear();
    };
  }, [pathname]);

  return null;
}
