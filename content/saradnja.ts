/** Saradnja za servise i firme (O6; plan K01 §4.6). Bez obećanja popusta i rokova (P5). */

import type { Korak, Pitanje } from "./kupovina";

export const saradnjaStrana = {
  meta: {
    naslov: "Saradnja za servise i firme",
    opis: "Veleprodaja delova za servise, automehaničare i firme: upit, ponuda, preuzimanje ili slanje i račun. Delovi za vozila VW grupe.",
  },
  naslov: "Saradnja za servise i firme",
  uvod: "Euromotors Plus je veleprodaja delova za vozila VW grupe. Sa servisima, automehaničarima i firmama dogovaramo redovnu nabavku delova.",
  koraciNaslov: "Kako izgleda saradnja",
  staPoslatiNaslov: "Šta da nam pošaljete",
  komeNaslov: "Kome je namenjeno",
  pitanjaNaslov: "Česta pitanja",
  cta: {
    naslov: "Pošaljite prvi upit",
    tekst: "Pošaljite broj šasije ili listu delova. Proverićemo delove i javiti vam ponudu.",
  },
};

export const KORACI_SARADNJE: readonly Korak[] = [
  { naslov: "Upit", tekst: "Šaljete broj šasije ili listu delova koji vam trebaju." },
  { naslov: "Ponuda", tekst: "Proveravamo delove i javljamo vam ponudu." },
  { naslov: "Preuzimanje ili slanje", tekst: "Delove preuzimate lično ili vam ih šaljemo." },
  { naslov: "Račun", tekst: "Za firme izdajemo račun na podatke firme." },
];

export const STA_POSLATI: readonly string[] = [
  "Broj šasije ili marku, model i godište vozila",
  "Koji deo vam treba ili opis kvara",
  "Za račun na firmu: naziv, PIB i adresu firme",
];

export const KOME: readonly string[] = ["Autoservisi", "Automehaničari", "Firme sa sopstvenim vozilima"];

export const FAQ_SARADNJA: readonly Pitanje[] = [
  {
    pitanje: "Da li radite sa firmama?",
    odgovor: "Da. Euromotors Plus je registrovan kao veleprodaja i radi sa servisima i firmama.",
  },
  {
    pitanje: "Kako dobijam ponudu?",
    odgovor: "Pošaljite upit sa brojem šasije ili nas pozovite.",
  },
  {
    pitanje: "Mogu li da pošaljem više delova odjednom?",
    odgovor: "Da. Pošaljite listu delova i broj šasije za svako vozilo, pa vam javljamo ponudu za sve delove.",
  },
  {
    pitanje: "Da li postoje posebni uslovi za stalne saradnike?",
    odgovor: "Uslove dogovaramo direktno. Pozovite nas ili pošaljite upit.",
  },
];
