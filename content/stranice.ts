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
  sta: {
    naslov: "Šta radimo",
    /** `{kanali}` popunjava lib/links.ts samo kanalima koji imaju vrednost (P4). */
    pasusi: [
      "Euromotors Plus je registrovan kao veleprodaja. Nabavljamo i prodajemo delove za vozila VW grupe, od motora i kočnica do elektrike i karoserije. Radimo sa servisima, automehaničarima i firmama.",
      "Ponudu možete da pogledate u našoj prodavnici na KupujemProdajem. Ako deo ne nađete ili niste sigurni šta vam treba, pošaljite broj šasije. Možete nam se javiti i direktno: {kanali}.",
    ],
    kanali: ["telefon", "viber", "whatsapp", "email"] as const,
  },
  pojmovi: {
    naslov: "Originalni, OEM i zamenski delovi",
    uvod: "Na tržištu se za isti deo nude tri vrste. Razlika je u tome ko ga pravi i u čijem pakovanju stiže.",
    stavke: [
      { izraz: "Originalni deo", tekst: "Stiže u pakovanju proizvođača vozila i nosi njegovu oznaku." },
      {
        izraz: "OEM deo",
        tekst: "Pravi ga proizvođač koji isti deo isporučuje i fabrici vozila, ali ga prodaje u svom pakovanju.",
      },
      {
        izraz: "Zamenski deo",
        tekst: "Pravi ga proizvođač koji deo ne isporučuje fabrici vozila. Kvalitet zavisi od proizvođača.",
      },
    ],
    zasto:
      "Deo napravljen po specifikaciji proizvođača vozila treba da staje bez prepravki i da radi onako kako je vozilo projektovano.",
    zakljucak: "Mi nudimo originalne i OEM delove.",
  },
  kako: {
    naslov: "Kako radimo",
    stavke: [
      {
        naslov: "Provera po broju šasije",
        tekst: "Pre ponude proveravamo da li deo odgovara vozilu, po broju šasije.",
      },
      {
        naslov: "Prodavnica na KupujemProdajem",
        tekst: "Ponudu pogledajte u našoj prodavnici i kupite preko te platforme.",
      },
      {
        naslov: "Direktan dogovor",
        tekst: "Servisi i firme sa nama dogovaraju nabavku direktno. Deo koji ne nađete zatražite upitom.",
      },
    ],
  },
  panelNaslov: "Kontakt",
  cta: {
    naslov: "Tražite deo za vozilo VW grupe?",
    tekst: "Pošaljite broj šasije i šta vam treba. Proverićemo deo i javiti vam ponudu.",
  },
};

/**
 * Kontakt (plan K01 §4.9). `{kanali}` u meta opisu popunjava lib/links.ts samo kanalima koji
 * imaju vrednost; rečenica o KP-u se dodaje samo kad KP link postoji (P4).
 */
export const kontaktStrana = {
  meta: {
    naslov: "Kontakt",
    opis: "Kontakt Euromotors Plus · OEM Parts. Javite nam se {kanali}. Za deo pošaljite broj šasije.",
    opisKp: "Ponuda je i na KupujemProdajem.",
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
