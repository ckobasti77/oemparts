# Podaci od klijenta — šta treba poslati ili potvrditi

Sajt koristi privremene vrednosti dok klijent ne pošalje prave podatke (P4). Sve se menja u jednom fajlu, `content/site.ts`, osim gde je drugačije navedeno. Prazno polje znači da se taj podatak nigde ne prikazuje. `npm run check:site` ispisuje privremene vrednosti kao upozorenje.

Pravilo P5: sajt ne navodi godine rada, broj artikala, rokove isporuke, garancije, popuste ni cene dok ih vlasnik ne potvrdi.

## 1. Kontakt i firma (`content/site.ts`)

| Podatak | Polje | Sada | Napomena |
|---|---|---|---|
| Telefon | `kontakt.telefon` | `+381 60 000 0000` (privremeno) | Broj sa pozivnim brojem. |
| Viber broj | `kontakt.viber` | `+381 60 000 0000` (privremeno) | Prazno = Viber se ne prikazuje. |
| WhatsApp broj | `kontakt.whatsapp` | `+381 60 000 0000` (privremeno) | Prazno = WhatsApp se ne prikazuje. |
| Mejl | `kontakt.email` | `info@example.com` (privremeno) | |
| Link KP prodavnice | `kp.url` | `https://www.kupujemprodajem.com/` (privremeno, početna platforme) | Pravi link ka prodavnici firme na KupujemProdajem. |
| Domen sajta | `domen` | `https://www.example.com` (privremeno) | Koristi se za canonical, sitemap i deljenje. |
| Adresa (ulica, poštanski broj, mesto) | `adresa.*` | prazno | Da li postoji lično preuzimanje i na kojoj adresi. Bez adrese nema mape ni lokalnog JSON-LD-a. |
| Upit za mapu | `adresa.mapaUpit` | prazno | Tekst za Google mape (npr. adresa ili naziv radnje). Ako je prazno, koristi se adresa. Mapa se na `/kontakt/` prikazuje tek kad postoji adresa i učitava se tek na klik. |
| Radno vreme | `radnoVreme` | prazno | Dani i sati. |
| Pravni naziv firme | `firma.naziv` | prazno | Tačan naziv iz APR-a. |
| PIB i matični broj | `firma.pib`, `firma.mb` | prazno | |
| Sedište | `firma.sediste` | prazno | |

## 2. Potvrde sadržaja

| Šta | Gde | Napomena |
|---|---|---|
| Opis „veleprodaja“ i ciljna grupa (servisi, auto-mehaničari, firme) | `content/pocetna.ts`, `content/saradnja.ts` | O6. |
| Da li se nude i originalni (VAG) i OEM delovi | `content/pocetna.ts`, `content/stranice.ts` | Sajt tvrdi „originalni i OEM delovi“. |
| Da li se deo uvek proverava po broju šasije pre ponude | `content/pocetna.ts`, `content/kupovina.ts` | |
| Lično preuzimanje i slanje: da li postoje, način, cena, rokovi | `content/kupovina.ts` | Sada: „Način i cenu slanja dogovaramo pre slanja.“ |
| Načini plaćanja | `content/kupovina.ts` | Sada neutralno: dogovara se pri potvrdi dela. |
| Povrat, reklamacija, garancija | `content/kupovina.ts`, `content/pravno.ts` | Sada: „javite nam se telefonom ili mejlom“. |
| Uslovi saradnje za servise (rabat, popusti, odloženo plaćanje, račun) | `content/saradnja.ts` | Ništa od toga se ne obećava dok se ne potvrdi. |
| Saradnja (K05): rabat i popusti za servise i stalne saradnike | `content/saradnja.ts` → `FAQ_SARADNJA` | Sada: „Uslove dogovaramo direktno.“ Bez procenata i iznosa. |
| Saradnja (K05): rok za ponudu i rok isporuke | `content/saradnja.ts` → `KORACI_SARADNJE` | Sada bez rokova („Proverimo delove i javimo vam ponudu.“). |
| Saradnja (K05): načini plaćanja za firme (račun, avans, odloženo plaćanje) | `content/saradnja.ts` | Sada se ne pominju. |
| Saradnja (K05): slanje za firme (kurirska služba, ko plaća, gde se šalje) | `content/saradnja.ts` → korak „Preuzimanje ili slanje“ | Sada: „Deo preuzimate lično ili vam ga šaljemo.“ |
| Saradnja (K05): da li firma izdaje račun na firmu kupca | `content/saradnja.ts` → korak „Račun“, `STA_POSLATI` | Sajt tvrdi: „Za firme izdajemo račun na podatke firme.“ (plan K01 §6.5). |
| Saradnja (K05): da li se prima lista delova za više vozila odjednom | `content/saradnja.ts` → `FAQ_SARADNJA` | Novo pitanje „Mogu li da pošaljem više delova odjednom?“ — potvrditi. |
| Spisak marki i modela | `content/vozila.ts` | Godine i generacije namerno nisu navedene. |
| Tehnički saveti u opisima grupa delova (pregled majstora) | `content/asortiman.ts` | Ispravljeno: zimske gume (bez brojke), DSG ulje, turbina, kod motora. K04 je ublažio i: kaiš alternatora, nosače motora, kvačilo, manžetnu poluosovine, akumulator, farove, kočionu tečnost (bez intervala), pločice (bez „3 mm“). |
| Tehničke brojke i oznake koje ostaju u tekstu | `content/asortiman.ts` | Proveriti: „oko 14 V“ (alternator), „288 ili 312 mm“ (diskovi), „G12 ili G13“ (rashladna tečnost), „504 00/507 00“ (ulje), greška „P2015“ (klapne usisne grane), „205/55 R16“ (primer dimenzije). |
| Uvodi sistema i „Šta da navedete u upitu“ (10 strana sistema) | `content/asortiman.ts` → `SISTEMI[].uvod`, `upitSaveti` | Opisuju šta sistem obuhvata i šta poslati u upitu; bez tvrdnji o lageru, rokovima i cenama. Potvrditi da firma zaista nudi sve navedene grupe (npr. felne i gume, stakla, karoserijske delove). |
| Pravna provera politike privatnosti i uslova korišćenja | `content/pravno.ts` | Tekst je kratak i opisuje sajt bez naloga, prodaje i kolačića. |

## 3. Kanali i brend

| Šta | Napomena |
|---|---|
| Viber Business nalog | Ako postoji, poruka iz upita može pouzdano da se unapred upiše (`viber.me/<broj>?text=`). Sada link nosi poruku u parametru `draft` (Viber ga ne dokumentuje za obične brojeve), a poruka se pri kliku i kopira, pa se nalepi ako se ne pojavi. Proveriti na telefonu sa Androidom i iPhone-om. |
| Upit po šasiji: kom kanalu ide poruka | Forma nudi Viber, WhatsApp i mejl, samo kanale koji imaju vrednost u `content/site.ts`. Ako firma ne želi upite nekim kanalom, ostaviti ga prazno. |
| Google Business Profile | Link ide u JSON-LD `sameAs`. |
| Logo | Potvrda znaka i provera žiga (sličnost sa amblemom EU, vidi `_izvor/autodelovi/docs/brand/LOGO.md`, „Otvorene stavke“). |
