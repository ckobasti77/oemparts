/** Kako kupiti: koraci i česta pitanja (plan K01 §4.8, §6.5). Bez rokova, cena i garancija (P5). */

export type KanalOdgovora = "telefon" | "viber" | "whatsapp" | "email";
/**
 * `{kanali}` u odgovoru popunjava lib/links.ts `popuniPitanja` kanalima iz `kanali` koji imaju
 * vrednost (P4); rečenica bez ijednog takvog kanala se izostavlja.
 */
export type Pitanje = { pitanje: string; odgovor: string; kanali?: readonly KanalOdgovora[] };
export type Korak = { naslov: string; tekst: string };

export const kupovinaStrana = {
  meta: {
    naslov: "Kako kupiti delove",
    opis: "Kako se kupuju delovi kod Euromotors Plus: ponuda na KupujemProdajem ili upit po broju šasije, potvrda dela i preuzimanje ili slanje.",
  },
  naslov: "Kako kupiti",
  uvod: "Delove ne prodajemo direktno na sajtu. Kupujete ih preko naše prodavnice na KupujemProdajem ili direktno, posle dogovora.",
  pitanjaNaslov: "Česta pitanja",
};

export const KORACI_KUPOVINE: readonly Korak[] = [
  {
    naslov: "Pronađite deo ili pošaljite upit",
    tekst: "Pogledajte ponudu na KupujemProdajem ili nam pošaljite broj šasije i šta vam treba.",
  },
  {
    naslov: "Potvrđujemo deo po broju šasije",
    tekst: "Proveravamo da li deo odgovara vašem vozilu i javljamo vam ponudu.",
  },
  {
    naslov: "Preuzimanje ili slanje",
    tekst: "Deo preuzimate lično ili vam ga šaljemo. Način i cenu slanja dogovaramo pre slanja.",
  },
];

export const FAQ_KUPOVINA: readonly Pitanje[] = [
  {
    pitanje: "Da li mogu da kupim deo direktno na sajtu?",
    odgovor:
      "Ne. Sajt ne prodaje online. Delove kupujete preko naše prodavnice na KupujemProdajem. Možete ih kupiti i direktno, posle dogovora {kanali}.",
    kanali: ["telefon", "viber", "whatsapp", "email"],
  },
  {
    pitanje: "Kako da budem siguran da deo odgovara mom vozilu?",
    odgovor: "Pošaljite broj šasije. Pre ponude proveravamo deo po broju šasije.",
  },
  {
    pitanje: "Gde se nalazi broj šasije?",
    odgovor:
      "U saobraćajnoj dozvoli, u polju E. Na vozilu je utisnut ispod vetrobranskog stakla, sa strane vozača. Ima 17 znakova i ne sadrži slova I, O i Q.",
  },
  {
    pitanje: "Koja je razlika između originalnog i OEM dela?",
    odgovor:
      "Originalni deo dolazi u pakovanju proizvođača vozila. OEM deo pravi proizvođač koji isti deo isporučuje i fabrici, ali u svom pakovanju.",
  },
  {
    pitanje: "Kako se plaća i preuzima deo?",
    odgovor:
      "Način plaćanja, preuzimanja i slanja dogovaramo pri potvrdi dela. Kada kupujete preko KupujemProdajem, važe i pravila te platforme.",
  },
  {
    pitanje: "Da li šaljete delove?",
    odgovor: "Da. Deo možete preuzeti lično ili vam ga šaljemo. Način i cenu slanja dogovaramo pri potvrdi dela.",
  },
  {
    pitanje: "Šta ako deo ne odgovara?",
    odgovor: "Pre kupovine proverite deo po broju šasije. Za povrat ili reklamaciju javite nam se {kanali}.",
    kanali: ["telefon", "email"],
  },
];
