@AGENTS.md

# OEMPARTS — Euromotors Plus · OEM Parts

Statički sajt (Next 16.4, `output: "export"`) za veleprodaju originalnih i OEM delova za vozila VW grupe.
Ne prodaje online: šalje na KupujemProdajem (KP) prodavnicu i na direktan kontakt.
Plan: `docs/OEMPARTS-PLAN.md`, tehnički plan: `docs/oemparts/planovi/K01.md`, dizajn: `DESIGN.md`, proizvod: `PRODUCT.md`.

## Komande
- `npm run dev` — razvoj, http://localhost:3240
- `npm run build` — statički izvoz u `out/`
- `npm run preview` — služi `out/` na http://localhost:3241
- `npm run typecheck` (next typegen && tsc --noEmit) · `npm run lint` · `npm run test` (vitest)
- `npm run check:site` — provera `out/` (posle build-a)
- `npm run images` — `-384` varijante rendera (samo kad se menjaju slike)
- `npm run og` (od K06) · `npm run e2e` (od K07) · `npm run lighthouse` (od K07, preview mora da radi)
- Portovi su 3240 i 3241. 3000 i 3001 nisu naši; tuđe procese ne gasi.

## Folderi
- `app/` rute · `components/{ui,layout,sections,brand,motion}` · `content/` (sav tekst i podaci, jedini izvor teksta)
- `lib/` (linkovi, VIN, upit, SEO, JSON-LD, format, rute, motion konstante) · `scripts/` · `tests/unit`, `tests/e2e` · `public/images`
- `_izvor/autodelovi/` je materijal starog sajta (gitignored, samo čitanje; kod je `.txt`, ne importuje se).

## Pravila
- Next 16.4 je noviji od tvog znanja: pre koda pročitaj vodič u `node_modules/next/dist/docs/`.
- Statički izvoz: bez server akcija, API ruta, cookies/headers, middleware/proxy, ISR.
  - Metadata rute imaju `export const dynamic = "force-static"`.
  - Dinamičke rute imaju `generateStaticParams` i `dynamicParams = false`.
  - Interni linkovi uvek sa `/` na kraju (iz `lib/routes.ts`).
- Tekst: srpski, latinica, ekavica, č ć š ž đ, navodnici „…“, kratke rečenice, ton veleprodaje.
  - Bez izmišljenih činjenica (godine, broj artikala, rokovi, garancije, popusti, cene).
  - Nedostajuće ide u `docs/PODACI-OD-KLIJENTA.md`.
- Kontakt i firma samo iz `content/site.ts`. Prazna vrednost znači da se kanal ili blok ne prikazuje.
- Marke vozila i KupujemProdajem samo tekstom, bez logotipa i boja.
- `content/*.ts`: bez value importa (samo `import type`), bez enum/namespace (Node ih čita u scripts/).
- Dizajn:
  - tokeni iz `app/globals.css`, nikad hex u komponentama;
  - radijusi 6/10/14/20 po ulozi;
  - fokus prsten 2 px, prati oblik;
  - mete ≥ 44 px (dugmad i polja 48);
  - jedna primarna (narandžasta) akcija po oblasti.
- Pokret:
  - GSAP samo kroz `components/motion/` (ESLint to brani); animiraju se samo transform i opacity;
  - ništa ne ostaje sakriveno;
  - `prefers-reduced-motion` znači bez pomeranja;
  - LCP slika nikad nije na opacity 0.
- Slike: lokalne, `width`/`height` ili `aspect-ratio`, `alt` na srpskom, dekorativne `alt=""`.
- Logo i velike SVG putanje nikad u `"use client"` fajlu; prosledi ih kao children.
- Ne pravi: korpu, naloge, admin, bazu, API, kolačiće, analitiku, 3D/WebGL, CMS, UI biblioteke.
