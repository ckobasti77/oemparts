/**
 * Tekstovi početne strane (plan K01 §4.1). `{kanali}` popunjava lib/links.ts `popuniKanale`
 * spiskom kanala koji imaju vrednost (P4), pa rečenica nikad ne pominje kanal koji ne postoji.
 */

export const pocetna = {
  meta: {
    naslov: "Originalni i OEM delovi za VW grupu",
    opis: "Veleprodaja originalnih i OEM delova za Volkswagen, Audi, Škoda, SEAT i Cupra. Ponuda na KupujemProdajem, upit po broju šasije i direktan kontakt.",
  },
  hero: {
    naslov: "Originalni i OEM delovi za VW grupu",
    uvod: "Veleprodaja delova za Volkswagen, Audi, Škoda, SEAT i Cupra. Radimo sa servisima, automehaničarima i firmama.",
    iliPozovite: "Ili pozovite",
    natpis: "Prikaz: generički automobil, nije konkretan model.",
    altSlike: "Rendgenski prikaz automobila sa vidljivim delovima motora, vešanja i kočnica",
  },
  marke: {
    naslov: "Delovi za pet marki VW grupe",
    tekst: "Deo proveravamo po broju šasije, pa odgovara modelu i motoru vašeg vozila.",
    link: "Marke i modeli",
  },
  sistemi: {
    naslov: "Delovi po sistemima",
    uvod: "Asortiman je podeljen u deset sistema, od motora i kočnica do karoserije. Za svaku grupu delova piše šta deo radi i kada se menja.",
  },
  zasto: {
    naslov: "Zašto Euromotors Plus",
    uvod: "Bavimo se delovima za vozila VW grupe: Volkswagen, Audi, Škoda, SEAT i Cupra.",
    stavke: [
      {
        naslov: "Originalni i OEM delovi",
        tekst: "Nudimo originalne delove i OEM delove, koje prave proizvođači što delove isporučuju i fabrikama vozila.",
      },
      {
        naslov: "Provera po broju šasije",
        tekst: "Pre ponude proveravamo da li deo odgovara vozilu, po broju šasije.",
      },
      {
        naslov: "Veleprodaja za servise i firme",
        tekst: "Radimo sa servisima, automehaničarima i firmama koje redovno nabavljaju delove.",
      },
      {
        naslov: "Kupovina kako vam odgovara",
        tekst: "Preko naše prodavnice na KupujemProdajem ili direktno: {kanali}.",
      },
    ],
  },
  kako: { naslov: "Kako kupiti", link: "Koraci i česta pitanja" },
  saradnja: {
    naslov: "Saradnja za servise i firme",
    tekst: "Euromotors Plus je registrovan kao veleprodaja. Sa servisima, automehaničarima i firmama dogovaramo nabavku delova: pošaljete upit, dobijete ponudu, a deo preuzimate ili vam ga šaljemo, uz račun.",
    link: "Kako izgleda saradnja",
  },
  upit: {
    naslov: "Ne znate tačan broj dela?",
    tekst: "Pošaljite broj šasije i opišite šta vam treba. Sajt sastavi poruku, a vi je šaljete preko {kanali}.",
    napomena: "Broj šasije (VIN) ima 17 znakova. Nalazi se u saobraćajnoj dozvoli, u polju E.",
  },
  kp: {
    naslov: "Naša prodavnica na KupujemProdajem",
    tekst: "Delove iz ponude pogledajte u našoj prodavnici na KupujemProdajem. Za deo koji ne nađete, pošaljite upit.",
  },
  kontakt: {
    naslov: "Kontakt",
    tekst: "Pozovite nas ili pišite. Za upit po delu pošaljite i broj šasije.",
  },
  /** Kanali u rečenicama sa `{kanali}`: „Zašto“ (d) nabraja sve, upit samo one za slanje poruke. */
  kanaliZasto: ["telefon", "viber", "whatsapp", "email"] as const,
  kanaliUpit: ["viber", "whatsapp", "email"] as const,
};
