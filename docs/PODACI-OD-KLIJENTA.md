# Podaci od klijenta — šta treba poslati ili potvrditi

Sajt koristi privremene vrednosti dok klijent ne pošalje prave podatke (P4). Kontakt i firma se menjaju u jednom fajlu, `content/site.ts`. Tekstovi su u ostalim fajlovima u `content/`. Prazno polje znači da se taj podatak nigde ne prikazuje. `npm run check:site` (posle `npm run build`) ispisuje privremene vrednosti kao upozorenje.

Pravilo P5: sajt ne navodi godine rada, broj artikala, rokove isporuke, garancije, popuste ni cene dok ih vlasnik ne potvrdi. Sve tvrdnje koje sajt ipak iznosi o radu firme su u odeljku 2 i čekaju potvrdu.

Oznake: **[P]** privremena vrednost (mora da se zameni pre objave) · **[0]** prazno, blok se ne vidi · **[T]** tvrdnja koju klijent potvrđuje ili ispravlja.

## 1. Kontakt, firma i brend (`content/site.ts`)

| Podatak | Polje | Sada | Gde se vidi | Napomena |
|---|---|---|---|---|
| Telefon **[P]** | `kontakt.telefon` | `+381 60 000 0000` | header (od 1024 px), meni, donja traka, footer, kontakt, „Ili pozovite“ (početna, sistemi, saradnja), JSON-LD | **Obavezan.** Više stalnih rečenica poziva na telefon („Pozovite nas ili pišite.“ na početnoj i kontaktu, „ili nas pozovite“ u pitanjima saradnje). Piše se `+381 64 123 4567` ili `064 123 4567`. |
| Viber **[P]** | `kontakt.viber` | `+381 60 000 0000` | donja traka, meni, footer, kontakt, forma upita („Pošalji na Viber“), rečenice sa kanalima | Prazno = Viber nestaje sa sajta (osim pravnih strana, vidi 2.7). |
| WhatsApp **[P]** | `kontakt.whatsapp` | `+381 60 000 0000` | meni, footer, kontakt, forma upita, rečenice sa kanalima | Isto kao Viber. |
| Mejl **[P]** | `kontakt.email` | `info@example.com` | meni, footer, kontakt, forma upita, pravne strane, JSON-LD | |
| Link KP prodavnice **[P]** | `kp.url` | `https://www.kupujemprodajem.com/` (početna platforme) | header, hero, sekcija „Naša prodavnica“, footer, donja traka, trake na kraju strana, „Kako kupiti“, strane sistema | Pravi link ka prodavnici firme (`https://` na `kupujemprodajem.com`). Tek pravi link ulazi u JSON-LD `sameAs`. |
| Domen **[P]** | `domen` | `https://www.example.com` | canonical, `sitemap.xml`, `robots.txt`, OG slike (apsolutne adrese), JSON-LD | Bez kose crte na kraju. Posle izmene: `npm run build`. |
| Adresa **[0]** | `adresa.ulica`, `adresa.postanskiBroj`, `adresa.mesto` | prazno | kontakt (blok sa mapom na klik), footer, kontakt na početnoj, JSON-LD | Da li postoji lično preuzimanje i na kojoj adresi. Za `AutoPartsStore` u JSON-LD trebaju **i ulica i mesto**. Mapa se prikazuje čim postoji bilo koji deo adrese. |
| Upit za mapu **[0]** | `adresa.mapaUpit` | prazno | mapa na klik (`/kontakt/`) | Tekst za Google mape (adresa ili naziv radnje). Prazno = koristi se adresa. Mapa se učitava tek na klik. |
| Radno vreme **[0]** | `radnoVreme` | prazno (`[]`) | kontakt, footer, kontakt na početnoj, JSON-LD | Niz redova: `{ dani: ["pon", "uto", "sre", "cet", "pet"], od: "08:00", do: "16:00" }`. |
| Pravni naziv firme **[0]** | `firma.naziv` | prazno | footer, kontakt, pravne strane (ko odgovara za podatke) | Tačan naziv iz APR-a. Dok je prazno, pravne strane kao naziv ispisuju „Euromotors Plus · OEM Parts“. |
| PIB i matični broj **[0]** | `firma.pib`, `firma.mb` | prazno | footer, kontakt, pravne strane | |
| Sedište **[0]** | `firma.sediste` | prazno | footer, kontakt, pravne strane | |
| Naziv i brend **[T]** | `brend.ime`, `brend.drugoIme`, `brend.lockup`, `brend.kratko` | „Euromotors Plus“, „OEM Parts“, „Euromotors Plus · OEM Parts“, „Euromotors“ | svuda; `kratko` je kratki naziv aplikacije (manifest) | Potvrditi pisanje i kratki naziv. |
| Opis firme **[T]** | `opis` (i `content/navigacija.ts` → `FOOTER.opis`) | „Veleprodaja originalnih i OEM delova za vozila Volkswagen, Audi, Škoda, SEAT i Cupra.“ | podrazumevani meta opis, footer | Isti tekst je na dva mesta; menjati oba. |
| Marke **[T]** | `marke` | Volkswagen, Audi, Škoda, SEAT, Cupra | svuda | |

## 2. Tvrdnje koje klijent potvrđuje

### 2.1 Firma i delatnost

| Tvrdnja na sajtu | Fajl → polje | Napomena |
|---|---|---|
| „Euromotors Plus je registrovan kao veleprodaja.“ | `content/pocetna.ts` → `saradnja.tekst`; `content/stranice.ts` → `oNamaStrana.sta.pasusi[0]`; `content/saradnja.ts` → `FAQ_SARADNJA[0]` | O6. |
| Kupci su servisi, automehaničari i firme | `content/pocetna.ts` → `hero.uvod`, `zasto.stavke[2]`; `content/saradnja.ts` → `saradnjaStrana.uvod`, `KOME` | O6. |
| „Nabavljamo i prodajemo delove za vozila VW grupe, od motora i kočnica do elektrike i karoserije.“ / „Delove nabavljamo za vozila pet marki VW grupe.“ | `content/stranice.ts` → `oNamaStrana.sta.pasusi[0]`; `content/vozila.ts` → `vozilaStrana.uvod` | |
| Firma nudi originalne i OEM delove, a ne zamenske („Mi nudimo originalne i OEM delove.“) | `content/site.ts` → `opis`; `content/pocetna.ts` → `zasto.stavke[0]`; `content/stranice.ts` → `oNamaStrana.pojmovi` (`zakljucak`) | Strana „O nama“ objašnjava sva tri pojma. Ako firma nudi i zamenske delove, menja se `zakljucak`. |
| „Kupci nas znaju i kao OEM Parts.“ / „Euromotors Plus, poznat i kao OEM Parts“ | `content/stranice.ts` → `oNamaStrana.uvod`, `oNamaStrana.meta.opis` | Po brief-u starog sajta „OEM Parts“ je naziv radnje. |
| „Euromotors Plus nije povezan sa proizvođačima vozila niti je njihov ovlašćeni zastupnik.“ / „nismo povezani sa proizvođačima vozila“ | `content/navigacija.ts` → `FOOTER.zigovi`; `content/pravno.ts` → uslovi, sekcija `nazivi-marki` | Tačno samo ako firma nije ovlašćeni zastupnik nijedne marke. |
| Firma ima prodavnicu na KupujemProdajem i ponuda je tamo | `content/pocetna.ts` → `kp`; `content/kupovina.ts`; `content/stranice.ts` → `oNamaStrana.kako.stavke[1]` | Zavisi od `kp.url`. |

### 2.2 Provera po broju šasije

| Tvrdnja na sajtu | Fajl → polje | Napomena |
|---|---|---|
| Pre ponude firma proverava deo po broju šasije | `content/pocetna.ts` → `marke.tekst`, `zasto.stavke[1]`; `content/stranice.ts` → `oNamaStrana.kako.stavke[0]`, `asortimanStrana.panel.tekst`, `oNamaStrana.cta.tekst`; `content/kupovina.ts` → `KORACI_KUPOVINE[1]`, `FAQ_KUPOVINA[1]`; `content/upit.ts` → `VIN_POMOC.posle[1]`; `content/navigacija.ts` → `CTA_TRAKA.tekst`; `content/asortiman.ts` → `SISTEMI[].uvod` (motor i usis, izduvni sistem, hlađenje i klima, vešanje i upravljanje, elektrika i svetla, karoserija, servis) i `SISTEMI[].metaOpis` (kočnice, točkovi); `content/vozila.ts` → `vozilaStrana.meta.opis`, `uvod`, `cta.tekst` | Ponavlja se u većini tekstova; ako se deo ne proverava uvek, tekstove treba ublažiti. |
| Broj šasije je u saobraćajnoj dozvoli, polje E; na vozilu je „utisnut ispod vetrobranskog stakla, sa strane vozača“ | `content/upit.ts` → `VIN_POMOC.stavke`, `VIN_POMOC.crtez`; `content/kupovina.ts` → `FAQ_KUPOVINA[2]`; `content/pocetna.ts` → `upit.napomena`; `content/asortiman.ts` → `SISTEMI[].upitSaveti[0]` | Polje E je po obrascu saobraćajne dozvole. Majstor da potvrdi opis mesta na vozilu za VW grupu. |

### 2.3 Kupovina, preuzimanje, slanje i plaćanje

| Tvrdnja na sajtu | Fajl → polje | Napomena |
|---|---|---|
| Lično preuzimanje postoji | `content/kupovina.ts` → `KORACI_KUPOVINE[2]`, `FAQ_KUPOVINA[5]`; `content/saradnja.ts` → `KORACI_SARADNJE[2]`, `saradnjaStrana.meta.opis`; `content/pocetna.ts` → `saradnja.tekst` | Potrebna je i adresa (odeljak 1). |
| Firma šalje delove („Da li šaljete delove?“ → „Da.“); način i cenu slanja dogovara pri potvrdi dela | `content/kupovina.ts` → `FAQ_KUPOVINA[5]`, `KORACI_KUPOVINE[2]`; `content/pravno.ts` → uslovi, sekcija `kupovina` | Kurirska služba, ko plaća, rokovi: ništa od toga se ne navodi. |
| Plaćanje se dogovara pri potvrdi dela | `content/kupovina.ts` → `FAQ_KUPOVINA[4]`; `content/pravno.ts` → uslovi, sekcija `kupovina` | Načini plaćanja se ne navode. |
| Povrat i reklamacija: „javite nam se telefonom ili mejlom“ | `content/kupovina.ts` → `FAQ_KUPOVINA[6]` | Rokovi i uslovi povrata se ne navode. Uslovi kažu da zakonska prava potrošača ostaju. |

### 2.4 Saradnja za servise i firme

| Tvrdnja na sajtu | Fajl → polje | Napomena |
|---|---|---|
| „Za firme izdajemo račun na podatke firme.“ (i „uz račun“) | `content/saradnja.ts` → `KORACI_SARADNJE[3]`, `STA_POSLATI[2]`, `saradnjaStrana.meta.opis`; `content/pocetna.ts` → `saradnja.tekst` | Plan K01 §6.5. |
| Firma prima listu delova za više vozila odjednom | `content/saradnja.ts` → `FAQ_SARADNJA[2]`; `content/asortiman.ts` → `SISTEMI[].uvod` (motor i usis, servis: „navedite u upitu sve delove koje menjate u istom poslu“) | |
| „Uslove dogovaramo direktno.“ (rabat, popusti, odloženo plaćanje) | `content/saradnja.ts` → `FAQ_SARADNJA[3]` | Ništa se ne obećava. Ako postoje stalni uslovi, mogu da se dodaju. |
| Koraci: upit → ponuda → preuzimanje ili slanje → račun; „Proveravamo delove i javljamo vam ponudu.“ | `content/saradnja.ts` → `KORACI_SARADNJE`, `saradnjaStrana.cta.tekst` | Rok za ponudu se ne navodi. |

### 2.5 Asortiman, marke i modeli

| Tvrdnja na sajtu | Fajl → polje | Napomena |
|---|---|---|
| Firma nudi delove iz svih 10 sistema i 44 grupe (uz 4 vrste filtera) | `content/asortiman.ts` → `SISTEMI`, `GRUPE`; `content/stranice.ts` → `asortimanStrana.uvod` („deset sistema i 44 grupe“), `content/pocetna.ts` → `sistemi.uvod` („deset sistema“) | Posebno potvrditi felne i gume, stakla i karoserijske delove. Brojevi „deset“ i „44“ su upisani u tekst; pri promeni asortimana ih menjati ručno. |
| Spisak marki i modela | `content/vozila.ts` → `MARKE[].modeli` | Godine i generacije namerno nisu navedene. |
| Slike su 3D prikazi grupa, a ne fotografije artikala | `content/stranice.ts` → `asortimanStrana.napomenaSlike`; `content/pocetna.ts` → `hero.natpis` | |

### 2.6 Tehnički tekstovi (pregled majstora)

| Šta | Fajl → polje | Napomena |
|---|---|---|
| Svi opisi grupa: šta deo radi, kada se menja, savet | `content/asortiman.ts` → `GRUPE[].staRadi`, `kadaSeMenja`, `savet`, `kratko` | K04 i K08 su ispravili netačno i ublažili prejako. K08: klima (kompresor i kondenzator ne hlade sami vazduh u kabini), lampica pritiska ulja (traži hitnu proveru, ne zamenu), ispiranje sistema klime (kad je kompresor otkazao iznutra), felne i gume, podbranici, „najviše grupa“ umesto „najveći sistem“. |
| Brojke i oznake u tekstu | `content/asortiman.ts` → `GRUPE` alternator (`savet`: „oko 14 V“), kočioni diskovi (`savet`: „288 ili 312 mm“), termostat i creva (`savet`: „G12 ili G13“), ulja i tečnosti (`savet`: „504 00/507 00“), usisna grana (`savet`: „P2015“), `SISTEMI` točkovi (`upitSaveti`: „205/55 R16“) | Uz „oko 14 V“: vozila sa upravljanjem energijom mogu da odstupaju. Uz G12/G13 postoje i G12+, G12++, G12 evo (tekst kaže „npr.“). |
| Apsolutne preporuke („uvek“, „obavezno“, „pri svakoj“) | `content/asortiman.ts` → `GRUPE` turbina, brizgaljke i pumpa goriva (bakarne podloške), svećice i bobine, karter (čep), klima (sušač), ramena (reglaža trapa), kočioni diskovi (u paru, sa pločicama), filteri; zadnje čeljusti sa elektronskom ručnom (dijagnostika); akumulator (EFB/AGM, registracija) | Slažu se sa uobičajenom praksom; majstor da potvrdi da važe za ponudu firme. |
| Uvodi sistema i „Šta da navedete u upitu“ | `content/asortiman.ts` → `SISTEMI[].uvod`, `upitSaveti`, `metaOpis` | Opisuju šta sistem obuhvata i šta poslati u upitu; bez tvrdnji o lageru, rokovima i cenama. |

### 2.7 Pravni tekstovi

| Šta | Fajl → polje | Napomena |
|---|---|---|
| Politika privatnosti i uslovi korišćenja (ceo tekst) | `content/pravno.ts` → `POLITIKA_PRIVATNOSTI`, `USLOVI_KORISCENJA` | Advokat ili stručnjak za zaštitu podataka da proveri: (1) ko je rukovalac i koji se podaci o firmi ispisuju (iz `site.ts`); (2) čuvanje podataka („koliko je potrebno i koliko zakon zahteva“, bez rokova); (3) obećanja „podatke iz poruke koristimo samo da odgovorimo na upit i da dogovorimo ponudu“ i „podatke ne prodajemo i ne ustupamo trećim stranama radi reklame“; (4) pozivanje na Zakon o zaštiti podataka o ličnosti i pritužbu Povereniku; (5) tvrdnju da sajt nema kolačiće ni analitiku (važi dok se ne doda analitika); (6) mapu: posle klika Google dobija IP adresu i može da postavi svoje kolačiće; (7) tok podataka: tekst poruke prelazi u Viber, WhatsApp (preko adrese wa.me) ili program za mejl; (8) hosting i tehničke podatke (koji hosting, gde su serveri); (9) pravni osnov obrade, primaoce i prenos van Srbije (Google, Meta, Viber), koji tekst sada ne navodi; (10) uslove: neobavezujuća ponuda, tekstovi/logo/slike, ograničenje odgovornosti, merodavno pravo i prava potrošača. |
| Datum „Poslednja izmena“ | `content/pravno.ts` → `POLITIKA_PRIVATNOSTI.izmenjeno`, `USLOVI_KORISCENJA.izmenjeno` | Sada „28. 10. 2026.“; menja se uz svaku izmenu teksta (test `tests/unit/seo-rute.test.ts` proverava datum, pa i njega uskladiti). |
| Kanali u pravnim tekstovima | `content/pravno.ts` → sekcije `forma-za-upit`, `linkovi`, `upit` | Pominju Viber, WhatsApp i mejl stalnim tekstom. Ako se kanal ukloni iz `site.ts`, uskladiti i ovde. |
| Nosilac prava na tekstove, logo i slike | `content/pravno.ts` → uslovi, sekcija `autorska-prava` | Renderi delova i auta potiču iz starog projekta (`autodelovi`); potvrditi da ih klijent sme da koristi i ko je nosilac prava. Tekst sada samo traži dozvolu vlasnika sajta za preuzimanje. |

## 3. Kanali, brend i nalozi

| Šta | Napomena |
|---|---|
| Viber Business nalog | Ako postoji, poruka iz upita može pouzdano da se unapred upiše (`viber.me/<broj>?text=`, izmena u `lib/links.ts`). Sada link nosi poruku u parametru `draft` (Viber ga ne dokumentuje za obične brojeve), a poruka se pri kliku i kopira, pa se nalepi ako se ne pojavi. Proveriti na Androidu i iPhone-u. |
| Kom kanalu idu upiti | Forma nudi Viber, WhatsApp i mejl, samo kanale sa vrednošću u `content/site.ts`. Ako firma ne želi upite nekim kanalom, ostaviti ga prazno. |
| Google Business Profile | Polje za njega još ne postoji. Kad link stigne, dodaje se u `site.ts` i u JSON-LD `sameAs` (`lib/jsonld.ts`, mala izmena koda). |
| Logo | Potvrda znaka i provera žiga (sličnost sa amblemom EU), vidi `_izvor/autodelovi/docs/brand/LOGO.md`, „Otvorene stavke“. |
| OG slike za deljenje | `public/og/` (19 slika, `npm run og`). Posle promene logotipa ili naslova pokrenuti `npm run og`, pa `npm run build`. Domen nije na slikama. |

## 4. Šta sajt namerno ne navodi (P5)

Može da se doda tek kad klijent pošalje i potvrdi: godine rada, broj artikala, stanje na lageru, cene, rokove ponude i isporuke, garancije, popuste i rabat, recenzije i broj kupaca, sertifikate i ovlašćenja.

## 5. Kad podaci stignu

1. Upisati podatke u `content/site.ts` (odeljak 1) i ispraviti tvrdnje iz odeljka 2 u navedenim fajlovima.
2. `npm run build` i `npm run check:site`: P4 upozorenja treba da nestanu.
3. `npm run e2e`: kad postoji adresa, pušta se i test mape na klik.
4. `npm run og` samo ako su se menjali naslovi ili logo.
