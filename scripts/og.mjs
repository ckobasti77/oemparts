/**
 * OG slike (plan K01 §8.5): 19 statičnih PNG fajlova 1200×630 u `public/og/`.
 *
 *   npm run og
 *
 * Ne zavisi od `out/`: spisak strana se gradi iz content/*.ts (Node ≥ 22.18 skida tipove).
 * Svaki okvir je HTML (podloga, logo, naslov velikim slovima, podnaslov, render), iscrtan u
 * Chrome-u preko Playwright-a sa lokalnim fontovima, pa sažet sa sharp-om (paleta, < 200 KB).
 * Bez mreže i bez tuđih domena. Imena fajlova prate lib/seo.ts `ogSlikaZa`.
 */
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IZLAZ = path.join(root, "public", "og");
const AUTO = { rasklopljen: "images/hero/car-exploded-1920.webp", sklopljen: "images/hero/car-assembled-1920.webp" };

/**
 * Spisak OG slika: ime fajla (bez .png), naslov, podnaslov i render (putanja u public/images).
 * Čista funkcija nad sadržajem, da je test može proveriti bez pregledača.
 */
export function ogStrane({ SISTEMI, pocetna, asortimanStrana, vozilaStrana, upitStrana, saradnjaStrana, oNamaStrana, kupovinaStrana, kontaktStrana, site }) {
  const deo = (slug) => `images/delovi/${slug}.webp`;
  const PODNASLOV = pocetna.og.opsti;
  const marke = `${site.marke.slice(0, -1).join(", ")} i ${site.marke.at(-1)}`;
  return [
    { ime: "pocetna", naslov: pocetna.hero.naslov, podnaslov: pocetna.og.podnaslov.replace("{marke}", marke), slika: AUTO.rasklopljen, vrsta: "auto" },
    { ime: "asortiman", naslov: asortimanStrana.naslov, podnaslov: PODNASLOV, slika: deo("motor"), vrsta: "deo" },
    ...SISTEMI.map((s) => ({ ime: `asortiman-${s.slug}`, naslov: s.naziv, podnaslov: PODNASLOV, slika: deo(s.slika), vrsta: "deo" })),
    { ime: "vozila", naslov: vozilaStrana.naslov, podnaslov: PODNASLOV, slika: AUTO.sklopljen, vrsta: "auto" },
    { ime: "upit", naslov: upitStrana.naslov, podnaslov: PODNASLOV, slika: deo("kocioni-diskovi"), vrsta: "deo" },
    { ime: "saradnja", naslov: saradnjaStrana.naslov, podnaslov: PODNASLOV, slika: deo("menjac"), vrsta: "deo" },
    { ime: "o-nama", naslov: oNamaStrana.naslov, podnaslov: PODNASLOV, slika: AUTO.sklopljen, vrsta: "auto" },
    { ime: "kako-kupiti", naslov: kupovinaStrana.naslov, podnaslov: PODNASLOV, slika: deo("filteri"), vrsta: "deo" },
    { ime: "kontakt", naslov: kontaktStrana.naslov, podnaslov: PODNASLOV, slika: deo("farovi"), vrsta: "deo" },
    { ime: "opste", naslov: site.brend.lockup, podnaslov: PODNASLOV, slika: AUTO.rasklopljen, vrsta: "auto" },
  ];
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Jednoslovna reč (i, u, s, k, o, a) ostaje uz sledeću, kao `typographer` u lib/format.ts (K08). */
const NBSP = String.fromCharCode(160);
const vezi = (s) => s.replace(/(?<![\p{L}\p{N}_])([iuskoaIUSKOA])[ \t]+(?=\S)/gu, `$1${NBSP}`);
const url = (p) => pathToFileURL(p).href;

const PS_LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const PS_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

/** HTML okvira 1200×630. Boje su iste kao tokeni u app/globals.css (bg, ink-1, ink-2, accent). */
function okvirHtml(s) {
  const fonts = path.join(root, "app", "fonts");
  const ps = path.join(root, "node_modules", "@fontsource-variable", "public-sans", "files");
  const logo = url(path.join(root, "public", "images", "brand", "logo-horizontal-night.svg"));
  const slika = url(path.join(root, "public", s.slika));
  const render =
    s.vrsta === "auto"
      ? `<img class="auto" src="${slika}" alt="" />`
      : `<img class="deo" src="${slika}" alt="" />`;
  return `<!doctype html><html lang="sr-Latn"><head><meta charset="utf-8"><style>
@font-face{font-family:"Archivo";font-weight:700;src:url("${url(path.join(fonts, "archivo-expanded-700.woff2"))}") format("woff2")}
@font-face{font-family:"PS";font-weight:100 900;src:url("${url(path.join(ps, "public-sans-latin-wght-normal.woff2"))}") format("woff2");unicode-range:${PS_LATIN}}
@font-face{font-family:"PS";font-weight:100 900;src:url("${url(path.join(ps, "public-sans-latin-ext-wght-normal.woff2"))}") format("woff2");unicode-range:${PS_EXT}}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden;background:#0d0f11}
.okvir{position:relative;width:1200px;height:630px;background:#0d0f11;overflow:hidden}
.sjaj{position:absolute;inset:0;background:radial-gradient(60% 90% at 82% 55%,#1b1f23 0%,#0d0f11 70%)}
.auto{position:absolute;right:-70px;bottom:30px;width:840px;-webkit-mask-image:radial-gradient(closest-side,#000 55%,transparent 100%);mask-image:radial-gradient(closest-side,#000 55%,transparent 100%)}
.deo{position:absolute;right:40px;top:80px;height:490px;width:490px;-webkit-mask-image:radial-gradient(closest-side,#000 78%,transparent 100%);mask-image:radial-gradient(closest-side,#000 78%,transparent 100%)}
.logo{position:absolute;left:64px;top:56px;height:64px}
.tekst{position:absolute;left:64px;bottom:64px;width:640px}
.linija{width:56px;height:4px;border-radius:2px;background:#ff6b1a;margin-bottom:28px}
h1{font:700 52px/1.05 "Archivo",Arial,sans-serif;text-transform:uppercase;color:#f1ece3;letter-spacing:0}
p{margin-top:24px;font:400 24px/1.35 "PS",Arial,sans-serif;color:#c4beb4}
</style></head><body><div class="okvir"><div class="sjaj"></div>${render}
<img class="logo" src="${logo}" alt="">
<div class="tekst"><div class="linija"></div><h1 id="n">${esc(vezi(s.naslov))}</h1><p>${esc(vezi(s.podnaslov))}</p></div></div></body></html>`;
}

async function ucitajSadrzaj() {
  const uvezi = async (f) => import(pathToFileURL(path.join(root, "content", f)).href);
  const [site, asortiman, pocetna, stranice, vozila, upit, saradnja, kupovina] = await Promise.all(
    ["site.ts", "asortiman.ts", "pocetna.ts", "stranice.ts", "vozila.ts", "upit.ts", "saradnja.ts", "kupovina.ts"].map(uvezi),
  );
  return {
    site: site.site,
    SISTEMI: asortiman.SISTEMI,
    pocetna: pocetna.pocetna,
    asortimanStrana: stranice.asortimanStrana,
    oNamaStrana: stranice.oNamaStrana,
    kontaktStrana: stranice.kontaktStrana,
    vozilaStrana: vozila.vozilaStrana,
    upitStrana: upit.upitStrana,
    saradnjaStrana: saradnja.saradnjaStrana,
    kupovinaStrana: kupovina.kupovinaStrana,
  };
}

async function pokreniPregledac(chromium) {
  for (const opcije of [{ channel: "chrome" }, {}]) {
    try {
      return await chromium.launch(opcije);
    } catch {
      /* sledeća opcija */
    }
  }
  throw new Error("Nema Chrome-a ni Playwright Chromium-a (npx playwright install chromium).");
}

async function main() {
  const [{ chromium }, { default: sharp }] = await Promise.all([import("@playwright/test"), import("sharp")]);
  const strane = ogStrane(await ucitajSadrzaj());
  mkdirSync(IZLAZ, { recursive: true });
  const tmp = mkdtempSync(path.join(tmpdir(), "oemparts-og-"));
  const pregledac = await pokreniPregledac(chromium);
  try {
    const page = await pregledac.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    for (const s of strane) {
      const html = path.join(tmp, `${s.ime}.html`);
      writeFileSync(html, okvirHtml(s));
      await page.goto(url(html), { waitUntil: "load" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        const h = document.getElementById("n");
        // Naslov najviše u 3 reda: smanjuje slovo dok ne stane.
        let px = 52;
        while (h.getBoundingClientRect().height > px * 1.05 * 3 + 1 && px > 36) {
          px -= 2;
          h.style.fontSize = `${px}px`;
        }
      });
      await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
      const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
      const izlaz = path.join(IZLAZ, `${s.ime}.png`);
      await sharp(png).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(izlaz);
      console.log(`${s.ime}.png  ${(statSync(izlaz).size / 1024).toFixed(0)} KB`);
    }
  } finally {
    await pregledac.close();
    rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`\nGotovo: ${strane.length} slika u public/og/`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
