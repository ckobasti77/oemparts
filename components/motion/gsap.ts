/**
 * Jedino mesto koje uvozi GSAP (ESLint pravilo u eslint.config.mjs). Uvoz je lenj
 * (dynamic import) i memoizovan, pa GSAP nikad nije u početnom JS-u strane (ODLUKA K01-02).
 * ScrollTrigger se učitava samo gde treba (hero na početnoj, K03).
 * Ne pozivati na serveru: funkcije se koriste samo u efektima klijent komponenti.
 */
import { MEDIA } from "@/lib/motion";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerT = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let gsapPromise: Promise<Gsap> | null = null;
let scrollPromise: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerT }> | null = null;

/** GSAP core sa podrazumevanim vrednostima pokreta: tween kreće od onoga što je na ekranu. */
export function loadGsap(): Promise<Gsap> {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then(({ gsap }) => {
      gsap.defaults({ ease: "expo.out", duration: 0.22, overwrite: "auto" });
      return gsap;
    });
    // Neuspeo uvoz se ne pamti: sledeći poziv pokušava ponovo.
    gsapPromise.catch(() => {
      gsapPromise = null;
    });
  }
  return gsapPromise;
}

/** GSAP + ScrollTrigger (registrovan jednom). */
export function loadScrollTrigger(): Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerT }> {
  if (!scrollPromise) {
    scrollPromise = Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(([gsap, mod]) => {
      gsap.registerPlugin(mod.ScrollTrigger);
      mod.ScrollTrigger.config({ ignoreMobileResize: true });
      return { gsap, ScrollTrigger: mod.ScrollTrigger };
    });
    scrollPromise.catch(() => {
      scrollPromise = null;
    });
  }
  return scrollPromise;
}

/** Da li je korisnik tražio manje pokreta (čita se u trenutku poziva). */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MEDIA.reduce).matches;
}
