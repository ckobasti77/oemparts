# Pravila noćnog runa OEMPARTS — važe za svaki korak

Radiš nenadzirano dok Jovan spava i niko ne može da ti odgovori na pitanje. Kad naiđeš na nejasnoću:
1. Izaberi najkonzervativniju opciju.
2. **Zapiši je** u svojoj sekciji u `docs/OEMPARTS-PROGRESS.md`, u redu **ODLUKE:** (šta si izabrao i zašto).
3. Nastavi.

Ne improvizuj tiho.

## Kontekst
Pravimo nov, jednostavan sajt za **Euromotors Plus · OEM Parts**, veleprodaju originalnih i OEM delova za vozila VW grupe (Volkswagen, Audi, Škoda, SEAT, Cupra).
- **Šta sajt radi:** ne prodaje online. Daje informacije, gradi poverenje i šalje kupce na vlasnikovu KupujemProdajem prodavnicu i na direktan kontakt: telefon, Viber, WhatsApp, mejl i upit po broju šasije.
- **Izgled:** tamni, kao stari sajt, ali jednostavniji i klasičniji, sa radijusima svuda.
- **Nije cilj:** korpa, nalozi, admin, baza, 3D/WebGL, CMS, analitika i kolačići.

Izvori istine:
- `docs/OEMPARTS-PLAN.md`: odluke (O1…O9), predlozi (P1…P11), mapa sajta, obim, granice i koraci.
- `docs/oemparts/planovi/<ID>.md`: tehnički plan (K01).
- `docs/OEMPARTS-PROGRESS.md`: šta su prethodni koraci uradili, ODLUKE i BLOKADE.

## Obavezno pročitaj pre pisanja koda
1. `AGENTS.md`: ovo je Next 16.4, noviji od tvog znanja. Pre koda pročitaj relevantni vodič u `node_modules/next/dist/docs/` (static exports, metadata, fonts, images, `generateStaticParams`).
2. `CLAUDE.md`, kad ga K02 napravi.
3. `docs/OEMPARTS-PLAN.md` i `docs/oemparts/planovi/K01.md`.
4. `docs/OEMPARTS-PROGRESS.md`.
5. `_izvor/autodelovi/INDEX.md`. To je spisak materijala iz starog sajta.
   - Kod je sa nastavkom `.txt`: čitaj ga i prilagodi, ali ga ne importuj.
   - Folder je u `.gitignore`. Zato ga otvaraj direktno po putanji; Grep i Glob ga mogu preskočiti.

## Skillovi (`.claude/skills/`)
- **Pre UI koda:**
  - `impeccable`: pročitaj `SKILL.md`, pa `reference/craft-floor.md`; za novu stranu `reference/new-work.md`; na kraju koraka kratak `critique` ili `polish`.
  - `design-taste-frontend`;
  - `ui-ux-pro-max`: paleta, tipografija, UX pravila;
  - `design-dna`: doslednost sa starim sajtom.
- **Pokret:** `gsap-core`, `gsap-react` (useGSAP i čišćenje), `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`, `gsap-utils`, `gsap-plugins`, `motion-design`.
- **SEO i struktura:** `seo-technical`, `seo-schema`, `seo-local`, `seo-page`, `seo-sitemap`, `seo-images`, `seo-content`, `site-architecture`.
- **Detalji izrade:** `apple-design`, samo za zanat, ne za stil.

Kad se savet skilla sudari sa ovim pravilima ili sa planom, pobeđuju pravila i plan. Ovde, kao i u impeccable-u, ne dodaješ činjenice koje vlasnik nije dao (vidi „Tekst“).

## Radnici (subagenti)
Glavne odluke i ključni kod radiš ti. Sitne, nezavisne poslove možeš dati radnicima preko alata `Agent`, paralelno kad su nezavisni:
- `model: "sonnet"`: pregled ekrana i snimaka, lektura srpskog teksta, provera linkova, pretraga po repou, testovi po tvom opisu.
- `model: "haiku"`: najsitnije mehaničke provere (spisak fajlova, grep, prebrojavanje).

Rezultat radnika uvek proveriš pre nego što ga prihvatiš.

## Apsolutne zabrane
- **Git:** NE radi `git push`, `git commit`, `git reset`, `git clean`, `git checkout`, `git switch`, `git stash`, `git rebase`, `git merge`. Runner sam pravi commit posle koraka.
- **Deploy i objava:** NE objavljuj sajt nigde (vercel, netlify, wrangler, gh, ftp, scp). Ne kupuj domen i ne pravi naloge. Sve ostaje lokalno.
- **Tajne:** NE postavljaj env varijable i NE upisuj tajne ni ključeve u kod ili dokumente.
- **Van obima:**
  - NE diraj folder `autodelovi` i ne pokušavaj da mu pristupiš; materijal je u `_izvor/autodelovi/`.
  - NE pravi korpu, naloge, admin, bazu, Convex, 3D/WebGL, CMS, kolačiće, analitiku, server akcije ni API rute sa zahtevom.
  - NE gasi procese drugih projekata na ovom računaru (portovi 3000 i 3001 mogu biti njihovi).
- **Paketi:**
  - Dozvoljeni su: `gsap`, `@gsap/react`, `@phosphor-icons/react`, `@fontsource-variable/public-sans`, a za dev `vitest`, `@playwright/test`, `@axe-core/playwright`, `sharp`.
  - Lighthouse se pušta preko `npx lighthouse@13.5.0`, ne kao zavisnost.
  - Svaki drugi paket samo uz ODLUKU (licenca MIT/Apache/ISC/OFL i veličina). Bez UI biblioteka (shadcn, MUI, …).
- **Mreža:** build ne sme da zavisi od interneta. Nema slika ni fontova sa tuđih domena; vidi P7 za izuzetak sa fontom.
- **Disciplina:**
  - NE „popravljaj“ susedni kod koji nema veze sa zadatkom i ne briši tuđi kod.
  - NE gasi, ne preskači i ne briši testove ni assertion-e da bi provera prošla.
  - NE ostavljaj pokrenut dev server ni druge procese na kraju koraka.
  - Privremene fajlove drži u `.nocni-run/oemparts/tmp/`. Ne briši fajlove van njega osim kad to zadatak traži.
  - NE briši redove `/_izvor/` i `/.claude/skills/` iz `.gitignore`, niti ignore unose u `eslint.config.mjs`.

## Konvencije repoa
- **Next:**
  - Statički izvoz (P1): `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`; bez `cacheComponents` i `partialPrefetching`.
  - Ne koristi ništa što traži server: `cookies()`, `headers()`, server akcije, middleware/proxy, ISR.
  - Metadata rute (`sitemap.ts`, `robots.ts`, `manifest.ts`) imaju `export const dynamic = "force-static"`.
  - Dinamičke rute imaju `generateStaticParams` i `dynamicParams = false`.
- **Folderi:**
  - `app/`: rute;
  - `components/{ui,layout,sections,brand,motion}`;
  - `content/`: sav tekst i podaci, tipizovano, jedini izvor teksta;
  - `lib/`: linkovi, VIN, SEO, GSAP, format;
  - `scripts/`;
  - `tests/unit/` (vitest), `tests/e2e/` (Playwright);
  - `public/images/`.
- **Tekst:**
  - Srpski, latinica, ekavica, ispravna dijakritika (č ć š ž đ), navodnici „…“.
  - Kratke, jasne rečenice, bez marketinških fraza.
  - Ton je veleprodajni (O6): servisi, mehaničari, firme.
  - **Bez izmišljenih činjenica i brojki (P5):** ne pišeš godine rada, broj artikala, rokove isporuke, garancije, popuste ni cene. Gde tekst traži činjenicu, piši neutralno i dodaj stavku u `docs/PODACI-OD-KLIJENTA.md` (napravi ga ako ne postoji).
- **Kontakt i firma** dolaze samo iz `content/site.ts` (P4). Kanal bez vrednosti se nigde ne prikazuje.
- **Marke** se pominju samo tekstom, bez tuđih logotipa i boja (P6).
- **Dizajn:**
  - tamna tema iz `DESIGN.md` (K02) i plana K01;
  - u komponentama tokeni, ne hex vrednosti;
  - radijusi iz skale, nigde oštri ćoškovi (osim ivica koje dodiruju ekran i tankih linija);
  - fokus prsten prati oblik;
  - mete ≥ 44 px.
- **Pokret:**
  - GSAP samo preko zajedničkog primitiva iz K02 (`components/motion/`);
  - animiraju se samo transform i opacity;
  - ništa ne ostaje sakriveno bez JS-a ili kad se skroluje brzo;
  - `prefers-reduced-motion` znači bez pomeranja.
- **Slike:** lokalne, sa `width`/`height` ili `aspect-ratio` (bez CLS) i sa `alt` na srpskom; dekorativne imaju `alt=""`.
- **Tailwind** ne skenira `_izvor/` i `.claude/skills/` (gitignored). Ne dodaji `@source` ka njima.
- **Testovi** prate postojeće u `tests/unit/` (K02).

## Vizuelna provera (koraci koji menjaju UI)
- **Sa Playwright MCP-om:**
  1. Pusti `npm run dev` (port 3240) u pozadini ili, za statičku verziju, `npm run build` pa `npm run preview` (port 3241).
  2. Proveri izmenjene strane na 390 × 844 i 1440 × 900. Pre snimka skroluj do dna i nazad, da se animacije odigraju.
  3. Snimci idu u `docs/oemparts/snimci/<ID>-<strana>-<širina>.png`. Pogledaj svaki.
  4. Pre kraja koraka uradi kratku impeccable kritiku promenjenih strana i popravi ono što nađeš.
  5. Na kraju UGASI dev ili preview server.
- **Tema** je jedna (tamna), pa nema snimaka druge teme.
- **Bez Playwright-a:** upiši to u progress i osloni se na testove.

## Definicija završenog koraka
Korak nije gotov dok ne prođu:

    npm run typecheck        (next typegen && tsc --noEmit)
    npm run lint
    npm run test
    npm run build && npm run check:site

Runner posle tebe ponovo pušta provere, build i `check:site`. Ako padnu, vratiće ti grešku u istoj sesiji. Provera ili test koji su padali i PRE runa (`.nocni-run/oemparts/baseline.txt`) nisu tvoja odgovornost, ali ih ne kvari dodatno.

Ako nešto realno ne može (ograničenje platforme, fali podatak, traži odluku vlasnika), napravi ostatak i upiši `BLOKADA:` sa tačnim razlogom. Blokada je ispravan ishod, hak nije.

## Na kraju SVAKOG koraka dopiši u `docs/OEMPARTS-PROGRESS.md`
```
## <ID> — <naslov>   (<datum vreme>)
**Fajlovi:** lista dodatih/izmenjenih
**Šta je urađeno:** 3–8 rečenica
**ODLUKE:** svaka nejasnoća koju si sam rešio i zašto
**Novi paketi:** ime@verzija — licenca (ili „nema“)
**Testovi:** koje si napisao/menjao i šta pokrivaju
**Rezultat provere:** typecheck / lint / test / build / check:site — prošlo ili ne
**BLOKADA:** samo ako postoji, sa tačnom porukom
**Za Jovana ujutru:** šta da proveri ručno
```
Dopisuješ na kraj i ne brišeš tuđe sekcije.
