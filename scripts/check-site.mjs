/**
 * Provera statičkog izvoza `out/` (plan §7, K01 §9.1). Pokreće se posle `npm run build`.
 *
 *   npm run check:site
 *
 * Greške (exit 1): rute, title/description/canonical/h1, interni linkovi i resursi, sidra,
 * „lorem“/„TODO“/`undefined` u vidljivom tekstu, slike bez alt-a ili dimenzija, tuđi domeni za
 * resurse, target=_blank bez rel, dev-only /stil/ sa sadržajem ili bez noindex, segmentni prefetch
 * fajlovi u podfolderima (Windows izvoz bez scripts/fix-export-segments.mjs).
 * K06: og:image i twitter:image postoje kao fajl (PNG 1200×630), JSON-LD je ispravan JSON sa
 * @context i kontaktom samo iz content/site.ts, title ≤ 60 i description 120–160 znakova,
 * sitemap.xml tačno sa javnim stranama, robots.txt sa sitemap-om i ispravan manifest.
 * Upozorenja: privremene vrednosti (P4) i veličine po strani.
 *
 * content/site.ts i content/asortiman.ts se učitavaju direktno (Node ≥ 22.18 skida tipove).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "out");

async function ucitajSadrzaj() {
  try {
    const [site, asortiman] = await Promise.all([
      import(pathToFileURL(path.join(root, "content", "site.ts")).href),
      import(pathToFileURL(path.join(root, "content", "asortiman.ts")).href),
    ]);
    return { site: site.site, PLACEHOLDERS: site.PLACEHOLDERS, SISTEMI: asortiman.SISTEMI };
  } catch (e) {
    console.error("Ne mogu da učitam content/site.ts ili content/asortiman.ts (potreban Node ≥ 22.18):");
    console.error(e?.message ?? e);
    process.exit(1);
  }
}

/** Javne rute (isto što i lib/routes.ts javneRute()). */
export function ocekivaneRute(SISTEMI) {
  return [
    "/",
    "/asortiman/",
    ...SISTEMI.map((s) => `/asortiman/${s.slug}/`),
    "/vozila/",
    "/upit/",
    "/saradnja/",
    "/o-nama/",
    "/kako-kupiti/",
    "/kontakt/",
    "/politika-privatnosti/",
    "/uslovi-koriscenja/",
  ];
}

export const DEV_RUTE = ["/stil/"];

function htmlFajlovi(dir) {
  const lista = [];
  for (const ime of readdirSync(dir)) {
    const p = path.join(dir, ime);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (ime === "_next") continue;
      lista.push(...htmlFajlovi(p));
    } else if (ime.endsWith(".html")) lista.push(p);
  }
  return lista;
}

function rutaFajla(fajl) {
  const rel = path.relative(OUT, fajl).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

const atribut = (tag, ime) => {
  const m = tag.match(new RegExp(`\\s${ime}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : null;
};

const dekoduj = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function vidljivTekst(html) {
  return dekoduj(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<template[\s\S]*?<\/template>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function postojiUOut(urlPath) {
  let p;
  try {
    p = decodeURIComponent(urlPath);
  } catch {
    return false;
  }
  const f = path.join(OUT, p);
  if (p.endsWith("/")) return existsSync(path.join(f, "index.html"));
  return existsSync(f) && statSync(f).isFile();
}

function idsStrane(html) {
  return new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((m) => m[1]));
}

/** PNG širina i visina iz IHDR zaglavlja (bez paketa). */
function velicinaPng(fajl) {
  const b = readFileSync(fajl);
  if (b.length < 24 || b.toString("latin1", 1, 4) !== "PNG") return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const sadrziMeta = (html, ime) => {
  for (const m of html.matchAll(/<meta[^>]*>/gi)) {
    const tag = m[0];
    if ((atribut(tag, "property") ?? atribut(tag, "name")) === ime) return dekoduj(atribut(tag, "content") ?? "");
  }
  return null;
};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function main() {
  if (!existsSync(OUT)) {
    console.error("Nema foldera out/. Prvo pokreni: npm run build");
    process.exit(1);
  }
  const { site, PLACEHOLDERS, SISTEMI } = await ucitajSadrzaj();
  const greske = [];
  const upozorenja = [];
  const greska = (strana, poruka) => greske.push(`${strana}: ${poruka}`);
  const domenHost = new URL(site.domen).host;

  /** og:image i twitter:image (fajl PNG 1200×630) i JSON-LD (ispravan JSON, kontakt samo iz site.ts). */
  const proveriDeljenje = (ruta, html) => {
    for (const ime of ["og:image", "twitter:image"]) {
      const v = sadrziMeta(html, ime);
      if (!v) {
        greska(ruta, `nema ${ime}`);
        continue;
      }
      let u;
      try {
        u = new URL(v);
      } catch {
        greska(ruta, `${ime} nije apsolutan URL: ${v}`);
        continue;
      }
      if (u.host !== domenHost) greska(ruta, `${ime} nije na domenu sajta: ${v}`);
      if (!postojiUOut(u.pathname)) {
        greska(ruta, `${ime} ne postoji kao fajl u out/: ${u.pathname}`);
        continue;
      }
      const dim = velicinaPng(path.join(OUT, decodeURIComponent(u.pathname)));
      if (!dim || dim.w !== 1200 || dim.h !== 630)
        greska(ruta, `${ime} nije PNG 1200×630: ${u.pathname} (${dim ? `${dim.w}×${dim.h}` : "nije PNG"})`);
    }
    const cifreTel = String(site.kontakt.telefon).replace(/\D/g, "").replace(/^0/, "381");
    for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      let podaci;
      try {
        podaci = JSON.parse(m[1]);
      } catch (e) {
        greska(ruta, `JSON-LD nije ispravan JSON: ${e.message}`);
        continue;
      }
      for (const cvor of Array.isArray(podaci) ? podaci : [podaci]) {
        if (cvor?.["@context"] !== "https://schema.org")
          greska(ruta, `JSON-LD (${cvor?.["@type"]}) nema @context https://schema.org`);
        if (!cvor?.["@type"]) greska(ruta, "JSON-LD bez @type");
        if (cvor?.telephone && String(cvor.telephone).replace(/\D/g, "") !== cifreTel)
          greska(ruta, `JSON-LD telephone ${cvor.telephone} nije iz content/site.ts`);
        if (cvor?.email && cvor.email !== site.kontakt.email)
          greska(ruta, `JSON-LD email ${cvor.email} nije iz content/site.ts`);
        for (const v of cvor?.sameAs ?? [])
          if (v !== site.kp.url) greska(ruta, `JSON-LD sameAs ${v} nije KP link iz content/site.ts`);
      }
    }
  };

  const rute = ocekivaneRute(SISTEMI);
  for (const r of rute) if (!existsSync(path.join(OUT, r, "index.html"))) greska(r, "strana ne postoji u out/");
  if (!existsSync(path.join(OUT, "404.html"))) greska("/404.html", "nema 404.html");
  const sistemiOut = readdirSync(path.join(OUT, "asortiman"), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(path.join(OUT, "asortiman", d.name, "index.html")))
    .map((d) => d.name)
    .sort();
  const sistemiOcek = SISTEMI.map((s) => s.slug).sort();
  if (JSON.stringify(sistemiOut) !== JSON.stringify(sistemiOcek))
    greska("/asortiman/", `sistemi u out/ (${sistemiOut.length}) ne odgovaraju sadržaju (${sistemiOcek.length})`);

  // Segmentni prefetch fajlovi moraju imati ravno ime (`__next.upit.__PAGE__.txt`), kako ih klijent
  // traži; podfolder `__next.*` znači da scripts/fix-export-segments.mjs nije pokrenut (Windows).
  const segmentniFolderi = [];
  const traziSegmente = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === "_next") continue;
      if (e.name.startsWith("__next.")) segmentniFolderi.push(path.relative(OUT, path.join(dir, e.name)));
      else traziSegmente(path.join(dir, e.name));
    }
  };
  traziSegmente(OUT);
  if (segmentniFolderi.length)
    greska("/", `segmentni prefetch fajlovi u podfolderima (${segmentniFolderi.length}, npr. ${segmentniFolderi[0]}); pokreni npm run build`);

  const fajlovi = htmlFajlovi(OUT);
  const htmlPoRuti = new Map(fajlovi.map((f) => [rutaFajla(f), readFileSync(f, "utf8")]));
  const velicine = [];
  // title i description javnih strana moraju biti jedinstveni (K04: 10 strana sistema)
  const naslovi = new Map();
  const opisi = new Map();
  const zapamti = (mapa, vrednost, ruta) => {
    if (vrednost) mapa.set(vrednost, [...(mapa.get(vrednost) ?? []), ruta]);
  };

  for (const [ruta, html] of htmlPoRuti) {
    const javna = rute.includes(ruta);
    const dev = DEV_RUTE.includes(ruta);
    const greska404 = ruta === "/404.html" || ruta === "/404/" || ruta === "/_not-found/";

    // 2. osnovni elementi strane
    if (javna || greska404) {
      if (!/<html[^>]*\slang="sr-Latn"/.test(html)) greska(ruta, 'nema <html lang="sr-Latn">');
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
      if (!title) greska(ruta, "nema <title>");
      const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
      if (h1 !== 1) greska(ruta, `broj <h1> je ${h1}, a treba 1`);
    }
    if (javna) {
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
      if (!desc) greska(ruta, "nema meta description");
      zapamti(opisi, desc, ruta);
      const naslovStrane = dekoduj(html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "");
      zapamti(naslovi, naslovStrane, ruta);
      if (naslovStrane.length > 60) greska(ruta, `title ima ${naslovStrane.length} znakova, a najviše je 60`);
      const opisDuzina = dekoduj(desc ?? "").length;
      if (desc && (opisDuzina < 120 || opisDuzina > 160))
        greska(ruta, `meta description ima ${opisDuzina} znakova, a treba 120–160`);
      proveriDeljenje(ruta, html);
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
      if (!canonical) greska(ruta, "nema canonical");
      else {
        let u = null;
        try {
          u = new URL(canonical);
        } catch {
          greska(ruta, `canonical nije apsolutan URL: ${canonical}`);
        }
        if (u && (u.host !== domenHost || u.pathname !== ruta))
          greska(ruta, `canonical ${canonical} ne odgovara ruti ${ruta} na domenu ${domenHost}`);
      }
    }

    // 7. dev-only strana
    if (dev) {
      if (!/<meta name="robots" content="[^"]*noindex/.test(html)) greska(ruta, "dev-only strana nema noindex");
      const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
      if (vidljivTekst(main).length >= 20) greska(ruta, "dev-only strana ima sadržaj u produkcionom izvozu");
    }

    // 3. linkovi i resursi
    const ids = idsStrane(html);
    for (const m of html.matchAll(/<(a|link|script|img|source|iframe)\b[^>]*>/gi)) {
      const tag = m[0];
      const ime = m[1].toLowerCase();
      const vrednosti = [];
      const href = atribut(tag, "href");
      const src = atribut(tag, "src");
      const srcset = atribut(tag, "srcset") ?? atribut(tag, "imagesrcset");
      if (href !== null) vrednosti.push(["href", dekoduj(href)]);
      if (src !== null) vrednosti.push(["src", dekoduj(src)]);
      if (srcset) for (const deo of dekoduj(srcset).split(",")) vrednosti.push(["srcset", deo.trim().split(/\s+/)[0]]);

      for (const [vrsta, v] of vrednosti) {
        if (!v) continue;
        if (v.startsWith("#")) {
          if (ime === "a" && v.length > 1 && !ids.has(v.slice(1))) greska(ruta, `sidro ${v} ne postoji na strani`);
          continue;
        }
        if (/^(mailto:|tel:|viber:|data:)/.test(v)) continue;
        if (/^(https?:)?\/\//.test(v)) {
          // 5. resursi samo lokalno; spoljni <a> linkovi i canonical/alternate su dozvoljeni
          const rel = (atribut(tag, "rel") ?? "").toLowerCase();
          const nijeResurs = ime === "a" || (ime === "link" && /\b(canonical|alternate)\b/.test(rel));
          if (!nijeResurs) greska(ruta, `resurs sa tuđeg domena: <${ime} ${vrsta}="${v}">`);
          continue;
        }
        if (!v.startsWith("/")) continue;
        const [bezHash, hash] = v.split("#");
        const putanja = bezHash.split("?")[0];
        if (!postojiUOut(putanja)) {
          greska(ruta, `<${ime}> ${vrsta} vodi na nepostojeće: ${v}`);
          continue;
        }
        if (ime === "a" && !path.extname(putanja) && !putanja.endsWith("/"))
          greska(ruta, `interni link bez „/“ na kraju: ${v}`);
        if (ime === "a" && hash) {
          const cilj = htmlPoRuti.get(putanja);
          if (cilj && !idsStrane(cilj).has(hash)) greska(ruta, `sidro #${hash} ne postoji na ${putanja}`);
        }
      }

      // 6. novi prozor
      if (ime === "a" && /\starget="_blank"/.test(tag)) {
        const rel = atribut(tag, "rel") ?? "";
        if (!/\bnoopener\b/.test(rel) || !/\bnoreferrer\b/.test(rel))
          greska(ruta, `target=_blank bez rel="noopener noreferrer": ${href}`);
      }
      // 5. slike
      if (ime === "img") {
        if (atribut(tag, "alt") === null) greska(ruta, `slika bez alt: ${src}`);
        if (atribut(tag, "width") === null || atribut(tag, "height") === null)
          greska(ruta, `slika bez width/height: ${src}`);
      }
    }

    // 4. vidljiv tekst
    const tekst = vidljivTekst(html);
    for (const [re, opis] of [
      [/\blorem\b/i, "lorem"],
      [/\bTODO\b/, "TODO"],
      [/\bTBD\b/, "TBD"],
      [/\bundefined\b/, "undefined"],
      [/\bnull\b/, "null"],
      [/\bNaN\b/, "NaN"],
      [/\[object Object\]/, "[object Object]"],
    ]) {
      if (re.test(tekst)) greska(ruta, `vidljiv tekst sadrži „${opis}“`);
    }

    // veličine (upozorenje)
    if (javna) {
      // Skripte sa nomodule (polyfill za stare pregledače) moderni pregledači ne učitavaju.
      const skripte = [
        ...new Set(
          [...html.matchAll(/<script\b[^>]*>/g)]
            .filter((x) => !/\snomodule\b/i.test(x[0]))
            .map((x) => atribut(x[0], "src"))
            .filter(Boolean),
        ),
      ];
      const stilovi = [...new Set([...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((x) => x[1]))];
      const gz = (lista) =>
        lista.reduce((z, s) => {
          const f = path.join(OUT, s.split("?")[0]);
          return z + (existsSync(f) ? gzipSync(readFileSync(f)).length : 0);
        }, 0);
      velicine.push({ ruta, html: gzipSync(html).length, js: gz(skripte), css: gz(stilovi) });
    }
  }

  for (const [vrsta, mapa] of [
    ["title", naslovi],
    ["description", opisi],
  ])
    for (const strane of mapa.values())
      if (strane.length > 1) greska(strane.join(", "), `isti ${vrsta} na ${strane.length} strane`);

  // sitemap.xml: tačno javne rute (apsolutne, sa „/“), nijedna dev-only
  const sitemap = path.join(OUT, "sitemap.xml");
  if (!existsSync(sitemap)) greska("/sitemap.xml", "nema sitemap.xml");
  else {
    const xml = readFileSync(sitemap, "utf8");
    const url = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => dekoduj(m[1]));
    const ocekivano = rute.map((r) => new URL(r, site.domen).href);
    for (const r of DEV_RUTE) if (xml.includes(r)) greska("/sitemap.xml", `sadrži dev-only rutu ${r}`);
    for (const u of ocekivano) if (!url.includes(u)) greska("/sitemap.xml", `fali ${u}`);
    for (const u of url) if (!ocekivano.includes(u)) greska("/sitemap.xml", `višak ili pogrešan URL: ${u}`);
    if (new Set(url).size !== url.length) greska("/sitemap.xml", "ima duplih URL-ova");
  }

  // robots.txt pominje sitemap i ne zabranjuje sajt
  const robots = path.join(OUT, "robots.txt");
  if (!existsSync(robots)) greska("/robots.txt", "nema robots.txt");
  else {
    const t = readFileSync(robots, "utf8");
    const sm = t.match(/^Sitemap:\s*(\S+)/im)?.[1];
    if (!sm) greska("/robots.txt", "ne pominje Sitemap");
    else if (sm !== new URL("/sitemap.xml", site.domen).href) greska("/robots.txt", `Sitemap ${sm} ne odgovara domenu sajta`);
    if (/^Disallow:\s*\/\s*$/im.test(t)) greska("/robots.txt", "zabranjuje ceo sajt");
  }

  // manifest je ispravan JSON, a njegove ikonice postoje
  const manifest = path.join(OUT, "manifest.webmanifest");
  if (!existsSync(manifest)) greska("/manifest.webmanifest", "nema manifesta");
  else {
    try {
      const m = JSON.parse(readFileSync(manifest, "utf8"));
      if (!m.name || !m.start_url) greska("/manifest.webmanifest", "nema name ili start_url");
      for (const ik of m.icons ?? [])
        if (!postojiUOut(ik.src)) greska("/manifest.webmanifest", `ikonica ne postoji: ${ik.src}`);
    } catch (e) {
      greska("/manifest.webmanifest", `nije ispravan JSON: ${e.message}`);
    }
  }

  // P4: privremene vrednosti (upozorenje)
  const sviHtml = [...htmlPoRuti.entries()];
  for (const ph of PLACEHOLDERS) {
    const varijante = new Set([ph.vrednost]);
    const cifre = ph.vrednost.replace(/\D/g, "");
    if (/^\+?[\d\s]+$/.test(ph.vrednost) && cifre.length >= 8) {
      varijante.add(`+${cifre}`);
      varijante.add(cifre);
      varijante.add(`%2B${cifre}`);
    }
    if (/^https?:\/\//.test(ph.vrednost)) varijante.add(new URL(ph.vrednost).host);
    const strane = sviHtml.filter(([, h]) => [...varijante].some((v) => h.includes(v))).map(([r]) => r);
    if (strane.length)
      upozorenja.push(`P4 privremena vrednost „${ph.vrednost}“ (${ph.polje}) na ${strane.length} strana`);
  }

  // izveštaj
  // Budžet početnog JS-a: osnova Next 16.4 + React 19.3 je ≈ 130 KB gzip (ODLUKA K02).
  const JS_BUDZET = 145 * 1024;
  const CSS_BUDZET = 20 * 1024;
  console.log("\nVeličine po strani (gzip): HTML · početni JS · CSS");
  for (const v of velicine) {
    console.log(`  ${v.ruta.padEnd(36)} ${kb(v.html).padStart(9)} ${kb(v.js).padStart(9)} ${kb(v.css).padStart(9)}`);
    if (v.js > JS_BUDZET) upozorenja.push(`${v.ruta}: početni JS ${kb(v.js)} je iznad budžeta 145 KB`);
    if (v.css > CSS_BUDZET) upozorenja.push(`${v.ruta}: CSS ${kb(v.css)} je iznad budžeta 20 KB`);
  }
  if (upozorenja.length) {
    console.log("\nUpozorenja:");
    for (const u of upozorenja) console.log(`  UPOZORENJE ${u}`);
  }
  if (greske.length) {
    console.log("\nGreške:");
    for (const g of greske) console.log(`  GREŠKA ${g}`);
  }
  console.log(
    `\nStrane: ${htmlPoRuti.size} HTML (${rute.length} javnih) · Greške: ${greske.length} · Upozorenja: ${upozorenja.length}`,
  );
  process.exit(greske.length ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
