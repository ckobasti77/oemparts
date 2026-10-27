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

## K03 — Ljuska i početna strana   (2026-10-27 20:32)
**Fajlovi:**
- Novo:
  - `components/layout/{HeaderState,MobileMenu,BottomBar}.tsx`;
  - `components/motion/{ScrollCrossfade.tsx,useSheetMotion.ts}`;
  - `components/sections/SystemCard.tsx`;
  - `components/sections/home/{Hero,HeroPicture,Marke,Sistemi,Zasto,KakoKupiti,Saradnja,Upit,Prodavnica,Kontakt}.tsx`;
  - `scripts/fix-export-segments.mjs`.
- Izmenjeno:
  - `app/{layout,page,not-found}.tsx`, `app/globals.css`;
  - `components/layout/{Header,Footer}.tsx`;
  - `content/{navigacija,pocetna,stranice}.ts`, `lib/{links,format}.ts`;
  - `package.json` (`build`), `scripts/check-site.mjs`;
  - `tests/unit/{links,format}.test.ts`.
- Snimci `docs/oemparts/snimci/K03-*`:
  - `pocetna-{390,1440}`, `header-sazet-{390,1440}`, `meni-{390,1024}`, `footer-{390,1440}`, `404-{390,1440}`.

**Šta je urađeno:**
- **Ljuska.** `layout.tsx` ima `lang="sr-Latn"`, fontove, skip link, sentinel za header, header, `<main>`, footer, donju traku i `RevealEngine`.
  - `data-bottom-bar` na `<html>` postavlja server, i to samo kad traka ima bar jedan kanal, pa traka nikad ne pokriva sadržaj (`padding-bottom` na `body`).
- **Header.** Sticky je, a visina se ne menja.
  - Na vrhu je providan. Posle 24 px skrola dobija podlogu (`bg-raised` 92 % + blur) i logo se blago smanji. To radi IO na sentinelu i CSS, bez GSAP-a i bez scroll listenera.
  - Raspored po širini: od 1280 px navigacija; telefon kao tekst od 1440, kao ikona od 1024; KP primarno dugme od 1024; „Meni“ ispod 1280.
- **Meni.** Native `<dialog>` + `showModal()`, ceo ekran ispod 768 px, panel desno (r 20) od 768 px.
  - Fokus ide na „Zatvori“, Tab/Shift+Tab kruže u panelu, Escape zatvara sa izlaznom animacijom, a fokus se vraća na „Meni“.
  - Skrol strane je zaključan (`html.menu-open`, `scrollbar-gutter: stable`).
  - Meni zatvaraju klik na pozadinu, klik na link, promena strane i širina od 1280 px.
  - Pokret (`useSheetMotion`): panel −8 px → 0 i stavke sa stagger-om; pod reduced motion samo opacity.
  - Logo, linkovi i ikone dolaze sa servera kao props/children (K01-24).
- **Donja traka** (< 1024 px): Pozovite · Viber · KupujemProdajem, samo kanali sa vrednošću, neutralne boje.
- **Footer.**
  - logo, rečenica i KP (sekundarno);
  - Asortiman i Informacije (na telefonu dve kolone);
  - Kontakt: kanali sa vrednošću, radno vreme i adresa samo ako postoje;
  - firma (naziv, sedište, PIB, MB) samo ako postoji;
  - žigovi i pravne strane.
- **404:** naslov, rečenica, „Pošaljite upit“ (primarno) i „Na početnu“, čipovi „Možda tražite“ i dekorativni render od 1024 px. `noindex`, status 404 u pregledu.
- **Početna:** svih 9 sekcija iz plana §4.1, sa tekstovima iz `content/pocetna.ts` i pozadinama po planu.
  - Hero: render auta sa pretapanjem sklopljen → rasklopljen na skrol (P9, `ScrollCrossfade` + lenji ScrollTrigger). Bez JS-a i pod reduced motion stoji sklopljen auto.
  - LCP slika je uvek opacity 1, `fetchpriority="high"` i nije meta reveal-a (provereno: `car-assembled-1440.avif` / `-m-640.avif`, opacity 1).
  - Sekcije 2–9 koriste `Reveal`/`RevealGroup` iz K02. Posle skrola do dna nijedan element nije `pending`.
- **Provereno u pregledaču** (statički izvoz, 3241):
  - 360/390/768/1024/1280/1440 px bez horizontalnog skrola;
  - meni samo tastaturom;
  - 0 grešaka u konzoli, prefetch segmenata 31/31 OK.

**ODLUKE:**
- **Kanali u rečenicama.** „Zašto (d)“ i tekst upita na početnoj sada imaju `{kanali}`, a `lib/links.ts` (`popuniKanale`) ga popunjava samo kanalima koji imaju vrednost.
  - Primer: bez Vibera i WhatsApp-a piše „telefonom ili mejlom“.
  - Proveren privremeno prazan Viber i WhatsApp: na početnoj i 404 nema ni linka ni reči „Viber“/„WhatsApp“; `site.ts` je vraćen.
  - `/kontakt/` (K02) i dalje pominje kanale u meta opisu, a `content/upit.ts` u uvodu. **K05/K06** treba da koriste `popuniKanale` ili neutralan tekst.
- **`SystemCard` je napravljen u K03** (`components/sections/SystemCard.tsx`), da ga K04 koristi i na asortimanu.
  - Mreža odstupa od K01 §3.3 („3 kolone 768–1279“): 10 sistema u 3 kolone ostavlja siroče. Zato je 768–1279 mreža od 2 kolone sa vodoravnim karticama (render 112 px levo); < 768 su 2 kolone uspravno, ≥ 1280 5 kolona.
- **Hero.**
  - 1024–1279 px: render je pomeren udesno (`left: 14 %`, `right: −6 %`) jer su dugmad stajala preko prednjeg dela auta. Od 1280 px je preko cele širine, kao u planu.
  - < 768 px: okvir je kvadratni sa renderom uz donju ivicu, umesto 4:5, jer je gornja petina rendera prazna.
- **Marke** su linkovi u redu (`flex-wrap`), ne mreža 2 × N. „VOLKSWAGEN“ u display-m ne staje u ćeliju od 5 kolona; ovako je 390: „Volkswagen Audi / Škoda SEAT Cupra“.
- **Upit:** 17 ćelija VIN-a su grupisane 3 + 6 + 8 (WMI/VDS/VIS, bez oznaka). Prigušene su i bez podloge, jer je kritika pokazala da liče na polje za unos.
- **KP naslov** je ispod 640 px `6,3vw`. Reč „KupujemProdajem“ inače izlazi van ekrana na 360–390 px, a prelom unutar reči čita se kao dve reči.
- **„Zašto“:** ikone bez pločica (plan: „ikona levo 24“), levi stub lepljiv od 1024 px.
- **„Kako kupiti“:** na telefonu je link „Koraci i česta pitanja“ ispod koraka.
- **Meni.** Logo u meniju je `<img>` SVG iz kita, a ne inline putanje, da se 12 KB putanja ne duplira u HTML-u i RSC-u. Ispod 360 px logo u meniju se ne prikazuje.
- **Meni i fokus.** Tab kruži unutar panela (APG obrazac), ne izlazi na traku pregledača.
- **Meni na tabletu.** Redovi navigacije su 48 px od 768 px (panel staje u 1024 × 768), a na telefonu 56 px.
- **Donja traka.**
  - Lista je najviše 36 rem i centrirana.
  - Ispod 384 px oznake su 12 px, da „KupujemProdajem“ stane na 360 px.
  - Telefon ima sr-only broj; KP sr-only „(otvara se u novom prozoru)“.
- **`viewport-fit=cover` nije uključen.** `env(safe-area-inset-bottom)` je 0, a Safari sam drži sadržaj u bezbednoj zoni. Konzervativno, bez preklapanja sa zarezom u položenom položaju.
- **Next 16.4.3 na Windows-u izvozi segmentne prefetch fajlove u podfoldere** (`out/upit/__next.upit/__PAGE__.txt`), a klijent traži `out/upit/__next.upit.__PAGE__.txt`.
  - Uzrok: `path.relative` daje `\`, a `convertSegmentPathToStaticExportFilename` menja samo `/`.
  - Posledica: 19 grešaka 404 u konzoli na početnoj (bitno za Lighthouse „najbolje prakse“).
  - Rešenje:
    - `scripts/fix-export-segments.mjs` posle `next build` (`npm run build`) ih premesti u ravna imena. Na Linux hostingu nema šta da radi.
    - `check:site` sada javlja grešku ako podfolder `__next.*` ostane.
- **Impeccable kritika** (dizajnerski pregled preko radnika + detektor):
  - Detektor u kodu: 0 nalaza. U pregledaču:
    - `line-length` u napomeni o žigovima: popravljeno, 62ch;
    - `thin-border-wide-shadow` na `panel-raised` i panelu menija: lažno pozitivno, tokeni `--shadow-raised`/`--shadow-overlay` su iz K01 §3.5 (pomak + negativan raširen).
  - Radnik je predložio i brisanje sekcija Saradnja i Kontakt na početnoj, novi tekst KP naslova i KP dugme kao sekundarno. To **nije** urađeno: sekcije, tekstovi i dva primarna dugmeta (upit i KP, različite oblasti) su zadati planom §4.1.

**Novi paketi:** nema.

**Testovi:**
- `links.test.ts`: `brzeAkcije` (redosled, izostavljanje kanala bez vrednosti, prazna traka); `nabroj`, `kanaliTekstom` (padeži, samo postojeći kanali), `popuniKanale` (zamena i izostavljanje rečenice bez kanala).
- `format.test.ts`: `adresaTekst`.
- Ukupno 99 testova.

**Rezultat provere:** typecheck ✓ · lint ✓ · test 99/99 ✓ · build ✓ (početni JS 138,8–139,5 KB gzip, budžet 145) · check:site ✓ (0 grešaka, 6 P4 upozorenja). Dev i preview serveri su ugašeni.

**Za Jovana ujutru:**
- `docs/oemparts/snimci/K03-pocetna-{390,1440}.png`. Na celoj strani donja traka je za snimak pomerena na dno; u stvarnosti je fiksna.
- Na telefonu: otvaranje i zatvaranje menija, donja traka (Pozovite/Viber) i pretapanje auta na skrol.
- Hero na 1024–1279 px: render je pomeren udesno i zadnji kraj auta je malo odsečen; proveriti da li se dopada.
- U renderu auta se na tamnoj pozadini vide blage vertikalne trake (banding u izvornim slikama iz `_izvor`). Ako smeta, render treba ponovo izvesti sa ditheringom.
- Ako se sajt gradi na Windows-u, `npm run build` već poravna prefetch fajlove. Ako se sajt gradi na drugom mestu (Netlify, Cloudflare, Linux), korak ne radi ništa.
