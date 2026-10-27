/**
 * JSON-LD graditelji (plan K01 §8.3). Samo popunjena polja; vrednosti samo iz content/site.ts.
 * Prikazuje ih components/layout/JsonLd.tsx.
 */
import { site } from "@/content/site";
import type { Pitanje } from "@/content/kupovina";
import { kpHref, kpJeGenericki } from "@/lib/links";
import { normalizePhone } from "@/lib/format";
import { apsolutniUrl, ogSlikaZa } from "@/lib/seo";

export type JsonLd = Record<string, unknown>;

const KONTEKST = "https://schema.org";

/** Izbacuje prazne vrednosti (prazan string, null, undefined, prazan niz). */
export function sazmi<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0),
    ),
  ) as T;
}

/** JSON za `<script type="application/ld+json">`, sa `<` zamenjenim (vodič json-ld.md). */
export function serijalizuj(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type Mrvica = { naziv: string; putanja: string };

export function breadcrumbLd(mrvice: readonly Mrvica[]): JsonLd {
  return {
    "@context": KONTEKST,
    "@type": "BreadcrumbList",
    itemListElement: mrvice.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.naziv,
      item: apsolutniUrl(m.putanja),
    })),
  };
}

export function websiteLd(): JsonLd {
  return sazmi({
    "@context": KONTEKST,
    "@type": "WebSite",
    name: site.brend.ime,
    alternateName: site.brend.drugoIme,
    url: apsolutniUrl("/"),
    inLanguage: site.jezik,
  });
}

const DANI_SCHEMA: Record<string, string> = {
  pon: "Monday",
  uto: "Tuesday",
  sre: "Wednesday",
  cet: "Thursday",
  pet: "Friday",
  sub: "Saturday",
  ned: "Sunday",
};

type ProdavnicaUlaz = {
  adresa: { ulica: string; postanskiBroj: string; mesto: string };
  firma: { naziv: string };
  kontakt: { telefon: string; email: string };
  radnoVreme: typeof site.radnoVreme;
  kpUrl: string;
  slika?: string;
};

/**
 * Firma: `AutoPartsStore` kad postoje ulica i mesto, inače `Organization` (ODLUKA K01-14).
 * `sameAs` sadrži KP link samo kad nije generička početna strana platforme (K01-15).
 */
export function prodavnicaLd(ulaz: ProdavnicaUlaz = {
  adresa: site.adresa,
  firma: site.firma,
  kontakt: site.kontakt,
  radnoVreme: site.radnoVreme,
  kpUrl: site.kp.url,
  slika: ogSlikaZa("/"),
}): JsonLd {
  const imaAdresu = Boolean(ulaz.adresa.ulica.trim() && ulaz.adresa.mesto.trim());
  const kp = kpHref(ulaz.kpUrl);
  const email = ulaz.kontakt.email.trim();
  return sazmi({
    "@context": KONTEKST,
    "@type": imaAdresu ? "AutoPartsStore" : "Organization",
    "@id": `${apsolutniUrl("/")}#organizacija`,
    name: site.brend.ime,
    alternateName: site.brend.drugoIme,
    legalName: ulaz.firma.naziv.trim() || undefined,
    url: apsolutniUrl("/"),
    logo: apsolutniUrl("/images/brand/icon-512.png"),
    image: ulaz.slika ? apsolutniUrl(ulaz.slika) : undefined,
    telephone: normalizePhone(ulaz.kontakt.telefon) ?? undefined,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
    address: imaAdresu
      ? sazmi({
          "@type": "PostalAddress",
          streetAddress: ulaz.adresa.ulica.trim(),
          postalCode: ulaz.adresa.postanskiBroj.trim(),
          addressLocality: ulaz.adresa.mesto.trim(),
          addressCountry: "RS",
        })
      : undefined,
    openingHoursSpecification: ulaz.radnoVreme.map((r) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: r.dani.map((d) => DANI_SCHEMA[d]),
      opens: r.od,
      closes: r.do,
    })),
    sameAs: kp && !kpJeGenericki(ulaz.kpUrl) ? [kp] : [],
  });
}

export function faqLd(pitanja: readonly Pitanje[]): JsonLd {
  return {
    "@context": KONTEKST,
    "@type": "FAQPage",
    mainEntity: pitanja.map((p) => ({
      "@type": "Question",
      name: p.pitanje,
      acceptedAnswer: { "@type": "Answer", text: p.odgovor },
    })),
  };
}
