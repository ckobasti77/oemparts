# Merenja (K07)

Datum: 27.10.2026, noćni run, Windows 11, Chrome 156 sa računara, `npx lighthouse@13.5.0`.
Sajt: statički izvoz (`npm run build`) na `npm run preview` (http://localhost:3241, brotli, HTTP/1.1).
Skripta: `npm run lighthouse` (`scripts/lighthouse.mjs`): pet strana iz budžeta, 3 merenja po
strani, medijana; pre merenja strana i njeni resursi se jednom preuzmu, da preview server već ima
kompresovane fajlove (kao hosting sa keširanjem). Na računaru su radili i drugi projekti; tuđi
procesi nisu gašeni.

## Lighthouse mobile, simulirano prigušenje (zvanično merenje, plan §6)

Moto G Power, Slow 4G, 4× CPU (podrazumevano). Medijana 3 merenja; raspon performansi između
merenja je 0 na svih pet strana.

| Strana | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| `/` | **93** | 100 | 100 | 100 | 3,25 s | 0 | 24 ms | 1,05 s |
| `/asortiman/` | **91** | 100 | 100 | 100 | 3,48 s | 0 | 24 ms | 1,05 s |
| `/asortiman/kocnice/` | 96 | 100 | 100 | 100 | 2,80 s | 0 | 25 ms | 1,05 s |
| `/upit/` | 96 | 100 | 100 | 100 | 2,73 s | 0 | 24 ms | 1,05 s |
| `/kontakt/` | 96 | 100 | 100 | 100 | 2,72 s | 0 | 38 ms | 1,05 s |

Budžet (plan §6): performanse ≥ 95, pristupačnost / najbolje prakse / SEO 100, LCP ≤ 2,0 s,
CLS ≤ 0,02, TBT ≤ 150 ms.
- Ispunjeno: pristupačnost, najbolje prakse i SEO 100 na svih pet; CLS 0; TBT 19–43 ms;
  performanse ≥ 95 na tri strane.
- Nije ispunjeno: performanse na `/` (93) i `/asortiman/` (91) i LCP ≤ 2,0 s na svih pet.
  Razlog je ispod.

Pre K07 (jedno merenje, isti računar): `/` 99*, `/asortiman/` 87 (LCP 4,08 s), ostale 96.
*Hladan server za pregled (kompresija pri prvom zahtevu) je slučajno zakasnio JS iza prvog
iscrtavanja. Sa zagrejanim serverom početna je tokom K07 merena 92–93.

## Zašto simulirani LCP prelazi 2,0 s (i performanse 91–93 na dve strane)

Podrazumevani Lighthouse (simulirano prigušenje, „Lantern“) ne meri sporu mrežu. Učita stranu
punom brzinom, zapiše redosled, pa iz tog zapisa *računa* kako bi to izgledalo na Slow 4G
(150 ms RTT, 1,6 Mb/s) i 4× sporijem procesoru. Za LCP uzima sve zahteve koji su se završili pre
posmatranog LCP-a i sav JS koji je izvršen pre prvog iscrtavanja.

Na `npm run preview` (localhost) to daje lošiju sliku od stvarne:
- **Sav JS stigne pre prvog iscrtavanja.** Lokalni server isporuči HTML, CSS, fontove i ~130 KB
  JS-a za ~25 ms. Svako merenje pokreće nov Chrome, a prvi frame hladnog Chrome-a traje
  ~120–340 ms (provereno: i sa isključenim JS-om prvo iscrtavanje je na ~330 ms; u toplom
  pregledaču ~85 ms). Do tada React već hidrira stranu, pa Lantern računa ceo JS (React 19 +
  Next 16: 65 + 42 KB gzip, naš kod ~10 KB) kao da blokira LCP i dodaje ~1,5 s za njegovo
  preuzimanje na Slow 4G. Na pravoj mreži HTML i CSS stižu pre JS-a i strana se iscrta pre
  hidratacije.
- **Lenje slike van ekrana ulaze u račun.** Chrome lenje slike počinje da preuzima kad su bliže
  od ~1250 px ekranu. Na početnoj (10 rendera sistema, ~147 KB) i na asortimanu (~265 KB)
  završe se pre posmatranog LCP-a, pa ih Lantern dodaje LCP slici. Zato te dve strane imaju
  LCP ~3,3–3,5 s i performanse 91–93, a strane sa tekstualnim LCP-om ~2,7–2,8 s i 96.
- `devtools` prigušenje (tabela ispod) stvarno usporava mrežu i procesor u pregledaču, pa je
  redosled kao na telefonu. Ono je bliže onome što korisnik vidi.

Probano i odbačeno:
- `experimental.inlineCss` (CSS u HTML-u): HTML naraste na 61–70 KB gzip (budžet 40), jer se
  CSS ponavlja i u RSC podacima.
- `content-visibility: auto` na sekcijama ispod ekrana: Chrome i dalje preuzima lenje slike.
- Ručno odlaganje rendera ispod ekrana preko IntersectionObserver-a: traži JS za svaku sliku i
  rezervu bez JS-a, a stvarni dobitak je mali (slike su niskog prioriteta, LCP slika je visokog).

Urađeno u K07 da se smanji ono što stvarno ide ispred LCP-a:
- GSAP i ScrollTrigger kreću tek posle `load` i prvog iscrtavanja, i samo gde trebaju (pre K07
  GSAP od 26 KB je išao u mirovanju na svakoj strani, i pre prvog iscrtavanja).
- Slika „rasklopljen auto“ (17 KB) se preuzima tek kad se pretapanje aktivira.
- Na `/asortiman/` je LCP render (prvi red) odmah i sa `fetchpriority="high"` (pre: lenj, nizak
  prioritet, LCP 4,1 s i performanse 85–87).

## Lighthouse mobile, `devtools` prigušenje (provera, `npm run lighthouse -- --metoda devtools`)

Pregledač stvarno usporava mrežu i procesor (isti profil: Slow 4G, 4× CPU). Medijana 3 merenja.

| Strana | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | Raspon perf |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 87 | 100 | 100 | 100 | 2,18 s | 0 | 386 ms | 2,16 s | 13 |
| `/asortiman/` | 89 | 100 | 100 | 100 | 2,14 s | 0,001 | 347 ms | 2,13 s | 1 |
| `/asortiman/kocnice/` | 92 | 100 | 100 | 100 | 2,09 s | 0,001 | 252 ms | 2,09 s | 7 |
| `/upit/` | 93 | 100 | 100 | 100 | 2,01 s | 0 | 236 ms | 2,01 s | 10 |
| `/kontakt/` | 90 | 100 | 100 | 100 | 1,94 s | 0 | 351 ms | 1,94 s | 5 |

- **LCP je 1,94–2,18 s**, a ne 2,7–3,5 s kao u simulaciji: kad mreža stvarno kasni, strana se
  iscrta pre nego što JS stigne, pa je LCP jednak FCP-u (tekst ili hero slika odmah). To
  potvrđuje objašnjenje iznad.
- **TBT je 236–386 ms** (budžet 150). Duge zadatke čine prvo raspoređivanje i iscrtavanje strane u
  hladnom Chrome-u (zadatak bez skripte od 345–521 ms) i hidratacija React-a (`react-dom`,
  150–285 ms), sve pod 4× usporenim procesorom. CPU prigušenje na Windows-u sa drugim procesima je
  bučno (raspon do 13 poena između merenja iste strane), pa su ovi brojevi orijentacioni.
- A/B provera stila u toplom pregledaču pod 4× CPU (`text-wrap`, `backdrop-filter`,
  `scroll-margin-top`): razlike su u šumu; nijedna CSS osobina ne nosi poseban trošak.

## JavaScript po strani (gzip, `npm run check:site`)

Početni JS (skripte u HTML-u, bez lenjih delova): 138,8 KB na većini strana, `/` 139,7 KB,
`/kontakt/` 142,6 KB, `/upit/` 146,0 KB (budžet iz K02: 145 KB; forma, vidi K05). Od toga je
osnova Next 16.4 + React 19.3 oko 130 KB. GSAP (26 KB) i ScrollTrigger (17 KB) nisu u početnom
JS-u: GSAP se učitava posle prvog iscrtavanja samo na stranama sa reveal metama (i za meni ispod
1280 px), ScrollTrigger samo na početnoj. Kolona „JS (KB, prenos)“ u izlazu skripte je ukupan
preneti JS tokom merenja, sa lenjim delovima: 181 KB `/`, 157 KB `/asortiman/`, 164–168 KB ostale.

HTML 26,1–39,4 KB gzip (budžet 40), CSS 10,8 KB (budžet 20).

