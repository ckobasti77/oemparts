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

export type MetaUlaz = {
  naslov: string;
  opis: string;
  /** Putanja sa „/“ na kraju, npr. `/asortiman/kocnice/`. */
  putanja: string;
  noindex?: boolean;
  /** Putanja OG slike u `public/` (K06); bez nje se slika ne navodi. */
  ogSlika?: string;
};

export function pageMetadata({ naslov, opis, putanja, noindex = false, ogSlika }: MetaUlaz): Metadata {
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
