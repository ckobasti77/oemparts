/**
 * Metadata po strani (plan K01 §8.1): naslov sa sufiksom brenda u 60 znakova, opis, canonical
 * sa „/“ na kraju, Open Graph i Twitter. Next spaja metadata plitko, zato svaka strana dobija
 * ceo objekat.
 */
import type { Metadata } from "next";

import { site } from "@/content/site";

export const NASLOV_MAX = 60;
const SUFIKS_PUN = ` | ${site.brend.lockup}`;
const SUFIKS_KRATAK = ` | ${site.brend.ime}`;

/**
 * Naslov sa sufiksom: „ | Euromotors Plus · OEM Parts“ ako sve staje u 60 znakova, inače
 * „ | Euromotors Plus“, inače bez sufiksa (naslov se nikad ne seče da bi sufiks stao).
 */
export function naslovStrane(naslov: string): string {
  const cist = naslov.replace(/\s+/g, " ").trim();
  for (const sufiks of [SUFIKS_PUN, SUFIKS_KRATAK]) {
    if (cist.length + sufiks.length <= NASLOV_MAX) return `${cist}${sufiks}`;
  }
  return cist;
}

/** Apsolutni URL na domenu sajta. */
export function apsolutniUrl(putanja: string): string {
  return new URL(putanja, site.domen).href;
}

/** Strane sa sopstvenom OG slikom (public/og/<segment>.png); sve ostale javne strane koriste `opste`. */
const OG_SEGMENTI = ["vozila", "upit", "saradnja", "o-nama", "kako-kupiti", "kontakt"];

/**
 * OG slika strane (statični PNG 1200×630 u public/og/, pravi ga scripts/og.mjs):
 * `/` → pocetna, `/asortiman/` → asortiman, `/asortiman/<s>/` → asortiman-<s>, ostale strane
 * iz plana → ime segmenta, pravne strane i ostalo → opste.
 */
export function ogSlikaZa(putanja: string): string {
  const segmenti = putanja.split("/").filter(Boolean);
  let ime = "opste";
  if (segmenti.length === 0) ime = "pocetna";
  else if (segmenti[0] === "asortiman" && segmenti.length <= 2) ime = segmenti.join("-");
  else if (segmenti.length === 1 && OG_SEGMENTI.includes(segmenti[0])) ime = segmenti[0];
  return `/og/${ime}.png`;
}

export type MetaUlaz = {
  naslov: string;
  opis: string;
  /** Putanja sa „/“ na kraju, npr. `/asortiman/kocnice/`. */
  putanja: string;
  noindex?: boolean;
  /** Putanja OG slike u `public/`; podrazumevano `ogSlikaZa(putanja)`. */
  ogSlika?: string;
};

export function pageMetadata({
  naslov,
  opis,
  putanja,
  noindex = false,
  ogSlika = ogSlikaZa(putanja),
}: MetaUlaz): Metadata {
  const title = naslovStrane(naslov);
  const slike = ogSlika ? [{ url: ogSlika, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title: { absolute: title },
    description: opis,
    alternates: { canonical: putanja },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: site.brend.ime,
      locale: site.locale,
      url: putanja,
      title,
      description: opis,
      ...(slike ? { images: slike } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: opis,
      ...(slike ? { images: slike.map((s) => s.url) } : {}),
    },
  };
}
