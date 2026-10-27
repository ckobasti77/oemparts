---
name: Euromotors Plus · OEM Parts
description: Tamni, miran sajt veleprodaje originalnih i OEM delova za vozila VW grupe.
colors:
  night: "#0d0f11"
  night-raised: "#121518"
  surface-1: "#16191d"
  surface-2: "#1c2025"
  surface-3: "#23282e"
  surface-4: "#2b3138"
  line: "#2c3238"
  line-strong: "#434a52"
  control: "#6e767f"
  ink-1: "#f1ece3"
  ink-2: "#c4beb4"
  ink-3: "#a39d94"
  ink-4: "#6b6760"
  signal-orange: "#ff6b1a"
  signal-orange-hover: "#ff8a4a"
  signal-orange-active: "#e95e0e"
  on-signal: "#0d0f11"
  danger: "#ff6166"
  success: "#4fd18b"
  hero-night: "#0e0f11"
typography:
  display:
    fontFamily: "Archivo Expanded, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.833rem + 1.852vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Archivo Expanded, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.5rem + 1.111vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 1.25rem + 0.556vw, 1.75rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  full: "9999px"
spacing:
  section: "clamp(4rem, 2.886rem + 4.571vw, 7rem)"
  block: "clamp(1.5rem, 1.129rem + 1.524vw, 2.5rem)"
  stack: "clamp(1rem, 0.814rem + 0.762vw, 1.5rem)"
  margin: "clamp(1rem, 4vw, 3rem)"
  gutter: "clamp(1rem, 1.7vw, 1.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.on-signal}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.signal-orange-hover}"
  button-primary-active:
    backgroundColor: "{colors.signal-orange-active}"
  button-secondary:
    textColor: "{colors.ink-1}"
    rounded: "{rounded.sm}"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-quiet:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink-1}"
    rounded: "{rounded.sm}"
    height: "48px"
  button-quiet-hover:
    backgroundColor: "{colors.surface-4}"
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-1}"
    rounded: "{rounded.sm}"
    height: "48px"
  chip-link:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.xs}"
    height: "44px"
  card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-1}"
    rounded: "{rounded.md}"
  panel-band:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.lg}"
---

# Design System: Euromotors Plus · OEM Parts

## Overview

**Creative North Star: "Noćni tehnički list"**

Grafitna noćna podloga, topla „mastilo“ boja teksta i jedan narandžasti signal za sledeći korak. Široki Archivo Expanded naslovi velikim slovima označavaju mesta, a Public Sans nosi tekst i zadatke. Spektakl su samo 3D renderi delova i auta; sve oko njih je mirno, sa vidljivim radijusima i dosta vazduha.

Sistem nasleđuje identitet starog sajta („Rendgen“), ali je jednostavniji i klasičniji (O3): bez tehničkih ukrasa (lenjiri, uglovi, title block, kote), bez monospace i condensed pisma, bez svetle teme. Odbija tamni šablon prodavnice sa karticama ikona, neonski sjaj, staklo kao ukras i gradijent tekst.

**Key Characteristics:**
- Jedna tamna tema, bez prekidača (P8).
- Jedan signal: narandžasta samo za primarnu akciju, fokus i aktivnu stavku.
- Radijusi svuda: 6 / 10 / 14 / 20 px po ulozi.
- Pokret miran: kratko otkrivanje na skrol, jedno autorsko mesto (hero pretapanje).
- Telefon prvo: mete ≥ 44 px, donja traka akcija ispod 1024 px.

## Colors

Hladan grafit za površine i linije, topla svetla boja za tekst, jedan zasićen narandžasti signal.

### Primary
- **Signal narandžasta** (#ff6b1a): primarno dugme (jedno po oblasti), fokus prsten, crta aktivne navigacije. Tekst na njoj je noćni (#0d0f11, 6,74:1). Hover #ff8a4a (8,22:1), pritisak #e95e0e (5,55:1).

### Neutral
- **Noć** (#0d0f11): podloga strane.
- **Noć podignuta** (#121518): trake sekcija, footer, podloga header-a (92 % + zamućenje).
- **Površina 1–4** (#16191d, #1c2025, #23282e, #2b3138): kartice; polja i čipovi; tiho dugme; hover tihog dugmeta.
- **Linija** (#2c3238) i **jaka linija** (#434a52): ivice i razdelnici (dekorativni).
- **Kontrola** (#6e767f): ivice polja i sekundarnog dugmeta, ≥ 3:1 na svim površinama.
- **Mastilo 1** (#f1ece3): glavni tekst, 16,32:1 na podlozi.
- **Mastilo 2** (#c4beb4): sekundarni tekst i uvod, 10,40:1.
- **Mastilo 3** (#a39d94): meta, pomoć ispod polja, placeholder; najmanje 4,88:1 (na površini 4).
- **Mastilo 4** (#6b6760): samo onemogućeno.
- **Greška** (#ff6166, 6,54:1) i **uspeh** (#4fd18b, 9,90:1): samo za stanja forme i kopiranja, uvek sa ikonom i rečju.

### Named Rules
**The One Signal Rule.** Narandžasta znači „sledeći korak“: najviše jedno primarno dugme po oblasti, nikad za ukras, ikone, razdelnike ni tekst.

**The No Hex Rule.** Komponente koriste tokene (`bg-surface-1`, `text-ink-2`), nikad hex vrednosti; paleta Tailwind-a je isključena (`--color-*: initial`).

## Typography

**Display Font:** Archivo Expanded 700 i 600 (lokalni woff2, sa Arial rezervom)
**Body Font:** Public Sans, varijabilni 100–900 (lokalno, latin + latin-ext, sa Arial rezervom)

**Character:** Široka velika slova liče na oznake modela i naslovne blokove tehničkih crteža; Public Sans je neutralan i čitak u radionici.

### Hierarchy
- **Display** (700, 36,6 → 56 px, 1,0, velika slova): samo H1 početne.
- **Headline** (600, 28,3 → 40 px, 1,05, velika slova): H1 unutrašnjih strana i naslovi sekcija početne.
- **Display M** (600, 20,2 → 26 px, 1,1, velika slova): imena marki, brojevi koraka.
- **Title** (Public Sans 650, 22,2 → 28 px, 1,2): H2 na unutrašnjim stranama.
- **Subtitle** (Public Sans 600, 18,1 → 20 px, 1,3): naslovi kartica, FAQ pitanja, legende.
- **Lead** (400, 18,1 → 20 px, 1,5, mastilo 2): uvod, najviše 60ch.
- **Body** (400, 16 px, 1,6): tekst, 65–72ch.
- **Body S** (400, 14 px, 1,5) i **Caption** (500, 13 px, 1,4): opisi i meta.
- **Label** (600, 12 px, 0,06em, velika slova): naslovi kolona u footeru; nikad iznad naslova (bez eyebrow).

### Named Rules
**The Places vs Tasks Rule.** Velika slova Archivo Expanded za mesta (strane, sekcije početne); Public Sans za zadatke i sadržaj (grupe, forme, FAQ).

**The Diacritics Rule.** Č ć š ž đ moraju doći iz Public Sans/Archivo, nikad iz rezervnog fonta: latin familija je prva i nema rezervu, latin-ext familija ima.

## Layout

Sadržaj najviše 1280 px; bočne margine 16 px (390) do 48 px, a na širim ekranima rastu (`--pad`). Sekcije imaju 64 → 112 px vertikalnog razmaka, naslov → sadržaj 24 → 40 px. Mreže: 2 kolone ispod 768 px, 3 do 1279 px, 5 od 1280 px (sistemi i grupe). Na desktopu levo poravnato i asimetrično (tekst levo, objekat desno); na telefonu jedna kolona: iskaz → akcija → objekat. Header 56 / 64 px, sticky; donja traka 64 px + safe area ispod 1024 px.

## Elevation & Depth

Dubina dolazi iz koraka površina i osvetljene gornje ivice, ne iz širokih senki. Samo ono što lebdi dobija kratku kontaktnu senku. Bez sjaja i stakla kao ukrasa; header i donja traka su jedine prozirne površine (zamućenje 12 px, puna podloga kod `prefers-reduced-transparency`).

### Shadow Vocabulary
- **Rest** (`box-shadow: inset 0 1px 0 0 rgb(241 236 227 / .04)`): paneli i kartice u mirovanju.
- **Raised** (`box-shadow: inset 0 1px 0 0 rgb(241 236 227 / .06), 0 1px 2px rgb(0 0 0 / .35), 0 12px 24px -16px rgb(0 0 0 / .7)`): hover kartice, istaknuti panel.
- **Overlay** (`box-shadow: inset 0 1px 0 0 rgb(241 236 227 / .07), 0 2px 6px rgb(0 0 0 / .4), 0 18px 40px -18px rgb(0 0 0 / .75)`): meni.
- **Button** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / .24)`): gornja ivica primarnog dugmeta, nestaje na pritisak.

## Shapes

Radijus po ulozi: 6 px čipovi i oznake, 10 px dugmad i polja, 14 px kartice, renderi i paneli, 20 px veliki paneli i trake unutar margina. Ugnježdeni uglovi su koncentrični (slika na vrhu kartice 13 px). Oštri uglovi samo za ono što dodiruje ivicu ekrana (header, donja traka, footer, trake preko cele širine, desktop hero) i za tanke linije. Fokus prsten prati oblik; goli link dobija 6 px. Isprekidane ivice se ne koriste. Ivice su 1 px; 2 px samo fokus i aktivna crta.

## Components

### Buttons
- **Shape:** zaobljeno (10 px), visina 48 px (md) i 56 px (lg), tekst 15/600.
- **Primary:** signal narandžasta, noćni tekst, svetla gornja ivica; jedno po oblasti.
- **Hover / Focus:** boja za 80 ms linearno; pritisak `translateY(1px)` 140 ms; fokus 2 px (na narandžastoj mastilo 1).
- **Secondary:** providno, ivica kontrola, mastilo 1; hover površina 2.
- **Quiet:** površina 3, jaka linija, mastilo 1; za kanale i ponovljene akcije.
- **Spoljni link:** bilo koja varijanta + strelica ↗ i „(otvara se u novom prozoru)“ za čitače ekrana.

### Chips
- **Style:** površina 2, mastilo 2, 6 px, visina 44 px; hover površina 3.
- **State:** trenutni (`aria-current`) dobija narandžastu tamnu podlogu (#2a1a12) i mastilo 1. Oznake (nisu linkovi) 32 px.

### Cards / Containers
- **Corner Style:** 14 px (panel), 20 px (istaknuti panel).
- **Background:** površina 1; render na radijalnoj podlozi (#20252b → površina 1).
- **Shadow Strategy:** Rest; na hover Raised + podizanje 2 px i render 1,03 (samo fini pokazivač).
- **Border:** 1 px linija; na hover jaka linija.
- **Internal Padding:** 16–24 px.

### Inputs / Fields
- **Style:** površina 2, ivica kontrola 1 px, 10 px, visina 48 px, tekst 16 px; labela iznad (14/600).
- **Focus:** ivica narandžasta + prsten 2 px.
- **Error / Disabled:** ivica greška, poruka sa ikonom ispod (`aria-invalid`, `aria-describedby`); onemogućeno površina 1 i mastilo 4.

### Navigation
- Header: logo levo, navigacija od 1280 px (15/500 mastilo 2, aktivna mastilo 1 + crta 2 px narandžasta), telefon i „Ponuda na KupujemProdajem“ desno. Footer: logo, linkovi na sve sisteme i strane, kanali sa vrednošću, napomena o žigovima.

### Disclosure (FAQ)
- Native `<details>`; red 56 px, pitanje 18–20/600, strelica se okreće 180°; sadržaj ulazi opacity + 8 px (220 ms). Visina se ne animira.

## Do's and Don'ts

- **Do** koristi tokene i `type-*` stilove; nikad hex ni proizvoljne veličine u komponentama.
- **Do** drži jedno primarno dugme po oblasti; ostalo sekundarno ili tiho.
- **Do** daj svakom okviru radijus iz skale; oštro samo uz ivicu ekrana.
- **Do** animiraj samo transform i opacity, kroz `components/motion/`; sadržaj na ekranu se nikad ne sakriva.
- **Don't** stavljaj natpis (eyebrow) iznad naslova, gradijent tekst, obojenu levu ivicu, sjaj ni staklo kao ukras.
- **Don't** koristi logotipe i boje marki vozila ni KupujemProdajem (P6).
- **Don't** prikazuj cene, stanje, rokove, garancije ni brojke koje vlasnik nije dao (P5).
- **Don't** koristi monospace ili condensed pismo; brojevi koraka su Archivo 600.
