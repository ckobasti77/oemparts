"use client";

import { useEffect } from "react";

/**
 * Sažimanje header-a (ODLUKA K01-04): IntersectionObserver prati `[data-header-sentinel]`
 * (24 px na vrhu dokumenta) i postavlja `data-condensed` na header. Bez scroll listenera i bez
 * GSAP-a; prelaz radi CSS (`.header-surface`, `.header-logo` u globals.css). Bez JS-a header ima
 * punu podlogu (`@media (scripting: none)`).
 */
export function HeaderState({ headerId }: { headerId: string }): null {
  useEffect(() => {
    const header = document.getElementById(headerId);
    const sentinel = document.querySelector("[data-header-sentinel]");
    if (!header || !sentinel) return;
    const io = new IntersectionObserver(([e]) => {
      header.dataset.condensed = e.isIntersecting ? "false" : "true";
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [headerId]);
  return null;
}
