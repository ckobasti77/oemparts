# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.4 (App Router), React 19.3, TypeScript, Tailwind v4, statički izvoz (`output: "export"`) bez servera. GSAP za pokret, Phosphor ikone. Odluka vlasnika (OEMPARTS plan O1, P1).

## Users

- **Servisi, auto-mehaničari i firme** koji redovno nabavljaju delove za vozila Volkswagen, Audi, Škoda, SEAT i Cupra (O6: firma je registrovana kao veleprodaja).
- Situacija: radionica ili kancelarija, često telefon u ruci; traže konkretan deo za konkretno vozilo i žele brzo da ga provere i poruče.
- Posao: pronaći deo u KP prodavnici ili poslati upit po broju šasije, pa dogovoriti kupovinu telefonom, Viberom, WhatsApp-om ili mejlom.

## Product Purpose

Sajt ne prodaje online (O1, O2). Daje informacije o asortimanu, gradi poverenje i šalje kupca na vlasnikovu KupujemProdajem prodavnicu ili na direktan kontakt. Upit po broju šasije sastavlja poruku u pregledaču i ništa ne šalje na server (P2). Uspeh: kupac za nekoliko sekundi razume ponudu i jednim dodirom dolazi do KP-a, poziva ili upita.

## Positioning

Euromotors Plus (kupcima poznat kao OEM Parts) je veleprodaja originalnih i OEM delova specijalizovana za vozila VW grupe, sa proverom dela po broju šasije pre ponude.

## Operating Context

- Kupovina se završava van sajta: KupujemProdajem (pravila platforme) ili direktan dogovor.
- Broj šasije (VIN) se nalazi u saobraćajnoj dozvoli, polje E.
- Kanali: telefon, Viber, WhatsApp, mejl, KP prodavnica.

## Capabilities and Constraints

- Strane: početna, asortiman (10 sistema, 44 grupe), 10 strana sistema, marke i modeli, upit po šasiji, saradnja, o nama, kako kupiti, kontakt, politika privatnosti, uslovi korišćenja, 404.
- Bez korpe, naloga, admina, baze, analitike, kolačića, 3D/WebGL i CMS-a (O1, P3).
- Kontakt podaci, podaci firme, KP link i domen su privremeni dok ih klijent ne pošalje (P4, `content/site.ts`).
- Mapa se učitava tek na klik (P3).
- Otvoreno (nije potvrđeno): adresa i lično preuzimanje, radno vreme, podaci firme, uslovi slanja, plaćanja, povrata i saradnje (`docs/PODACI-OD-KLIJENTA.md`).

## Brand Commitments

- Ime „Euromotors Plus“, radnja „OEM Parts“, zajedno „Euromotors Plus · OEM Parts“.
- Logo: luk zvezda oko imena, jedna boja (topla bela na tamnom); narandžasta nikad u logou.
- Tamna tema kao na starom sajtu, jednostavnija i klasičnija, radijusi svuda (O3).
- Marke vozila i KupujemProdajem samo tekstom, bez logotipa i boja (P6).
- Glas: iskusan kolega, „vi“, kratko, bez marketinških fraza.

## Evidence on Hand

- 3D renderi 44 grupe delova i 4 vrste filtera (`public/images/delovi/`), render auta sklopljen i rasklopljen (`public/images/hero/`).
- Logo kit i ikonice (`public/images/brand/`, `app/icon.svg`).
- Tekstovi po grupi: šta deo radi, kada se menja, savet (`content/asortiman.ts`).
- Ne postoje i ne smeju se izmišljati: cene, stanje, broj artikala, godine rada, recenzije, rokovi isporuke, garancije, popusti (P5).

## Product Principles

1. Svaka strana vodi do sledećeg koraka: KP, poziv ili upit po šasiji.
2. Tačnost pre utiska: ništa što vlasnik nije potvrdio.
3. Telefon prvo: krupne mete, donja traka akcija, brzo učitavanje.
4. Miran izgled, jedan signal: narandžasta samo za sledeći korak.

## Accessibility & Inclusion

WCAG 2.2 AA, axe 0 grešaka, cela navigacija tastaturom, vidljiv fokus, `prefers-reduced-motion` bez pomeranja, `lang="sr-Latn"`.
