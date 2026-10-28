/**
 * Upit po broju šasije (P2): oznake, pomoć, poruke grešaka i napomene (plan K01 §7).
 * Sajt sastavlja poruku u pregledaču; ništa se ne šalje na server i ništa se ne čuva.
 */

/**
 * `{kanali}` popunjava lib/links.ts (`popuniKanale`) samo kanalima koji imaju vrednost (P4):
 * u meta opisu u instrumentalu („Viberom ili mejlom“), u uvodu u genitivu („preko Vibera…“).
 */
export const upitStrana = {
  meta: {
    naslov: "Upit po broju šasije (VIN)",
    opis: "Pošaljite broj šasije (VIN) i šta vam treba. Sajt sastavi poruku, a vi je šaljete {kanali}. Ništa se ne šalje sa sajta i ne čuva.",
  },
  naslov: "Upit po broju šasije",
  uvod: "Upišite broj šasije i šta vam treba. Sajt sastavi poruku, a vi je pošaljete preko {kanali}.",
  /** Kanali kojima se poruka šalje (telefon nije, jer poruku ne nosi). */
  kanali: ["viber", "whatsapp", "email"] as const,
  privatnostNaslov: "Bez slanja sa sajta",
  privatnost: "Sajt ništa ne šalje i ne čuva. Poruka ide samo preko aplikacije koju izaberete.",
};

export const UPIT_POLJA = {
  vozilo: "Vozilo",
  vin: "Broj šasije (VIN)",
  vinPomoc: "17 znakova, bez slova I, O i Q.",
  /** Brojač ispod polja: „12 / 17“. */
  brojac: "{n} / {max}",
  vozilo_ili: "Ako nemate broj šasije, izaberite marku i upišite model.",
  marka: "Marka",
  markaIzaberite: "Izaberite marku",
  markaDruga: "Druga marka",
  model: "Model",
  potreba: "Šta vam treba",
  deo: "Deo ili opis kvara",
  deoPomoc: "Naziv dela, strana (levo ili desno, napred ili nazad), kvar ili broj sa starog dela.",
  napomena: "Napomena",
  napomenaPomoc: "Na primer: motor, godište ili šta ste već menjali.",
  neobavezno: "(neobavezno)",
  kontakt: "Kontakt",
  ime: "Ime i prezime ili naziv servisa",
  telefon: "Telefon",
  telefonPomoc: "Sa pozivnim brojem, na primer 06x xxx xxxx.",
  sastavi: "Sastavi poruku",
  sastaviPomoc: "Poruka se sastavlja ovde, u pregledaču. Ništa se još ne šalje.",
};

export const UPIT_GRESKE = {
  sazetak: "Proverite označena polja",
  sazetakTekst: "Poruka nije sastavljena. Ispravite polja sa spiska:",
  imePrazno: "Upišite ime i prezime ili naziv servisa.",
  imeKratko: "Ime je prekratko. Upišite najmanje 2 znaka.",
  telefonPrazno: "Upišite broj telefona.",
  telefonNeispravan: "Broj telefona nije ispravan. Proverite pozivni broj i cifre.",
  voziloPrazno: "Upišite broj šasije ili izaberite marku i upišite model.",
  vinDuzina: "Broj šasije ima 17 znakova. Upisano je {n}.",
  vinIoq: "Broj šasije ne sadrži slova I, O ni Q.",
  vinPredlog: "Da li ste mislili na {predlog}?",
  /** Dugme ispod polja kad postoji predlog: upisuje ispravljen broj. */
  vinPrimeni: "Upiši {predlog}",
  vinZnakovi: "Broj šasije sadrži samo slova A–Z i cifre 0–9.",
  modelPrazno: "Upišite model vozila.",
  deoPrazno: "Napišite koji deo vam treba ili opišite kvar.",
  predugo: "Tekst je predug. Najviše {max} znakova.",
};

export const UPIT_PORUKA = {
  zaglavlje: "Upit sa sajta Euromotors Plus · OEM Parts",
  ime: "Ime",
  telefon: "Telefon",
  vin: "Broj šasije",
  vozilo: "Vozilo",
  deo: "Deo",
  napomena: "Napomena",
  naslovVin: "Upit po broju šasije: {vin}",
  naslovVozilo: "Upit: {vozilo}",
  naslovOpsti: "Upit po broju šasije",
};

export const UPIT_SLANJE = {
  naslov: "Vaša poruka",
  posaljite: "Izaberite aplikaciju",
  viber: "Pošalji na Viber",
  whatsapp: "Pošalji na WhatsApp",
  mejl: "Pošalji mejlom",
  kopiraj: "Kopiraj poruku",
  kopirano: "Poruka je kopirana.",
  nijeKopirano: "Kopiranje nije uspelo. Označite tekst poruke i kopirajte ga ručno.",
  viberNapomena: "Poruka je kopirana. Ako se ne pojavi u Viberu, nalepite je u razgovor.",
  objasnjenje:
    "Klikom se otvara aplikacija na vašem telefonu ili računaru, obično sa porukom spremnom za slanje. Sajt ništa ne šalje i ne čuva — poruku šaljete vi.",
  izmena: "Ako izmenite polja, poruka i linkovi se odmah menjaju.",
  /** `{kanali}`: svi kanali sa vrednošću, u instrumentalu. */
  bezJs: "Za sastavljanje poruke potreban je JavaScript. Javite nam se direktno {kanali}.",
};

export const VIN_POMOC = {
  naslov: "Gde je broj šasije?",
  stavke: [
    "U saobraćajnoj dozvoli, u polju E.",
    "Na vozilu je utisnut ispod vetrobranskog stakla, sa strane vozača.",
  ],
  /** Crtež: oznake na saobraćajnoj dozvoli i vetrobranu (dekorativno, tekst nosi informaciju). */
  crtez: { dozvola: "Saobraćajna dozvola", polje: "E", vetrobran: "Ispod vetrobrana, strana vozača" },
  posleNaslov: "Šta se dešava posle",
  posle: [
    "Poruku šaljete iz svoje aplikacije.",
    "Proveravamo deo po broju šasije.",
    "Javljamo vam ponudu.",
  ],
};

/** Ograničenja dužine polja (zbir drži poruku ispod 1600 znakova). */
export const UPIT_LIMITI = { ime: 80, model: 60, deo: 500, napomena: 500 };
