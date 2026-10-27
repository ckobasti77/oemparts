/**
 * Brend, kontakt i firma — JEDINI izvor (P4). Prazna vrednost znači da se kanal ili blok
 * ne prikazuje nigde na sajtu. PLACEHOLDERS su privremene vrednosti dok klijent ne pošalje
 * prave podatke (docs/PODACI-OD-KLIJENTA.md); `npm run check:site` ih ispisuje kao upozorenje.
 * Fajl nema importe i koristi samo brisivu TS sintaksu (scripts/ ga učitavaju direktno).
 */

export type Dan = "pon" | "uto" | "sre" | "cet" | "pet" | "sub" | "ned";

/** Jedan red radnog vremena, npr. { dani: ["pon", "uto", "sre", "cet", "pet"], od: "08:00", do: "16:00" }. */
export type RadnoVreme = { dani: readonly Dan[]; od: string; do: string };

export const site = {
  brend: {
    ime: "Euromotors Plus",
    drugoIme: "OEM Parts",
    lockup: "Euromotors Plus · OEM Parts",
    kratko: "Euromotors",
  },
  /** Domen bez kose crte na kraju; koristi se za canonical, sitemap i OG. */
  domen: "https://www.example.com",
  jezik: "sr-Latn",
  locale: "sr_RS",
  /** Boja trake pregledača i manifesta; ista kao --color-bg. */
  temaBoja: "#0d0f11",
  opis: "Veleprodaja originalnih i OEM delova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra.",
  marke: ["Volkswagen", "Audi", "Škoda", "SEAT", "Cupra"],
  kontakt: {
    telefon: "+381 60 000 0000",
    viber: "+381 60 000 0000",
    whatsapp: "+381 60 000 0000",
    email: "info@example.com",
  },
  radnoVreme: [] as readonly RadnoVreme[],
  adresa: { ulica: "", postanskiBroj: "", mesto: "", mapaUpit: "" },
  firma: { naziv: "", pib: "", mb: "", sediste: "" },
  kp: { url: "https://www.kupujemprodajem.com/", naziv: "KupujemProdajem" },
} as const;

export const PLACEHOLDERS = [
  { polje: "site.domen", vrednost: "https://www.example.com", opis: "Domen sajta (canonical, sitemap, OG)" },
  { polje: "site.kontakt.telefon", vrednost: "+381 60 000 0000", opis: "Telefon" },
  { polje: "site.kontakt.viber", vrednost: "+381 60 000 0000", opis: "Viber broj" },
  { polje: "site.kontakt.whatsapp", vrednost: "+381 60 000 0000", opis: "WhatsApp broj" },
  { polje: "site.kontakt.email", vrednost: "info@example.com", opis: "Mejl" },
  { polje: "site.kp.url", vrednost: "https://www.kupujemprodajem.com/", opis: "Link KP prodavnice" },
] as const;
