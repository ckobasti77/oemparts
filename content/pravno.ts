/**
 * Pravne strane za sajt bez naloga, prodaje i kolačića (plan K01 §6.5). K06 ih dovršava;
 * pravnu proveru radi klijent (docs/PODACI-OD-KLIJENTA.md).
 */

export type PravnaSekcija = { naslov: string; pasusi: readonly string[] };
export type PravnaStrana = {
  meta: { naslov: string; opis: string };
  naslov: string;
  izmenjeno: string;
  uvod: string;
  sekcije: readonly PravnaSekcija[];
};

export const POLITIKA_PRIVATNOSTI: PravnaStrana = {
  meta: {
    naslov: "Politika privatnosti",
    opis: "Kako sajt Euromotors Plus postupa sa podacima: bez naloga, kolačića i analitike. Forma za upit ništa ne šalje na server i ništa ne čuva.",
  },
  naslov: "Politika privatnosti",
  izmenjeno: "27. 10. 2026.",
  uvod: "Ovaj sajt nema naloge, ne prodaje online i ne koristi kolačiće ni analitiku.",
  sekcije: [
    {
      naslov: "Forma za upit",
      pasusi: [
        "Forma za upit po broju šasije sastavlja poruku u vašem pregledaču. Sajt tu poruku ne šalje na server i ne čuva je.",
        "Kada izaberete Viber, WhatsApp ili mejl, poruku šaljete vi, iz te aplikacije. Za te servise važe njihova pravila o privatnosti.",
      ],
    },
    {
      naslov: "Mapa",
      pasusi: ["Mapa na strani Kontakt učitava Google mape tek kada kliknete na dugme za prikaz mape."],
    },
  ],
};

export const USLOVI_KORISCENJA: PravnaStrana = {
  meta: {
    naslov: "Uslovi korišćenja",
    opis: "Uslovi korišćenja sajta Euromotors Plus · OEM Parts: informativni sadržaj, kupovina preko KupujemProdajem ili direktnog dogovora, nazivi marki.",
  },
  naslov: "Uslovi korišćenja",
  izmenjeno: "27. 10. 2026.",
  uvod: "Sadržaj sajta je informativan. Sajt ne prodaje online.",
  sekcije: [
    {
      naslov: "Kupovina",
      pasusi: [
        "Delove kupujete preko naše prodavnice na KupujemProdajem, gde važe i pravila te platforme, ili direktno, posle dogovora.",
      ],
    },
    {
      naslov: "Nazivi marki",
      pasusi: [
        "Volkswagen, Audi, Škoda, SEAT i Cupra su žigovi svojih vlasnika. Nazive marki koristimo samo da označimo vozila kojima su delovi namenjeni; nismo povezani sa proizvođačima vozila.",
      ],
    },
  ],
};

export const PRAVNO_OZNAKE = { izmenjeno: "Poslednja izmena:" };
