# Euromotors Plus · OEM Parts — sajt

Statički sajt veleprodaje originalnih i OEM delova za vozila VW grupe (Volkswagen, Audi, Škoda, SEAT, Cupra).
Sajt ne prodaje online. Kupca šalje na KupujemProdajem prodavnicu i na direktan kontakt: telefon, Viber, WhatsApp, mejl i upit po broju šasije.

- Next.js 16.4 (App Router), React 19.3, TypeScript, Tailwind v4, GSAP, Phosphor ikone.
- Statički izvoz: `npm run build` pravi gotov sajt u folderu `out/`. Server nije potreban.
- Nema baze, naloga, korpe, analitike ni kolačića. Forma za upit ništa ne šalje na server.

## Pokretanje

Potreban je **Node.js 22.18 ili noviji** (`node -v`).

```bash
npm ci          # instalira pakete tačno po package-lock.json
npm run dev     # razvoj: http://localhost:3240
```

Portovi su 3240 (razvoj) i 3241 (pregled izvoza). Portovi 3000 i 3001 se ne koriste.

## Gde se menja sadržaj

Sav tekst i svi podaci su u folderu `content/`. U komponentama nema teksta.

| Fajl | Šta je u njemu |
|---|---|
| `content/site.ts` | **Kontakt i firma:** telefon, Viber, WhatsApp, mejl, link KP prodavnice, domen, adresa, radno vreme, podaci firme. |
| `content/pocetna.ts` | Tekstovi početne strane. |
| `content/asortiman.ts` | 10 sistema i 44 grupe delova: nazivi, opisi, saveti, meta opisi. |
| `content/vozila.ts` | Marke i modeli. |
| `content/upit.ts` | Forma za upit: oznake polja, pomoć, poruke grešaka. |
| `content/saradnja.ts` | Strana „Saradnja za servise i firme“. |
| `content/kupovina.ts` | „Kako kupiti“: koraci i česta pitanja. |
| `content/stranice.ts` | „O nama“, „Kontakt“, 404 i naslovi i opisi strana. |
| `content/pravno.ts` | Politika privatnosti i uslovi korišćenja. |
| `content/navigacija.ts` | Meni, footer, oznake kanala. |

### `content/site.ts` — najvažniji fajl

Sada su u njemu **privremene vrednosti** (telefon `+381 60 000 0000`, mejl `info@example.com`, domen `https://www.example.com`, KP link ka početnoj strani KupujemProdajem). Pre objave ih treba zameniti pravim podacima. Spisak svega što klijent šalje je u `docs/PODACI-OD-KLIJENTA.md`.

Pravila:
- **Prazno polje se ne prikazuje.** Ako firma nema WhatsApp, upiše se `whatsapp: ""` i WhatsApp nestaje sa celog sajta (header, meni, donja traka, kontakt, forma, rečenice koje nabrajaju kanale). Izuzetak su pravne strane (`content/pravno.ts`): one pominju Viber, WhatsApp i mejl stalnim tekstom, pa ih posle uklanjanja kanala treba uskladiti ručno.
- **Telefon je obavezan**, jer nekoliko stalnih rečenica (npr. „Pozovite nas ili pišite.“ na početnoj i kontaktu) poziva na telefon. Piše se sa pozivnim brojem (`+381 64 123 4567`) ili kao `064 123 4567`.
- **KP link** mora da bude `https://` adresa na `kupujemprodajem.com`, inače se ne prikazuje.
- **Domen** se piše bez kose crte na kraju (`https://www.primer.rs`). Koristi se za canonical, sitemap, robots i slike za deljenje.
- **Adresa, radno vreme i podaci firme** su sada prazni, pa se ti blokovi ne vide. Kad se popune, na `/kontakt/` se pojavljuju radno vreme, adresa sa mapom na klik i podaci firme. Radno vreme i adresa se vide i u footeru i u kontaktu na početnoj, a podaci firme u footeru i na pravnim stranama.

Primer popunjenog radnog vremena i adrese:

```ts
radnoVreme: [
  { dani: ["pon", "uto", "sre", "cet", "pet"], od: "08:00", do: "16:00" },
  { dani: ["sub"], od: "09:00", do: "13:00" },
],
adresa: { ulica: "Ulica i broj", postanskiBroj: "11000", mesto: "Beograd", mapaUpit: "" },
firma: { naziv: "Tačan naziv iz APR-a", pib: "…", mb: "…", sediste: "…" },
```

Posle izmene pokrenite `npm run build`, pa `npm run check:site`: privremene vrednosti koje su ostale ispisuje kao upozorenje.

### Slike

- `public/images/delovi/` — renderi grupa delova. Posle zamene slike: `npm run images` (pravi manje `-384` varijante).
- `public/images/hero/` — render auta na početnoj (sklopljen i rasklopljen).
- `public/og/` — slike za deljenje na mrežama (1200 × 630). Posle promene naslova ili logotipa: `npm run og`, pa `npm run build`. Skripta koristi Chrome sa računara.

## Build i statički pregled

```bash
npm run build        # statički izvoz u out/
npm run check:site   # provera out/: strane, linkovi, slike, meta podaci, sitemap, veličine
npm run preview      # služi out/ na http://localhost:3241 (kao pravi hosting)
```

`preview` vraća 404 stranu sa statusom 404 i preusmerava adrese bez „/“ na kraju (`/kontakt` → `/kontakt/`), kao što radi hosting.

Na Windows-u `npm run build` posle `next build` pokreće `scripts/fix-export-segments.mjs`. Next 16.4.3 na Windows-u upisuje deo fajlova za prefetch u podfoldere, a pregledač ih traži u korenu strane. Skripta ih premesti. Na Linux hostingu nema šta da radi.

### Provere

```bash
npm run typecheck    # next typegen + tsc
npm run lint
npm run test         # unit testovi (vitest)
npm run e2e          # gradi, diže out/ na 3241 i pušta Playwright testove (Chrome sa računara; ~3 min)
npm run lighthouse   # Lighthouse nad 5 strana (preview mora da radi na 3241)
```

Lighthouse se pušta preko `npx lighthouse@13.5.0` (nije zavisnost projekta), a JSON izveštaji idu u `.nocni-run/oemparts/tmp/lh/` (van gita). Merenja iz runa su u `docs/oemparts/merenja.md`; konačnu ocenu daje PageSpeed Insights nad objavljenim sajtom.

## Postavljanje na hosting

Sajt je običan folder sa HTML, CSS, JS i slikama. Radi na svakom hostingu koji služi statičke fajlove. Svaka adresa se završava sa „/“ (`/kontakt/`), a svaka strana je `index.html` u svom folderu.

Pre objave:
1. Upisati prave podatke u `content/site.ts` (najmanje telefon, mejl, KP link i domen).
2. `npm run build` i `npm run check:site` bez grešaka (upozorenja za privremene vrednosti treba da nestanu).
3. `npm run preview` i pregled sajta na http://localhost:3241.

### cPanel (deljeni hosting, Apache)

1. `npm run build` na svom računaru.
2. U File Manager-u (ili FTP-om) otvoriti `public_html/` i uploadovati **sadržaj** foldera `out/` (ne sam folder `out`). U korenu `public_html/` treba da budu `index.html`, `404.html`, `_next/`, `images/`, `asortiman/` …
3. U `public_html/` napraviti ili dopuniti `.htaccess`:

```apache
# 404 strana
ErrorDocument 404 /404.html

# HTTPS (kad sertifikat radi)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Tipovi koje stariji Apache ne zna
AddType image/avif .avif
AddType image/webp .webp
AddType application/manifest+json .webmanifest
AddType font/woff2 .woff2

# Keš: _next/static se nikad ne menja (ime sadrži hash); HTML i .txt podaci strana se uvek proveravaju
<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.(html|txt)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>

  # Zaglavlja bezbednosti
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

Apache sam preusmerava `/kontakt` na `/kontakt/` (folder sa `index.html`, podrazumevano `DirectorySlash On`). Ako hosting ima i `www` i adresu bez `www`, jedna treba da preusmerava na drugu, i to na onu koja je upisana u `site.domen`.

Zaglavlja i `.htaccess` nisu deo izvoza: dodaju se ručno na hostingu, jednom.

Napomene za cPanel:
- Neki fajlovi u `out/asortiman/<sistem>/` imaju znak `$` u imenu (`__next.asortiman.$d$sistem.__PAGE__.txt`). Posle uploada otvoriti jednu stranu sistema i u alatkama pregledača (Network) proveriti da nema grešaka 404. Ako ih ima, FTP program je preskočio te fajlove; uploadovati ih ponovo.
- Pri novom postavljanju ne brisati odmah stari `_next/static/`: otvoreni tabovi još traže stare fajlove. Dovoljno je prepisati nove preko starih.
- `Strict-Transport-Security` (HSTS) dodati tek kad HTTPS sigurno radi na svim adresama.
- Ako je ispred hostinga Cloudflare sa SSL režimom „Flexible“, pravilo za HTTPS iznad pravi beskonačno preusmerenje. Tada koristiti režim „Full“ ili preusmerenje uključiti u Cloudflare-u, a ne u `.htaccess`.
- Politika sadržaja (CSP) nije uključena. Ako se uvodi, mora da dozvoli Next-ove ugrađene skripte (`'unsafe-inline'`) i `frame-src https://www.google.com` za mapu na klik. Proveriti u pregledaču pre objave.

### Netlify

- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Node:** 22 (čita se iz `.nvmrc`; ako ne, u podešavanjima build-a promenljiva `NODE_VERSION` = `22`).

Netlify sam služi `404.html` za nepostojeće adrese. Zaglavlja bezbednosti se dodaju fajlom `_headers` u izlazu: napraviti `public/_headers` (Next ga kopira u `out/`):

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

### Cloudflare Pages

- **Framework preset:** None (ili „Next.js (Static HTML Export)“)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Node:** 22 (čita se iz `.nvmrc`; ako ne, promenljiva `NODE_VERSION` = `22`).

Cloudflare Pages služi `index.html` iz foldera strane i `404.html` iz korena izlaza. Isti `public/_headers` fajl kao za Netlify radi i ovde.

### Vercel

- Uvesti repozitorijum. **Framework Preset:** Next.js. **Build Command:** `npm run build`.
- Vercel prepoznaje `output: "export"` iz `next.config.ts` i objavljuje statički izvoz.
- Ako Vercel prijavi grešku za izlazni folder, izabrati **Framework Preset: Other** i **Output Directory:** `out`. Tada je potreban i `vercel.json` sa `"trailingSlash": true`, da `/kontakt` vodi na `/kontakt/`.
- Vercel ne čita `_headers`. Zaglavlja bezbednosti se zadaju u `vercel.json` (polje `headers`).
- Node verziju čita iz `engines` u `package.json` (≥ 22.18).

## Domen i provera posle objave

1. U `content/site.ts` upisati pravi domen (`domen: "https://www.primer.rs"`), pa `npm run build` i ponovo postaviti `out/`. Canonical, sitemap, robots i linkovi slika za deljenje se prave iz ovog polja.
2. Na hostingu uključiti HTTPS i preusmerenje `http` → `https` i `www` ↔ bez `www` (na adresu iz `site.domen`).

Posle objave proveriti:
- [ ] Početna, asortiman, jedan sistem, upit, kontakt i 404 (`https://domen/nema-ove-strane/` vraća 404 stranu sa statusom 404).
- [ ] `https://domen/kontakt` preusmerava na `https://domen/kontakt/`.
- [ ] `https://domen/sitemap.xml` i `https://domen/robots.txt` imaju pravi domen.
- [ ] Na pravom telefonu: „Pozovite“, Viber, WhatsApp, mejl i KP link. Na `/upit/` sastaviti poruku i probati „Pošalji na Viber“ (poruka se kopira; ako se ne pojavi u Viberu, nalepi se), „Pošalji na WhatsApp“ i „Pošalji mejlom“.
- [ ] Deljenje linka (Viber, Facebook): slika i naslov. Facebook Sharing Debugger osvežava keš.
- [ ] PageSpeed Insights (https://pagespeed.web.dev/) za `/` i `/asortiman/`, telefon. Cilj: performanse ≥ 95, ostalo 100.
- [ ] Google Search Console: dodati domen i poslati `sitemap.xml`.

## Struktura

```
app/          rute (svaka strana je folder sa page.tsx)
components/   ui/, layout/, sections/, brand/, motion/ (GSAP samo ovde)
content/      sav tekst i podaci
lib/          linkovi, VIN, upit, SEO, JSON-LD, formatiranje, rute
scripts/      check-site, serve-out (preview), images, og, lighthouse, fix-export-segments
tests/        unit/ (vitest), e2e/ (Playwright)
public/       slike, OG slike, ikonice
docs/         plan, napredak, izveštaj, podaci od klijenta, merenja, snimci
```

Dizajn sistem je opisan u `DESIGN.md`, a proizvod u `PRODUCT.md`.
