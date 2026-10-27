/**
 * Tekstovi ostalih strana: asortiman, o nama, kontakt i 404 (plan K01 §4).
 * K04–K06 ih dopunjuju; bez izmišljenih činjenica (P5).
 */

export const asortimanStrana = {
  meta: {
    naslov: "Asortiman delova po sistemima",
    opis: "Delovi za vozila VW grupe po sistemima: motor, kočnice, vešanje, transmisija, hlađenje, elektrika i karoserija. Pošaljite broj šasije za ponudu.",
  },
  naslov: "Asortiman",
  uvod: "Delovi za vozila VW grupe, podeljeni u deset sistema i 44 grupe. Izaberite sistem da vidite šta deo radi i kada se menja.",
  brzaNavigacija: "Sistemi delova",
  /** Napomena uz rendere: ilustracije grupa, ne fotografije artikala. */
  napomenaSlike: "Slike su 3D prikazi grupa delova, a ne fotografije konkretnih artikala.",
  /** Alt rendera u članku grupe: „3D prikaz: Kočioni diskovi“. */
  prikaz: "3D prikaz",
  // Strana sistema
  sistemNaslovSufiks: " — delovi za vozila VW grupe",
  grupeNavigacija: "Grupe delova u sistemu",
  staRadi: "Šta radi",
  kadaSeMenja: "Kada se menja",
  savet: "Savet",
  podgrupe: "Šta je u grupi",
  upitSaveti: "Šta da navedete u upitu",
  panel: {
    naslov: "Proverite deo po broju šasije",
    tekst: "Pošaljite broj šasije i šta vam treba. Proverićemo deo i javiti vam ponudu.",
    iliPozovite: "Ili pozovite",
  },
  susedni: {
    naslov: "Ostali sistemi",
    prethodni: "Prethodni sistem",
    sledeci: "Sledeći sistem",
    svi: "Svi sistemi delova",
  },
};

export const oNamaStrana = {
  meta: {
    naslov: "O nama",
    opis: "Euromotors Plus, poznat i kao OEM Parts, je veleprodaja originalnih i OEM delova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra.",
  },
  naslov: "O nama",
  uvod: "Euromotors Plus je veleprodaja originalnih i OEM delova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra. Kupci nas znaju i kao OEM Parts.",
};

/**
 * Kontakt (plan K01 §4.9). `{kanali}` u meta opisu popunjava lib/links.ts samo kanalima koji
 * imaju vrednost; rečenica o KP-u se dodaje samo kad KP link postoji (P4).
 */
export const kontaktStrana = {
  meta: {
    naslov: "Kontakt",
    opis: "Kontakt Euromotors Plus · OEM Parts, veleprodaje delova za vozila VW grupe. Javite nam se {kanali}. Za upit po delu pošaljite i broj šasije.",
    opisKp: "Ponudu pogledajte i u prodavnici na KupujemProdajem.",
  },
  kanaliMeta: ["telefon", "viber", "whatsapp", "email"] as const,
  naslov: "Kontakt",
  uvod: "Pozovite nas ili pišite. Za upit po delu pošaljite i broj šasije.",
  kanaliNaslov: "Pozovite ili pišite",
  kpVrednost: "Otvorite prodavnicu",
  upitNaslov: "Upit po broju šasije",
  upitTekst: "Upišite broj šasije i šta vam treba. Sajt sastavi poruku, a vi je pošaljete iz svoje aplikacije.",
  radnoVreme: "Radno vreme",
  adresa: "Adresa",
  firma: "Podaci firme",
  firmaPolja: { naziv: "Naziv", sediste: "Sedište", pib: "PIB", mb: "Matični broj" },
  mapa: {
    prikazi: "Prikaži mapu",
    napomena: "Mapa se učitava sa Google mapa tek kada kliknete.",
    naslov: "Mapa",
  },
  otvoriMapu: "Otvori u Google mapama",
};

export const greske = {
  nijePronadjeno: {
    meta: {
      naslov: "Stranica nije pronađena",
      opis: "Tražena stranica ne postoji. Vratite se na početnu, asortiman, upit po broju šasije ili kontakt.",
    },
    naslov: "Stranica nije pronađena",
    tekst: "Adresa je možda pogrešno upisana ili je stranica premeštena.",
    mozdaTrazite: "Možda tražite:",
    predlozi: [
      { ruta: "asortiman", oznaka: "Asortiman" },
      { ruta: "vozila", oznaka: "Marke i modeli" },
      { ruta: "kontakt", oznaka: "Kontakt" },
      { ruta: "kakoKupiti", oznaka: "Kako kupiti" },
    ] as const,
  },
};

export const stilStrana = {
  meta: { naslov: "Stil — pregled komponenti", opis: "Interni pregled komponenti sajta." },
};
