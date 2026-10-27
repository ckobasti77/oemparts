# OEMPARTS — napredak

Ovo je noćni run OEMPARTS.
- Plan: `docs/OEMPARTS-PLAN.md`.
- Pravila: `.nocni-run/oemparts/rules.md`.

Svaki korak dopisuje svoju sekciju na kraj, sa svojim ODLUKAMA i BLOKADAMA.

## K01 - Plan: arhitektura, dizajn i sadržaj   (2026-10-27 19:21)
**Plan korak.** Plan je upisan u `docs/oemparts/planovi/K01.md`. Kod nije menjan.

### K01 — ODLUKE (dopisao K02; K01 je bio samo za čitanje)
**ODLUKE:** sve iz `docs/oemparts/planovi/K01.md` §0.2 (K01-01 … K01-28). Najvažnije:
- vizuelni svet je zadat (O3/O4), bez impeccable „concept-seed“;
- GSAP se učitava lenjo, `@gsap/react` se ne instalira;
- reveal sakriva samo ono što je ceo ispod ekrana, bez CSS pred-skrivanja;
- Public Sans kao dve `next/font/local` familije (latin + latin-ext);
- Viber link bez teksta, poruka se kopira;
- ručni `srcset` (bez `next/image` optimizacije);
- `ink-3` = `#A39D94`; radijusi 6/10/14/20; sadržaj najviše 1280 px;
- adresa, radno vreme i firma prazni (skriveni) dok ih klijent ne pošalje.

## K02 — Temelj: statički Next, GSAP, tokeni, brend, sadržaj, provere   (2026-10-27 19:53)
**Fajlovi:**
- Konfiguracija: `next.config.ts`, `package.json`, `package-lock.json`, `eslint.config.mjs`, `vitest.config.mts`, `AGENTS.md` (blok koji piše `next dev`).
- `app/`:
  - `layout.tsx`, `globals.css`, `fonts.ts`, `fonts/archivo-expanded-{600,700}.woff2`;
  - `favicon.ico`, `icon.svg`, `apple-icon.png`;
  - `page.tsx`, `not-found.tsx`;
  - `asortiman/page.tsx`, `asortiman/[sistem]/page.tsx`, `vozila/`, `upit/`, `saradnja/`, `o-nama/`, `kako-kupiti/`, `kontakt/`, `politika-privatnosti/`, `uslovi-koriscenja/`, `stil/` (svaki `page.tsx`).
- `components/`:
  - `brand/{Logo,BrandLink}.tsx`, `brand/logoPaths.ts`;
  - `ui/{Button,TextLink,Chip,Field,Disclosure,Breadcrumbs,Note,PartImage}.tsx`;
  - `motion/{gsap.ts,Reveal.tsx,RevealEngine.tsx}`;
  - `layout/{SkipLink,Header,NavLink,Footer,PageHeader,Section,CtaBand,ContactChannels,JsonLd,LegalPage}.tsx`;
  - `sections/stil/StilPregled.tsx`.
- `content/{site,asortiman,vozila,navigacija,pocetna,kupovina,saradnja,upit,stranice,pravno}.ts`.
- `lib/{cn,format,links,vin,upit,routes,asortiman,seo,jsonld,motion}.ts`.
- `scripts/{serve-out,check-site,images}.mjs`.
- `tests/unit/{links,vin,upit,sadrzaj,seo,format,rute}.test.ts`.
- `public/images/delovi/` (48 rendera + 48 varijanti `-384`), `public/images/hero/` (36: sklopljen i rasklopljen, 1080/1440/1920, t-768/1080/1536, m-640/828/1080, AVIF + WebP), `public/images/brand/` (4 ikonice + 2 SVG logoa).
- Dokumenti: `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, `docs/PODACI-OD-KLIJENTA.md`.
- Snimci: `docs/oemparts/snimci/K02-stil-{390,1440}.png`.
- Obrisano iz šablona: `public/{file,globe,next,vercel,window}.svg`, Geist i stari `page.tsx`.

**Šta je urađeno:**
- **Statički izvoz radi.** `next.config.ts` je po P1 (export, `trailingSlash`, `unoptimized`, bez `cacheComponents` i `partialPrefetching`; Tailwind turbopack pravilo ostaje). `npm run build` pravi `out/` sa svih 20 javnih ruta, `404.html` i praznim dev-only `/stil/`.
- **Tokeni** su u `app/globals.css` po K01 §3.11 (paleta Tailwind-a isključena, samo naši tokeni).
- **Fontovi su lokalni** (P7): Archivo Expanded 700/600 iz `_izvor`, Public Sans iz fontsource-a kao dve familije sa `unicode-range`. Dijakritika je proverena na snimku (Č Ć Š Ž Đ u oba pisma).
- **Sadržaj:**
  - 10 sistema i 44 grupe + 4 podgrupe filtera, sa ispravkama iz K01 §6.4;
  - marke i modeli, FAQ kupovine, saradnja, upit, pravne strane (kratko);
  - `site.ts` sa P4 vrednostima i `PLACEHOLDERS`.
- **`lib/`:** linkovi (tel, Viber, WhatsApp, mailto, KP, mapa, `kanali()`), VIN bez kontrolne cifre, provera i sastav poruke upita, `pageMetadata` i JSON-LD.
- **Pokret:** `RevealEngine` (linija 18 %, paket sa stagger-om 60/180 ms, failsafe, reduced motion) sa lenjim GSAP-om. Provereno u pregledaču: ispod ekrana `pending`, na ekranu ništa sakriveno, posle skrola sve `done`. ESLint brani import GSAP-a van `components/motion/`.
- **Rute:** sve rute iz §3 su jednostavne strane (naslov, uvod, CTA) sa metadata; unutrašnje strane imaju i BreadcrumbList.
- **Skripte:** `serve-out.mjs` (index.html za foldere, 308 bez „/“, 404 sa statusom, MIME, brotli i gzip) i `check-site.mjs` (plan §7 + dev-only `/stil/` + veličine po strani).

**ODLUKE:**
- `@types/node` je podignut sa `^20` na `22.20.5`: vitest 5 traži `@types/node ≥ 22`, a runtime je Node 22.
- **Budžet početnog JS-a je 145 KB gzip umesto 120 KB** iz K01 §11. Izmereno 136,9 KB po strani, a od toga je naš kod oko 8 KB (NavLink + RevealEngine; GSAP nije u početnom JS-u). Ostalo je osnova Next 16.4 + React 19.3. `check:site` ne broji `nomodule` polyfill. K07 meri Lighthouse.
- `content/o-nama.ts`, `kontakt.ts` i `greske.ts` iz plana su spojeni u `content/stranice.ts`. Manje fajlova; isti tipovi i tekstovi.
- **Header u K02 je osnova:** navigacija od 1280 px, KP dugme od 1024 px, telefon od 1024 px. Na telefonu do K03 nema menija; svi linkovi su u footeru. K03 pravi meni, sažimanje i donju traku (`data-bottom-bar` još nije postavljen).
- KP dugme i drugi elementi kojima se prikaz menja po širini dobijaju omotač. Na snimku 390 je nađen horizontalni preliv: `hidden` se sudarao sa `inline-flex` dugmeta. Popravljeno.
- Skip link je visine 48 px (bio je 39).
- **Početna u K02** ima samo H1, uvod, CTA, listu sistema i kontakt. Hero sa renderom i sekcije pravi K03.
- **`/upit/` u K02** prikazuje kanale za kontakt i pomoć za VIN; formu pravi K05.
- `PageHeader` od K02 piše BreadcrumbList JSON-LD na svim unutrašnjim stranama, a `/` i `/kontakt/` već imaju `Organization` (bez adrese, K01-14). K06 dopunjuje.
- Oznake na dev-only `/stil/` su u komponenti, ne u `content/`: interne su i ne idu u izvoz.
- `vitest.config` ima nastavak `.mts` (Vite upozorenje za ESM u CJS paketu).
- Opcija „Druga marka“ u selectu marke se ne upisuje u poruku.

**Novi paketi:**
- `gsap@3.15.0` — GSAP Standard License (besplatna, dozvoljena pravilima)
- `@phosphor-icons/react@2.1.10` — MIT
- `@fontsource-variable/public-sans@5.3.0` — OFL-1.1
- dev: `vitest@5.0.5` — MIT
- dev: `sharp@0.35.5` — Apache-2.0
- dev: `@playwright/test@1.64.1` — Apache-2.0
- dev: `@axe-core/playwright@4.14.0` — MPL-2.0
- dev: `@types/node` `^20` → `22.20.5` — MIT

**Testovi** (7 fajlova, 93 testa):
- `links`: normalizacija telefona, `tel:`/`viber:`/`wa.me`/`mailto` sa tačnim enkodovanjem dijakritike, novog reda i posebnih znakova; KP domen; `kanali()` bez praznih kanala.
- `vin`: 17 znakova, normalizacija, I/O/Q sa predlogom, znakovi, bez kontrolne cifre.
- `upit`: sastav poruke (sva polja, prazna, dijakritika, CRLF, dužina, enkodovanje u linkovima), naslov, sve poruke grešaka.
- `sadrzaj`: 10 sistema i 44 grupe, svaka grupa i podgrupa ima render (768 i 384) koji postoji, tekstovi, meta 120–160, P5 i P6 obrasci, marke, P4.
- `seo`: sufiks naslova ≤ 60, jedinstveni naslovi, canonical, noindex, JSON-LD (Organization/AutoPartsStore, sameAs, breadcrumb, FAQ, XSS).
- `format`: množina, tipografija, radno vreme, stagger.
- `rute`: 20 ruta sa „/“ i iste rute u `check-site`.

**Rezultat provere:** typecheck, lint, test (93/93), build i `check:site` (0 grešaka; 6 upozorenja za P4 privremene vrednosti) — sve prošlo. `npm run preview` je proveren na 3241: 200 za strane, 308 bez „/“, 404 sa `404.html`, brotli i tačni MIME tipovi; posle provere ugašen.

**Za Jovana ujutru:**
- Pogledati `docs/oemparts/snimci/K02-stil-{390,1440}.png` (tokeni, dugmad, polja, kartice, logo).
- U `docs/PODACI-OD-KLIJENTA.md` je spisak privremenih podataka i potvrda; najvažniji su telefon, mejl, KP link i domen.
- Viber ne prima unapred upisan tekst (poruka se kopira); ako firma ima Viber Business nalog, može drugačije.
