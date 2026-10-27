# OEMPARTS — nov, jednostavan sajt za Euromotors Plus · OEM Parts (noćni run, 27.10.2026.)

> Izvor istine za ceo run. Svaki korak ga čita pre rada. Tehničke planove koraci pišu u
> `docs/oemparts/planovi/<ID>.md`; ovaj fajl se ne prepisuje, samo se dopunjuju ODLUKE na dnu kad baš mora.

## 0. Šta pravimo, u jednoj rečenici
Klasičan, brz i lep tamni sajt za veleprodaju originalnih i OEM delova za vozila VW grupe, koji kupce šalje na vlasnikovu KupujemProdajem prodavnicu i na direktan kontakt.

Danas je `oemparts` prazan `create-next-app` (Next 16.4.3, React 19.3, Tailwind v4, grana `master`). Posle runa je to gotov statički sajt od dvadesetak strana, spreman za postavljanje na bilo koji hosting, sa uputstvom i spiskom podataka koje klijent treba da pošalje.

Stari projekat `autodelovi` je pun e-shop sa 3D modelom, Convex bazom i adminom. Klijentu je to previše, pa ga ne koristimo kao sajt. Služi kao izvor materijala: kopije su u `_izvor/autodelovi/` (vidi `_izvor/autodelovi/INDEX.md`). Sam folder `autodelovi` se ne dira.

## 1. Odluke (Jovan, 27.10.2026.)

| # | Odluka |
|---|---|
| O1 | Sajt je klasičan i jednostavan, samo frontend. Bez online prodaje, korpe, naloga, admina, baze (Convex) i 3D modela. |
| O2 | Kupovina ide preko vlasnikove KupujemProdajem (KP) prodavnice i direktnog kontakta (telefon, Viber, WhatsApp, mejl, upit po broju šasije). Sajt daje informacije, gradi poverenje i šalje tamo. |
| O3 | Izgled je **tamni, kao stari sajt**, ali jednostavniji i klasičniji: lep, čist, moderan. **Nigde kockasto i oštro, radijusi svuda.** |
| O4 | Koristi se većina stvari iz starog: logo sa zvezdama, fontovi, boje, 3D renderi delova i auta, GSAP reveal, komponente i tekstovi gde odgovaraju. |
| O5 | Koriste se skillovi ui-ux-pro-max, impeccable, design-taste-frontend (taste), design-dna i GSAP skillovi (+ motion-design). GSAP se instalira u projekat. |
| O6 | Sajt se predstavlja kao **veleprodaja** (servisi, auto-mehaničari, firme), jer je tako firma registrovana. |
| O7 | Modeli: Opus 5.5 za plan i teže korake, Sonnet 5.5 za mehaničke. Sonnet i Haiku rade kao radnici (subagenti) unutar koraka. |
| O8 | Noćni run od 8 koraka (Jovan je tražio manje od prvobitnih 12). Bez nadzora tokom noći. Run sam piše jutarnji izveštaj. |
| O9 | Cena sajta je skromna, ali kvalitet mora da bude vrhunski: sajt treba da vredi više nego što se prodaje. |

**Predlozi (Claude, čekaju potvrdu).** Ovo sam izabrao jer odgovor nije postojao. Run ih sledi, a izveštaj ih ponovo navodi:

| # | Predlog | Zašto | Gde se menja |
|---|---|---|---|
| P1 | Statički izvoz: `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`. Iz `next.config.ts` se brišu `cacheComponents` i `partialPrefetching`. | Radi na svakom hostingu (cPanel, Netlify, Cloudflare Pages, Vercel) bez servera. Provereno 27.10: sa `cacheComponents` build u export modu pada („PPR cannot be enabled in export mode“), a `partialPrefetching` traži `cacheComponents`. | `next.config.ts` |
| P2 | Nema servera. Upit po šasiji sklapa poruku i otvara Viber, WhatsApp ili mejl, uz dugme „Kopiraj poruku“. Ništa se ne šalje na server i ništa se ne čuva. | Statički sajt; nema održavanja ni ličnih podataka na serveru. | `/upit/`, `lib/links.ts` |
| P3 | Bez analitike i kolačića, pa nema cookie banera. Mapa se učitava tek na klik: dok se ne klikne, nema poziva ka Google-u. | Privatnost i brzina. Analitika može da se doda kasnije. | `/kontakt/` |
| P4 | Kontakt podaci, podaci firme, KP link i domen su **privremeni** dok ih klijent ne pošalje. Stoje u jednom fajlu (`content/site.ts`) sa spiskom `PLACEHOLDERS`. Privremene vrednosti moraju biti očigledno privremene i bezbedne: telefon `+381 60 000 0000`, mejl `info@example.com`, KP link ka početnoj strani KupujemProdajem, domen `https://www.example.com`. Nikad nečiji pravi broj ili adresa. `check:site` ih ispisuje kao upozorenje (ne pada). | Klijent još nije poslao podatke; zamena je jedan fajl. | `content/site.ts`, `docs/PODACI-OD-KLIJENTA.md` |
| P5 | **Bez izmišljenih činjenica.** Nema godina rada, broja artikala, rokova isporuke, garancija, popusta ni cena koje vlasnik nije dao. Gde tekst traži činjenicu, piše se neutralno, a stavka ide u `docs/PODACI-OD-KLIJENTA.md`. | Netačna obećanja su rizik za klijenta. | svi tekstovi |
| P6 | Marke vozila (Volkswagen, Audi, Škoda, SEAT, Cupra) i KupujemProdajem se pominju samo tekstom, bez njihovih logotipa i boja. | Žigovi. | svi tekstovi |
| P7 | Fontovi su kao na starom sajtu (Archivo Expanded za naslove, Public Sans za tekst) i lokalni, pa build ne zavisi od mreže. Archivo woff2 dolazi iz `_izvor`, Public Sans iz `@fontsource-variable/public-sans`. Mora da pokrije latin-ext (č ć š ž đ). Ako lokalni pristup ne da ispravnu dijakritiku ili pravi pomeranje sadržaja (CLS), dozvoljen je `next/font/google` kao na starom sajtu, uz ODLUKU. | Pouzdan build noću i doslednost sa starim sajtom. | `app/fonts/`, `app/layout.tsx` |
| P8 | Jedna, tamna tema. Bez prekidača teme. | O3; jednostavnije. | `app/globals.css` |
| P9 | Hero koristi render auta iz starog sajta. Na skrol se blago pretopi iz sklopljenog u rasklopljeni (dve slike, GSAP scrub), bez WebGL-a. Kod `prefers-reduced-motion` stoji statična slika. LCP slika nikad nije na opacity 0. | Prepoznatljiv potpis starog sajta, a lagan. | početna |
| P10 | Portovi: dev 3240, statički pregled `out/` 3241. Na ovom računaru rade i drugi projekti, pa se 3000/3001 ne koriste i tuđi procesi se ne gase. | Bez sudara. | `package.json` |
| P11 | Ikone su Phosphor (`@phosphor-icons/react`, MIT), kao na starom sajtu. Drugi UI paketi se ne dodaju. | Doslednost, mala težina. | `components/` |

## 2. Obim
**Radimo:**
- strane iz §3 i zajedničke komponente;
- sadržaj (srpski);
- dizajn sistem po O3 i GSAP pokret;
- SEO i deljenje;
- testovi (unit i e2e) i provere statičkog izvoza;
- uputstvo za predaju i spisak podataka od klijenta.

**Ne diramo:**
- folder `autodelovi` (samo čitamo kopije u `_izvor/`);
- hosting, domen, deploy i naloge;
- git istoriju;
- bilo šta van foldera `oemparts`.

## 3. Mapa sajta

| Ruta | Strana | Svrha |
|---|---|---|
| `/` | Početna | Prvi utisak: ko smo (veleprodaja OEM i originalnih delova za VW grupu), hero sa renderom auta (P9), marke, sistemi delova, zašto mi, kako kupiti, saradnja za servise, upit po šasiji, poziv na KP, kontakt. |
| `/asortiman/` | Asortiman | 10 sistema i 44 grupe delova sa 3D renderima. |
| `/asortiman/[sistem]/` | Sistem (10 strana) | Grupe tog sistema, kratak stručan tekst (šta deo radi, kad se menja, savet), poziv na KP i upit. |
| `/vozila/` | Marke i modeli | Volkswagen, Audi, Škoda, SEAT, Cupra i najčešći modeli, samo tekst. |
| `/upit/` | Upit po broju šasije | Forma koja sklapa poruku i otvara Viber, WhatsApp ili mejl (P2). |
| `/saradnja/` | Za servise i firme | Veleprodaja (O6): kako izgleda saradnja i šta treba poslati. |
| `/o-nama/` | O nama | Ko smo i šta radimo; zašto originalni i OEM delovi. |
| `/kako-kupiti/` | Kako kupiti | Tri koraka (pronađi na KP ili pošalji upit → potvrda dela po šasiji → preuzimanje ili slanje) i česta pitanja. |
| `/kontakt/` | Kontakt | Kanali, radno vreme, adresa, mapa na klik (P3), podaci firme. |
| `/politika-privatnosti/`, `/uslovi-koriscenja/` | Pravno | Kratko i tačno za sajt bez naloga, prodaje i kolačića. |
| 404 | Nije pronađeno | Putevi nazad. |

Dev-only `/stil/` je pregled komponenti. U produkcionom izvozu nema sadržaja, ima noindex i nije u sitemap-u.

## 4. Materijal iz starog sajta
Sve je u `_izvor/autodelovi/`. Spisak i opis su u `INDEX.md`.
- Kod je sačuvan sa nastavkom `.txt` (npr. `Reveal.tsx.txt`), da ga TypeScript, ESLint i Next ne bi kupili. Čita se, kopira i prilagođava, ali se ne importuje.
- `_izvor/` je u `.gitignore`. Agenti ga čitaju direktno po putanji: Grep i Glob mogu da preskoče gitignored fajlove, zato krenite od `INDEX.md`.
- **Brend:** logo sa zvezdama (inline SVG putanje, `currentColor`), pravila za logo, ikonice i favicon.
- **Slike:** 44 rendera delova (768×768, providna pozadina, imena po slug-u grupe) i renderi auta, sklopljen i rasklopljen, u veličinama za desktop, tablet i telefon (tamna pozadina).
- **Podaci:**
  - `car.manifest.json`: 10 sistema i 44 grupe sa srpskim nazivima;
  - `seed/categories.ts.txt`: tekstovi po grupi (šta, kad se menja, savet, kratko);
  - `seed/vehicles.ts.txt`: marke i modeli, a godine i kodovi su nepotvrđeni;
  - `seed/content.ts.txt`: o nama, kontakt, česta pitanja i pravni tekstovi starog shopa (prilagoditi, jer nema prodaje).
- **Dizajn:**
  - `DESIGN-SYSTEM.md` i `UI-BOOST.md`, tokeni u `globals.css.txt`;
  - pokret u `motion.ts.txt`, `revealConfig.ts.txt` i `Reveal.tsx.txt`, sa `lib/gsap/`;
  - UI primitivi i ljuska (header, footer, meni, donja traka);
  - snimci starog izgleda u `screens/`. Na njima je stari logo; važi novi, zvezde.

## 5. Izgled (O3)
- **Osnova je identitet starog sajta:**
  - noćna podloga i topla „mastilo“ boja teksta;
  - jedan narandžasti signal za glavne akcije;
  - pravila kontrasta i Archivo Expanded naslovi velikim slovima.
- **Jednostavnije:**
  - manje slojeva i ukrasa, više vazduha;
  - klasičan ritam sekcija i krupna, jasna tipografija;
  - bez gustih tabela i bez 3D-a.
- **Radijusi su vidljivi i svuda:**
  - polazna skala: čipovi i oznake 6 px, dugmad i polja 10 px, kartice i slike 14 px, veliki paneli 20 px;
  - pill samo za ono što je semantički pill;
  - ugnježdeni uglovi su koncentrični;
  - izuzeci su samo ivice koje dodiruju ekran i tanke linije;
  - fokus prsten prati oblik.
  - Skalu finalizuje K01 uz impeccable i ui-ux-pro-max.
- **Pokret (GSAP), miran:**
  - Sekcije, naslovi i kartice se otkrivaju kratko, sa stagger-om, kad im sredina pređe liniju 18 % iznad dna ekrana (ista konstanta kao stari sajt).
  - Hero pretapanje (P9), stanja hover i press, sažimanje header-a, meni.
  - Bez reč-po-reč animacije na pasusima i bez parallax gomile.
  - Animiraju se samo transform i opacity.
  - Server HTML je vidljiv i bez JS-a.
  - `prefers-reduced-motion`: bez pomeranja.
- **Prvo telefon** (390 px):
  - na telefonu stoji donja traka akcija (Pozovi · Viber · KP; samo kanali koji imaju vrednost);
  - mete su ≥ 44 px.

## 6. Tehnika i granice
- **Stack:**
  - Next 16.4 App Router, React 19.3, TypeScript strict;
  - Tailwind v4 preko `@tailwindcss/turbopack` pravila u `next.config.ts` (dev ostaje Turbopack, ne prelazi se na webpack);
  - statički izvoz (P1).
- **Provereno 27.10:**
  - metadata rute (`sitemap.ts`, `robots.ts`, `manifest.ts`) u export modu moraju da imaju `export const dynamic = "force-static"`;
  - ruta `opengraph-image` se u exportu izvozi bez ekstenzije, zato su OG slike statični PNG u `public/og/`;
  - `tsc` traži `next typegen` pre provere (globalni tipovi `LayoutProps`/`PageProps`).
- **Nov kod ide u:**
  - `app/` (rute);
  - `components/{ui,layout,sections,brand,motion}`;
  - `content/` (sav tekst i podaci, tipizovano, jedini izvor teksta);
  - `lib/` (linkovi, VIN, SEO, GSAP, formatiranje);
  - `scripts/` (check-site, serve-out, OG slike);
  - `tests/unit/` (vitest), `tests/e2e/` (Playwright);
  - `public/images/`.
- **Paketi:**
  - `gsap`, `@gsap/react`, `@phosphor-icons/react`, `@fontsource-variable/public-sans`;
  - dev: `vitest`, `@playwright/test`, `@axe-core/playwright`, `sharp` (samo skripte).
  - Merenje: `npx lighthouse@13.5.0`, ne kao zavisnost.
  - Svaki drugi paket samo uz ODLUKU (licenca MIT/Apache/ISC/OFL i veličina).
- **Performanse** (Lighthouse mobile):
  - na početnoj, asortimanu, jednom sistemu, upitu i kontaktu: performanse ≥ 95, pristupačnost 100, najbolje prakse 100, SEO 100;
  - LCP ≤ 2,0 s, CLS ≤ 0,02, TBT ≤ 150 ms;
  - JavaScript po strani što manji: GSAP i ScrollTrigger samo gde trebaju.
- **Pristupačnost:** WCAG 2.2 AA, axe 0 grešaka, tastatura, vidljiv fokus, reduced motion.
- **Jezik:** srpski, latinica, ekavica, ispravna dijakritika, `lang="sr-Latn"`.
- **Ne dirati:** `autodelovi`, git, deploy, hosting.

## 7. Provere (runner ih pušta posle svakog koraka)
Skripte `typecheck`, `test` i `check:site` su dodate u `package.json` pre runa, da bi provere bile zelene od početka. `test` i `check:site` su do K02 samo poruka; K02 ih menja pravim komandama (`vitest run`, `node scripts/check-site.mjs`).
- `npm run typecheck`: `next typegen && tsc --noEmit`.
- `npm run lint`.
- `npm run test`: vitest.
- `npm run build`: statički izvoz u `out/`.
- `npm run check:site` proverava `out/`:
  - svaka ruta iz §3 postoji;
  - interni linkovi i slike postoje;
  - svaka strana ima title, description, canonical i h1;
  - nema „lorem“, „TODO“ ni `undefined` u vidljivom tekstu;
  - P4 privremene vrednosti se ispisuju kao upozorenje, ne kao greška.

## 8. Koraci
Tačne vrednosti su u `.nocni-run/oemparts/steps.json`, a prompt svakog koraka u `.nocni-run/oemparts/prompts/<ID>.md`.

| ID | Naslov | Model | Effort | Režim | Sesija |
|---|---|---|---|---|---|
| K01 | Plan: arhitektura, dizajn i sadržaj | Opus | max | plan | nova |
| K02 | Temelj: statički Next, GSAP, tokeni, brend, sadržaj, provere | Opus | xhigh | goal | ista (K01) |
| K03 | Ljuska i početna strana | Opus | xhigh | goal | nova |
| K04 | Asortiman, sistemi, marke i modeli | Opus | xhigh | goal | nova |
| K05 | Upit po šasiji, kontakt i saradnja | Opus | xhigh | goal | nova |
| K06 | O nama, kako kupiti, pravne strane i SEO | Sonnet | high | goal | nova |
| K07 | Pokret, telefon, pristupačnost, brzina i e2e | Opus | xhigh | goal | nova |
| K08 | Revizija, izveštaj i predaja | Opus | max | goal | nova |

## 9. Kraj runa
- `docs/OEMPARTS-REPORT.md` sadrži:
  - šta je urađeno, šta nije, BLOKADE;
  - šta Jovan ručno proverava;
  - predloge P1–P11 za potvrdu;
  - kako se sajt postavlja na hosting.
- `README.md` (srpski): pokretanje, gde se menja sadržaj, build i postavljanje.
- `docs/PODACI-OD-KLIJENTA.md`: sve što klijent treba da pošalje ili potvrdi.
- Snimci svih strana (390 i 1440 px) u `docs/oemparts/snimci/`.
- Merenja u `docs/oemparts/merenja.md`.

<!-- Odluke koje koraci donesu tokom noći idu u njihove sekcije u docs/OEMPARTS-PROGRESS.md (red **ODLUKE:**), ne ovde. -->
