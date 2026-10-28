# OEMPARTS — izveštaj noćnog runa (27–28. 10. 2026.)

Za: Jovan. Grana: `oemparts-run` (osnova `master`). Plan: `docs/OEMPARTS-PLAN.md`. Detalji po koracima: `docs/OEMPARTS-PROGRESS.md`.

## Ukratko

- **Sajt je gotov kao statički izvoz.** 20 javnih strana i 404, tamna tema po O3, GSAP pokret, SEO, OG slike, JSON-LD, sitemap. `npm run build` pravi `out/` (15 MB, 321 fajl) koji radi na svakom hostingu.
- **Sve provere prolaze:** typecheck, lint, 148 unit testova, build, `check:site` (0 grešaka) i 264 e2e testa (236 prošlo, 28 namerno preskočeno, 0 palo). axe: 0 nalaza na svih 21 strani, na telefonu i desktopu.
- **Pre objave fale podaci klijenta.** Telefon, mejl, KP link i domen su privremeni (P4), a adresa, radno vreme i firma prazni. Sve je u jednom fajlu, `content/site.ts`; spisak je u `docs/PODACI-OD-KLIJENTA.md`.
- **Revizija K08** je našla 0 kritičnih problema u kodu. Popravljeno je 11 srednjih nalaza i 23 niske stavke: jedna skrivena a11y greška koja bi pukla kad se upiše adresa, netačne tehničke rečenice, pravni tekst o mapi i porukama, čip-red na telefonu i sitnice. Lista je u progress-u (K08).
- **Ostaje otvoreno:** Lighthouse performanse na `/` (93) i `/asortiman/` (91) na localhost-u su ispod cilja 95 (BLOKADA iz K07, meri se na pravom hostingu), i pravna provera tekstova.

## Kako da pregledaš granu

```bash
git log --oneline master..oemparts-run   # 10 commit-a: zatečeno, start, K01–K08
git diff --stat master...oemparts-run
npm ci
npm run build          # statički izvoz u out/
npm run check:site     # provera izvoza
npm run preview        # http://localhost:3241
npm run e2e            # ~3 min, port 3241 mora biti slobodan
```

Uputstvo za pokretanje, sadržaj i hosting je u `README.md`.

## Šta je urađeno, po oblasti

Snimci glavnih strana posle revizije: `docs/oemparts/snimci/K08-{pocetna,asortiman,sistem-kocnice,vozila,upit,saradnja,kontakt}-{390,1440}.png` (14). Snimci svih 21 strane su iz K07: `docs/oemparts/snimci/K07-*.png`. Na snimcima od 390 px donja traka akcija je za snimak pomerena na dno strane; uživo je fiksna.

| Oblast | Šta postoji | Koraci |
|---|---|---|
| **Temelj** | Next 16.4.3 statički izvoz (P1), tokeni u `app/globals.css`, radijusi 6/10/14/20, lokalni fontovi (Archivo Expanded i Public Sans, latin-ext), sav tekst u `content/`, skripte `check-site`, `serve-out`, `images`, `og`, `lighthouse` | K02 |
| **Ljuska** | lepljiv header koji se sažima, meni kao `<dialog>`, donja traka akcija na telefonu (Pozovite · Viber · KP), footer, 404 | K03 |
| **Početna** | hero sa renderom auta i pretapanjem na skrol (P9), marke, sistemi, zašto mi, kako kupiti, saradnja, upit, KP, kontakt | K03 |
| **Asortiman** | `/asortiman/` (10 sistema, 44 grupe + 4 filtera), 10 strana sistema sa člancima po grupi, `/vozila/` | K04 |
| **Upit po šasiji** | forma koja sastavlja poruku u pregledaču i otvara Viber, WhatsApp ili mejl, uz „Kopiraj poruku“; provera broja šasije; ništa se ne šalje na server (P2) | K05 |
| **Kontakt i saradnja** | kanali kao redovi, mapa na klik (P3), podaci firme kad postoje; `/saradnja/` za servise i firme | K05 |
| **O nama, kako kupiti, pravno** | tri strane i dve pravne strane; metadata, JSON-LD, sitemap, robots, manifest, 19 OG slika | K06 |
| **Pokret, telefon, a11y, brzina** | reveal motor sa lenjim GSAP-om, stanja pritiska, e2e (9 spec fajlova), axe 0, Lighthouse merenja | K07 |
| **Revizija i predaja** | revizija celog diff-a sa popravkama, `README.md`, `docs/PODACI-OD-KLIJENTA.md`, ovaj izveštaj, završni snimci | K08 |

### Revizija K08 (nalazi i ishod)

Pet radnika (Sonnet) je pregledalo tekst, kod, bezbednost i izvoz i snimke. Svaki nalaz je proveren pre popravke. Puna lista sa fajlovima je u `docs/OEMPARTS-PROGRESS.md`, sekcija K08.

| Ozbiljnost | Popravljeno | Nije popravljeno (razlog u progress-u) |
|---|---|---|
| Kritično | 0 nalaza | — |
| Srednje | 11 od 11 | — |
| Nisko | 23 stavke | predlozi koji se kose sa planom ili ranijim odlukama, ukus, refaktor duplikata (rizik na kraju runa), lokalni alati |
| Info | dokumentovano | — |

Najvažnije popravke:
- **Skrivena a11y greška:** blok „radno vreme i adresa“ u footeru i na početnoj imao je nevažeći `<dl>`. Danas se ne vidi jer su podaci prazni, ali bi axe pao na svim stranama čim klijent upiše adresu. Sada je jedna komponenta (`components/layout/RadnoVremeAdresa.tsx`); provereno axe-om (stara struktura: 2 pravila, nova: 0).
- **Tehnička tačnost:** klima (kompresor i kondenzator ne hlade sami vazduh u kabini), lampica pritiska ulja (traži hitnu proveru, ne zamenu), ispiranje sistema klime, felne i gume, podbranici; obećanje provere dimenzije i ET-a po broju šasije je ublaženo.
- **P5:** „Deo proveravamo po broju šasije, pa odgovara…“ obećavalo je ishod; sada opisuje postupak.
- **Pravni tekst:** šta Google dobija posle klika na mapu, kako tekst poruke prelazi u Viber/WhatsApp/mejl, kopiranje za Viber, bez tvrdnje o vlasništvu nad slikama. Datum izmene je 28. 10. 2026.
- **Telefon:** red čipova sa skrolom izgledao je završeno (4. čip nevidljiv); ivica se sada gasi šire, pa se vidi da red ide dalje. Renderi delova imali su oštru liniju ugrađene senke na dnu pločice; sada se senka gasi.
- **Doslednost:** jednoslovne reči (i, u…) više ne ostaju na kraju reda u karticama i uvodima (pravilo plana K01); OG slika početne ima „SEAT i Cupra“; tvrdo kodiran tekst premešten je u `content/`.
- **Kod:** ESLint sada brani i lenji `import("gsap")` van `components/motion/`; `tsconfig` ne proverava `out/`, `.nocni-run/`, `_izvor/`, `.claude/`; preview server više ne pada kad fajl nestane i ne služi stari sadržaj posle novog build-a; mrtav kod obrisan.

### Impeccable audit (posle popravki)

| # | Dimenzija | Ocena | Ključno |
|---|---|---|---|
| 1 | Pristupačnost | 4 | axe 0 na 21 strani (oba projekta), tastatura, fokus, reduced motion; latentni `<dl>` ispravljen |
| 2 | Performanse | 3 | CLS 0, TBT 24–38 ms; Lighthouse 91–96 na localhost-u, LCP u simulaciji 2,7–3,5 s (K07 BLOKADA); JS 139–146 KB gzip, većinom Next i React |
| 3 | Responsive | 4 | bez horizontalnog skrola 360–1440 na svih 21 strani, mete ≥ 44 px (polja i dugmad 48) |
| 4 | Tema i tokeni | 4 | samo tokeni u komponentama, jedna tamna tema (P8), radijusi iz skale |
| 5 | Integritet izvedbe | 3 | detektor 0 nalaza; ostaje malo dupliranja (pet prikaza liste kanala, dve liste koraka) |
| **Ukupno** | | **18/20** | Odlično, uz sitno poliranje |

## Šta nije urađeno i BLOKADE

- **BLOKADA (K07, ostaje):** Lighthouse mobile performanse ≥ 95 nisu ispunjene na `/` (93) i `/asortiman/` (91), a LCP ≤ 2,0 s u simulaciji ni na jednoj od 5 strana (2,72–3,48 s). Razlog je merenje na localhost-u (Lantern računa ceo JS kao blokirajući; objašnjenje u `docs/oemparts/merenja.md`). Sa stvarnim prigušenjem LCP je 1,94–2,18 s. Konačnu ocenu daje PageSpeed Insights nad objavljenim sajtom.
- **BLOKADA (objava):** sajt ne sme da se objavi sa privremenim podacima (P4): telefon `+381 60 000 0000`, mejl `info@example.com`, domen `https://www.example.com`, KP link na početnu stranu platforme. Čeka podatke klijenta (`docs/PODACI-OD-KLIJENTA.md`, odeljak 1).
- **BLOKADA (K04, K05, K08):** Playwright MCP server (`--output-dir docs/oemparts/snimci`) podiže sama Claude sesija iz MCP konfiguracije runnera, pa ostaje upaljen dok sesija traje, iako ga koraci K07 i K08 nisu ni koristili (snimci idu preko `@playwright/test` skripti). Gašenje je u K04 i K05 odbila zaštita okruženja, pa ga K08 ne gasi. Gasi se kad se sesija završi; trajno rešenje je gašenje MCP-a u runneru posle koraka ili dozvola za `taskkill` tog procesa.
- **Nije rađeno po pravilima:** hosting, domen, objava i nalozi.
- **Čeka klijenta:** adresa i lično preuzimanje, radno vreme, podaci firme, Viber Business, Google Business Profile (polje još ne postoji, mala izmena koda), pravna provera, potvrda tvrdnji iz odeljka 2 u PODACI.
- **Upozorenje koje ostaje:** početni JS na `/upit/` je 146,1 KB gzip, 1,1 KB iznad budžeta 145 KB (stvaran kod forme; K05).
- **Predlozi iz revizije koji nisu primenjeni** (odluke plana i ranijih koraka ili ukus): manji naslov KP sekcije na telefonu (K03), narandžasto dugme u header-u pored primarnog u sadržaju (posebne oblasti), dužina reda teksta ~90 znakova na 1440 px (token `--container-reading` iz K01, predlog: 40rem), različite ose desnih kolona na početnoj, tri oblika numerisanih koraka, prazne VIN ćelije, napomena o žigovima dva puta na `/vozila/` (plan §4.4), refaktor duplikata u kodu.

## ODLUKE i predlozi P1–P11 za potvrdu

Predlozi iz plana (sajt ih sledi; potvrdi ili promeni):

| # | Predlog | Stanje |
|---|---|---|
| P1 | Statički izvoz (`output: "export"`, `trailingSlash`, `images.unoptimized`) | urađeno; radi na cPanel-u, Netlify-u, Cloudflare Pages i Vercel-u |
| P2 | Upit bez servera: poruka se sastavlja u pregledaču, otvara Viber/WhatsApp/mejl, uz kopiranje | urađeno |
| P3 | Bez analitike i kolačića; mapa tek na klik | urađeno (mapa se vidi tek kad postoji adresa) |
| P4 | Privremeni podaci u `content/site.ts`, upozorenje u `check:site` | urađeno; **čeka prave podatke** |
| P5 | Bez izmišljenih činjenica | urađeno; tvrdnje za potvrdu su u PODACI, odeljak 2 |
| P6 | Marke i KP samo tekstom | urađeno |
| P7 | Lokalni fontovi (Archivo Expanded, Public Sans) sa dijakritikom | urađeno, bez `next/font/google` |
| P8 | Jedna tamna tema | urađeno |
| P9 | Hero render auta, pretapanje na skrol, bez WebGL-a | urađeno |
| P10 | Portovi 3240 (dev) i 3241 (pregled) | urađeno |
| P11 | Phosphor ikone, bez UI biblioteka | urađeno |

Odluke iz koraka koje vredi potvrditi (sve su u progress-u, red **ODLUKE**):
- **Viber:** link nosi poruku u parametru `draft`, a poruka se pri kliku i kopira (Viber ne dokumentuje unapred upisan tekst za obične brojeve). K01-08, K05.
- **Budžet početnog JS-a 145 KB** umesto 120 KB (osnova Next 16 + React 19 je ~120 KB). K02.
- **Windows build:** `scripts/fix-export-segments.mjs` ispravlja grešku Next 16.4.3 na Windows-u (prefetch fajlovi u podfolderima). Na Linux hostingu ne radi ništa. K03.
- **Raspored:** hero na 1024–1279 px pomeren udesno; marke kao red reči; `/vozila/` kao jedan panel; lepljiv panel na stranama sistema od 1280 px; naslov KP sekcije na telefonu `6,3vw`. K03, K04.
- **Slike:** renderi delova su lenji (osim prvog reda na `/asortiman/`), jer bi ih prefetch preuzimao i na drugim stranama. K04, K07.
- **Forma:** greška se ne prikazuje na izlazu iz praznog polja; dugmad akcija u jednini („Pošalji na Viber“). K05, K01-27.
- **Pokret:** GSAP kreće tek posle učitavanja strane; ako se skroluje ranije, sadržaj se samo pojavi. K07.
- **K08:** pravni tekst izmenjen (datum 28. 10. 2026.); zaglavlja bezbednosti i `.htaccess` su uputstvo u README-u, a ne fajlovi u izvozu; čip-red na telefonu ostaje red sa skrolom (plan), uz širi prelaz na ivici.

## Paketi

| Paket | Verzija | Licenca | Uloga |
|---|---|---|---|
| `next`, `react`, `react-dom` | 16.4.3, 19.3.0, 19.3.0 | MIT | zatečeno |
| `gsap` | 3.15.0 | GSAP Standard License (besplatna) | pokret |
| `@phosphor-icons/react` | 2.1.10 | MIT | ikone |
| `@fontsource-variable/public-sans` | 5.3.0 | OFL-1.1 | font |
| dev: `vitest` | 5.0.5 | MIT | unit testovi |
| dev: `@playwright/test` | 1.64.1 | Apache-2.0 | e2e, snimci, OG slike |
| dev: `@axe-core/playwright` | 4.14.0 | MPL-2.0 | a11y u e2e (samo razvoj, ne ide u izvoz) |
| dev: `sharp` | 0.35.5 | Apache-2.0 | varijante slika, OG |
| dev: `@types/node` | `^20` → 22.20.5 | MIT | vitest 5 traži ≥ 22 |

Lighthouse se pušta preko `npx lighthouse@13.5.0`, nije zavisnost. Archivo Expanded (woff2) je iz starog sajta (OFL). K08 nije dodao nijedan paket. `npm audit`: 0 ranjivosti.

## Šta Jovan ručno proverava

1. **Snimci:** `docs/oemparts/snimci/K08-*.png` (glavne strane), po potrebi `K07-*.png` (sve strane).
2. **Na pravom telefonu** (Android i iPhone), posle `npm run preview` u lokalnoj mreži ili posle objave:
   - meni, donja traka, pretapanje auta na početnoj;
   - `/upit/`: sastaviti poruku, „Pošalji na Viber“ (da li se tekst pojavi ili ga treba nalepiti), „Pošalji na WhatsApp“, „Pošalji mejlom“ (dijakritika i redovi);
   - „Sastavi poruku“ odmah posle kucanja mora iz prvog dodira da sastavi poruku ili pokaže greške;
   - red čipova na `/asortiman/`: da li se vidi da ide dalje.
3. **Tekstovi:** majstor da pročita opise grupa i tehničke brojke (`content/asortiman.ts`, PODACI 2.6); klijent da potvrdi tvrdnje iz PODACI, odeljak 2.
4. **Pravno:** `/politika-privatnosti/` i `/uslovi-koriscenja/` dati pravniku (PODACI 2.7).
5. **Dizajn:** hero na 1024–1279 px (zadnji kraj auta je odsečen), naslov KP sekcije na telefonu, dužina reda teksta na 1440 px; blage vertikalne trake u renderu auta (iz izvornih slika).
6. **Posle podataka klijenta:** `content/site.ts` → `npm run build` → `npm run check:site` (P4 upozorenja nestaju) → `npm run e2e` (sa adresom se pušta i test mape).
7. **Posle objave:** lista u `README.md` („Domen i provera posle objave“): 404 status, `/kontakt` → `/kontakt/`, sitemap i robots sa pravim domenom, deljenje linka, PageSpeed Insights za `/` i `/asortiman/`, Search Console.

## Brojevi

**Testovi**
- Unit (vitest): 148 testova u 9 fajlova, svi prolaze (~1 s). K08 je dodao test za blok radno vreme i adresa.
- E2E (Playwright, Chrome sa računara, `telefon` 390 × 844 i `desktop` 1440 × 900): 264 testa, 236 prolazi, 28 namerno preskočeno (širine samo na desktopu, meni samo na telefonu, mapa bez adrese), 0 pada, 2,6 min.
- axe (WCAG 2.0/2.1/2.2 A i AA): 0 nalaza na 21 strani u oba projekta, i sa otvorenim menijem i na `/upit/` sa greškama.

**Lighthouse mobile** (K07, 27. 10. 2026., localhost, medijana 3 merenja; detalji u `docs/oemparts/merenja.md`)

| Strana | Perf (sim.) | A11y | BP | SEO | LCP (sim.) | CLS | TBT | Perf / LCP (devtools) |
|---|---|---|---|---|---|---|---|---|
| `/` | 93 | 100 | 100 | 100 | 3,25 s | 0 | 24 ms | 87 / 2,18 s |
| `/asortiman/` | 91 | 100 | 100 | 100 | 3,48 s | 0 | 24 ms | 89 / 2,14 s |
| `/asortiman/kocnice/` | 96 | 100 | 100 | 100 | 2,80 s | 0 | 25 ms | 92 / 2,09 s |
| `/upit/` | 96 | 100 | 100 | 100 | 2,73 s | 0 | 24 ms | 93 / 2,01 s |
| `/kontakt/` | 96 | 100 | 100 | 100 | 2,72 s | 0 | 38 ms | 90 / 1,94 s |

K08 nije ponovo merio: izmene su tekst, CSS maska na slikama i sitnice bez uticaja na učitavanje (početni JS je isti, osim +0,1 KB na `/upit/`).

**Veličine** (`check:site`, gzip, posle K08)
- HTML po strani 26,1–39,5 KB (budžet 40), početni JS 138,8 KB na većini strana, `/` 139,7, `/kontakt/` 141,5, `/upit/` 146,1 (budžet 145), CSS 10,9 KB.
- `out/`: 15 MB, 321 fajl, 24 HTML (20 javnih + 404 + `/stil/` prazan i `noindex`).
- Slike: 48 rendera delova + 48 varijanti 384 px, 36 slika auta (AVIF i WebP), 19 OG slika (33–71 KB).
- Snimci u `docs/oemparts/snimci/`: 92 PNG (43 MB).
- Trajanje koraka (runner): K01 50 min, K02 34, K03 41, K04 49, K05 47, K06 16, K07 93, K08 ~80.

## Rezultat provera (K08, posle svih izmena)

| Provera | Rezultat |
|---|---|
| `npm run typecheck` | prošlo |
| `npm run lint` | prošlo (0 problema) |
| `npm run test` | prošlo, 148/148 |
| `npm run build` | prošlo (Windows: 21 segmentni fajl poravnat) |
| `npm run check:site` | prošlo: 0 grešaka, 7 upozorenja (6 × P4, `/upit/` JS 146,1 KB) |
| `npm run e2e` | 236 prošlo, 28 preskočeno, 0 palo |
| `npm run preview` | 49 provera: 20 strana 200, 19 adresa bez „/“ → 308, `/stil/` prazan, 404 sa statusom 404, sitemap, robots, manifest, ikone i OG 200 |
| Impeccable detektor | izvor: 0 nalaza; izvezeni HTML (ograničen režim): 0 |

## Zatečeni problemi

- **Next 16.4.3 na Windows-u** u statičkom izvozu upisuje segmentne prefetch fajlove u podfoldere (`out/upit/__next.upit/__PAGE__.txt`) umesto u ravna imena, pa pregledač dobija 404. Zaobiđeno skriptom `scripts/fix-export-segments.mjs` (K03); na Linux-u se ne javlja. K08 je pripremio anonimni nacrt prijave za Next.js i otvorio obrazac u pregledaču; ništa nije poslato (adresa obrasca: `.nocni-run/oemparts/tmp/k08/next-feedback-url.txt`).
- **Next prefetch** ubacuje preload za `eager` slike druge strane u trenutnu stranu (K04); zaobiđeno lenjim slikama.
- **Renderi iz starog sajta:** blage vertikalne trake na renderu auta (banding u izvornim slikama) i ugrađena senka do donje ivice rendera delova (K08 je gasi maskom). Lepše rešenje je ponovni izvoz rendera.
- **Logo:** otvorena stavka iz `LOGO.md` (sličnost sa amblemom EU, provera žiga) nije rešena.
- **Playwright MCP procesi** koje pokreće okruženje ostajali su posle K04 i K05 (vidi BLOKADE).
- **Privremeni fajlovi van projekta:** radnik za vizuelni pregled je u K08 ostavio ~70 isečaka snimaka u `C:\Users\admin\AppData\Local\Temp\k08vz\` (brisanje je odbila zaštita okruženja). Mogu da se obrišu.
- **Upozorenje Node-a** `MODULE_TYPELESS_PACKAGE_JSON` kad skripte (`check-site`, `og`) učitavaju `content/*.ts`; bezopasno. Uklonio bi ga `"type": "module"` u `package.json`, ali to menja tumačenje config fajlova, pa nije rađeno.
- **U gitu** su alat noćnog runa (`.nocni-run/oemparts/`, bez logova) i 92 snimka (43 MB). Ako repozitorijum postane javan, odlučiti da li to treba da ostane.
- **Commit `eee6e5d`** („zatečene lokalne izmene pre noćnog runa“) čuva izmene u `package.json` i `eslint.config.mjs` koje su postojale pre runa.
