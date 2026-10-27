/**
 * Navigacija, oznake poziva na akciju i tekstovi za čitače ekrana. Rute su u lib/routes.ts;
 * ovde su samo tekstovi i ključevi ruta.
 */

export type KljucRute =
  | "pocetna"
  | "asortiman"
  | "vozila"
  | "upit"
  | "saradnja"
  | "oNama"
  | "kakoKupiti"
  | "kontakt"
  | "privatnost"
  | "uslovi";

export type NavStavka = { ruta: KljucRute; oznaka: string };

/** Header (od 1280 px). */
export const GLAVNA_NAVIGACIJA: readonly NavStavka[] = [
  { ruta: "asortiman", oznaka: "Asortiman" },
  { ruta: "vozila", oznaka: "Vozila" },
  { ruta: "upit", oznaka: "Upit po šasiji" },
  { ruta: "saradnja", oznaka: "Saradnja" },
  { ruta: "kontakt", oznaka: "Kontakt" },
];

/** Meni na telefonu i footer kolona „Informacije“. */
export const MENI: readonly NavStavka[] = [
  { ruta: "asortiman", oznaka: "Asortiman" },
  { ruta: "vozila", oznaka: "Vozila" },
  { ruta: "upit", oznaka: "Upit po šasiji" },
  { ruta: "saradnja", oznaka: "Saradnja" },
  { ruta: "kakoKupiti", oznaka: "Kako kupiti" },
  { ruta: "oNama", oznaka: "O nama" },
  { ruta: "kontakt", oznaka: "Kontakt" },
];

export const PRAVNO: readonly NavStavka[] = [
  { ruta: "privatnost", oznaka: "Politika privatnosti" },
  { ruta: "uslovi", oznaka: "Uslovi korišćenja" },
];

/** Oznake poziva na akciju. */
export const CTA = {
  kp: "Ponuda na KupujemProdajem",
  kpOtvori: "Otvorite prodavnicu na KupujemProdajem",
  upit: "Pošaljite upit",
  upitSasija: "Pošaljite broj šasije",
  pozovite: "Pozovite",
  asortiman: "Ceo asortiman",
  pocetna: "Na početnu",
  kontaktSve: "Svi podaci za kontakt",
  pitajteZaDeo: "Pitajte za ovaj deo",
  sveOSistemu: "Sve o sistemu",
};

/** Oznake kanala za kontakt. */
export const KANALI = {
  telefon: "Telefon",
  viber: "Viber",
  whatsapp: "WhatsApp",
  email: "E-pošta",
  kp: "KupujemProdajem",
};

/** Tekstovi za pomoćne tehnologije i navigaciju. */
export const ARIA = {
  preskoci: "Preskoči na sadržaj",
  glavnaNavigacija: "Glavna navigacija",
  podnozje: "Podnožje",
  pravno: "Pravne informacije",
  brzeAkcije: "Brze akcije",
  putanja: "Putanja",
  meni: "Meni",
  zatvoriMeni: "Zatvori meni",
  noviProzor: "(otvara se u novom prozoru)",
  pocetnaLogo: "Euromotors Plus — početna",
  pocetna: "Početna",
};

export const FOOTER = {
  opis: "Veleprodaja originalnih i OEM delova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra.",
  asortiman: "Asortiman",
  informacije: "Informacije",
  kontakt: "Kontakt",
  zigovi:
    "Volkswagen, Audi, Škoda, SEAT i Cupra su žigovi svojih vlasnika. Nazive marki koristimo samo da označimo vozila kojima su delovi namenjeni; Euromotors Plus nije povezan sa proizvođačima vozila niti je njihov ovlašćeni zastupnik. KupujemProdajem je žig svog vlasnika.",
};
