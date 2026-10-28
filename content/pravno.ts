/**
 * Pravne strane za sajt bez naloga, prodaje i kolačića, gde forma ništa ne šalje serveru
 * (plan K01 §6.5, §4.10). Podaci o firmi i kontakt se ne upisuju ovde: `blok` traži od
 * components/layout/LegalPage.tsx da ih ispiše iz content/site.ts, samo popunjene (P4).
 * Pravnu proveru radi klijent (docs/PODACI-OD-KLIJENTA.md).
 */

export type PravnaSekcija = {
  /** Sidro u sadržaju strane. */
  id: string;
  naslov: string;
  pasusi: readonly string[];
  /** Podaci o firmi i kontakt iz content/site.ts, ispod pasusa. */
  blok?: "kontakt";
};
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
  izmenjeno: "28. 10. 2026.",
  uvod: "Ovaj sajt nema naloge, ne prodaje online i ne koristi kolačiće ni analitiku. Forma za upit ništa ne šalje na server.",
  sekcije: [
    {
      id: "rukovalac",
      naslov: "Ko odgovara za podatke",
      pasusi: [
        "Podatke koje nam pošaljete porukom obrađuje vlasnik sajta Euromotors Plus · OEM Parts. Pitanja o podacima možete poslati na kontakt koji je naveden ispod.",
      ],
      blok: "kontakt",
    },
    {
      id: "sta-sajt-ne-radi",
      naslov: "Šta sajt ne radi",
      pasusi: [
        "Sajt nema korisničke naloge, ne prima porudžbine ni plaćanja i ne postavlja kolačiće. Ne koristi analitiku, alate za praćenje ni oglasne skripte.",
        "Fontovi, slike i skripte dolaze sa samog sajta, a ne sa tuđih servera.",
      ],
    },
    {
      id: "forma-za-upit",
      naslov: "Forma za upit",
      pasusi: [
        "Forma za upit po broju šasije sastavlja poruku u vašem pregledaču. Sajt tu poruku ne šalje na server i ne čuva je, a podaci koje upišete ostaju na vašem uređaju dok ih ne pošaljete.",
        "Kada izaberete Viber, WhatsApp ili mejl, tekst poruke sa podacima koje ste upisali predaje se toj aplikaciji, a poruku šaljete vi. Tek tada ona stiže do nas. Link za WhatsApp ide preko adrese wa.me, pa tekst poruke može da prođe kroz WhatsApp-ove servere već pri otvaranju. Za te servise važe njihova pravila o privatnosti.",
        "Dugme „Kopiraj poruku“ upisuje poruku u privremenu memoriju vašeg uređaja, da biste je nalepili u aplikaciju. Isto radi i dugme za Viber.",
      ],
    },
    {
      id: "koriscenje-podataka",
      naslov: "Kako koristimo poruke koje nam pošaljete",
      pasusi: [
        "Podatke iz poruke, kao što su broj šasije, opis dela, ime i telefon, koristimo samo da odgovorimo na upit i da dogovorimo ponudu. Čuvamo ih koliko je potrebno za to i koliko zakon zahteva.",
        "Podatke ne prodajemo i ne ustupamo trećim stranama radi reklame.",
      ],
    },
    {
      id: "mapa",
      naslov: "Mapa",
      pasusi: [
        "Kada je na strani Kontakt navedena adresa, mapa sa Google mapa se učitava tek kada kliknete na dugme za prikaz mape. Dok ne kliknete, vaš pregledač ne šalje ništa Google-u.",
        "Posle klika vaš pregledač se povezuje sa Google-om. Google tada dobija vašu IP adresu i tehničke podatke pregledača i može da postavi svoje kolačiće. Za to važi Google-ova politika privatnosti.",
      ],
    },
    {
      id: "hosting",
      naslov: "Hosting i tehnički podaci",
      pasusi: [
        "Server na kome je sajt može da beleži tehničke podatke o poseti, na primer IP adresu, vreme pristupa i vrstu pregledača. Služe za rad i bezbednost sajta, a vodi ih pružalac hostinga.",
      ],
    },
    {
      id: "linkovi",
      naslov: "Linkovi ka drugim sajtovima",
      pasusi: [
        "Sajt vodi na KupujemProdajem i otvara Viber, WhatsApp, mejl i Google mape. Za te servise važe njihova pravila, a mi ne odgovaramo za način na koji oni postupaju sa podacima.",
      ],
    },
    {
      id: "prava",
      naslov: "Vaša prava",
      pasusi: [
        "Po Zakonu o zaštiti podataka o ličnosti imate pravo da zatražite pristup svojim podacima, njihovu ispravku ili brisanje, ograničenje obrade, prenosivost podataka i da uložite prigovor na obradu.",
        "Zahtev pošaljite na kontakt naveden gore. Ako smatrate da se podaci obrađuju suprotno zakonu, možete podneti pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.",
      ],
    },
    {
      id: "izmene",
      naslov: "Izmene politike",
      pasusi: ["Politiku možemo da izmenimo. Važi tekst koji je objavljen na ovoj strani, sa datumom poslednje izmene na vrhu."],
    },
  ],
};

export const USLOVI_KORISCENJA: PravnaStrana = {
  meta: {
    naslov: "Uslovi korišćenja",
    opis: "Uslovi korišćenja sajta Euromotors Plus · OEM Parts: informativni sadržaj, kupovina preko KupujemProdajem ili direktnog dogovora, nazivi marki.",
  },
  naslov: "Uslovi korišćenja",
  izmenjeno: "28. 10. 2026.",
  uvod: "Sadržaj sajta je informativan. Sajt ne prodaje online, nema naloge i ne prima plaćanja.",
  sekcije: [
    {
      id: "opste",
      naslov: "Opšte",
      pasusi: [
        "Sajt Euromotors Plus · OEM Parts daje informacije o veleprodaji originalnih i OEM delova za vozila VW grupe. Korišćenjem sajta prihvatate ove uslove.",
      ],
      blok: "kontakt",
    },
    {
      id: "informativni-sadrzaj",
      naslov: "Informativni sadržaj",
      pasusi: [
        "Sajt ne navodi cene ni stanje delova, pa ništa na njemu nije obavezujuća ponuda za prodaju. Ponudu dobijate od nas, posle provere dela.",
      ],
    },
    {
      id: "kupovina",
      naslov: "Kupovina",
      pasusi: [
        "Delove kupujete preko naše prodavnice na KupujemProdajem, gde važe i pravila te platforme, ili direktno, posle dogovora sa nama. Način plaćanja, preuzimanja i slanja dogovaramo pri potvrdi dela.",
        "Sajt ne prima porudžbine ni uplate.",
      ],
    },
    {
      id: "provera-dela",
      naslov: "Provera dela",
      pasusi: [
        "Opisi delova, spisak marki i modela i saveti na sajtu su okvirni. Da li deo odgovara vašem vozilu, proveravamo po broju šasije pre ponude.",
        "Slike su 3D prikazi grupa delova, a ne fotografije konkretnih artikala.",
      ],
    },
    {
      id: "upit",
      naslov: "Upit preko sajta",
      pasusi: [
        "Forma za upit sastavlja poruku u vašem pregledaču. Poruka stiže do nas tek kada je pošaljete iz Vibera, WhatsApp-a ili mejla. Šta se dešava sa podacima, opisuje Politika privatnosti.",
      ],
    },
    {
      id: "nazivi-marki",
      naslov: "Nazivi marki",
      pasusi: [
        "Volkswagen, Audi, Škoda, SEAT i Cupra su žigovi svojih vlasnika. Nazive marki koristimo samo da označimo vozila kojima su delovi namenjeni; nismo povezani sa proizvođačima vozila. KupujemProdajem je naziv platforme koja pripada njenom vlasniku.",
      ],
    },
    {
      id: "autorska-prava",
      naslov: "Tekstovi, logo i slike",
      pasusi: [
        "Tekstovi, logo i slike sa ovog sajta ne smeju se preuzimati i objavljivati bez dozvole vlasnika sajta.",
      ],
    },
    {
      id: "linkovi",
      naslov: "Linkovi ka drugim sajtovima",
      pasusi: [
        "Sajt vodi na sajtove trećih strana, kao što su KupujemProdajem i Google mape. Ne odgovaramo za njihov sadržaj ni za pravila koja oni primenjuju.",
      ],
    },
    {
      id: "odgovornost",
      naslov: "Tačnost sadržaja",
      pasusi: [
        "Trudimo se da sadržaj bude tačan i ažuran, ali ne možemo da obećamo da nema grešaka. Pre kupovine proverite deo sa nama, po broju šasije.",
      ],
    },
    {
      id: "pravo",
      naslov: "Merodavno pravo",
      pasusi: [
        "Za korišćenje sajta važi pravo Republike Srbije. Prava koja potrošačima pripadaju po zakonu ovim uslovima se ne menjaju.",
      ],
    },
    {
      id: "izmene",
      naslov: "Izmene uslova",
      pasusi: ["Uslove možemo da izmenimo. Važi tekst objavljen na ovoj strani, sa datumom poslednje izmene na vrhu."],
    },
  ],
};

export const PRAVNO_OZNAKE = {
  izmenjeno: "Poslednja izmena:",
  sadrzaj: "Sadržaj strane",
};
