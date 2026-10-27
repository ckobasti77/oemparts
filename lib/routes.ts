/**
 * Rute sajta. Interni linkovi uvek sa „/“ na kraju (trailingSlash: true) i samo odavde.
 */
import { SISTEMI, type SistemSlug } from "@/content/asortiman";
import type { KljucRute } from "@/content/navigacija";

export const RUTE: Record<KljucRute | "stil", string> = {
  pocetna: "/",
  asortiman: "/asortiman/",
  vozila: "/vozila/",
  upit: "/upit/",
  saradnja: "/saradnja/",
  oNama: "/o-nama/",
  kakoKupiti: "/kako-kupiti/",
  kontakt: "/kontakt/",
  privatnost: "/politika-privatnosti/",
  uslovi: "/uslovi-koriscenja/",
  stil: "/stil/",
};

export function sistemRuta(slug: SistemSlug): string {
  return `/asortiman/${slug}/`;
}

export function grupaRuta(sistem: SistemSlug, grupa: string): string {
  return `${sistemRuta(sistem)}#${grupa}`;
}

/** Upit sa unapred popunjenim delom (`/upit/?deo=kocioni-diskovi`). */
export function upitZaDeo(grupa: string): string {
  return `${RUTE.upit}?deo=${encodeURIComponent(grupa)}`;
}

export function markaRuta(marka: string): string {
  return `${RUTE.vozila}#${marka}`;
}

/** Sve javne strane (20): ulaze u sitemap i u proveru `check:site`. */
export function javneRute(): string[] {
  return [
    RUTE.pocetna,
    RUTE.asortiman,
    ...SISTEMI.map((s) => sistemRuta(s.slug)),
    RUTE.vozila,
    RUTE.upit,
    RUTE.saradnja,
    RUTE.oNama,
    RUTE.kakoKupiti,
    RUTE.kontakt,
    RUTE.privatnost,
    RUTE.uslovi,
  ];
}
