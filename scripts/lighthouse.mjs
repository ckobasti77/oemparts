/**
 * Lighthouse mobile nad statičkim pregledom (plan K01 §9.5, §11). Preview mora da radi:
 *
 *   npm run preview        (u drugom terminalu, port 3241)
 *   npm run lighthouse     [-- --runs 3] [-- --only pocetna,upit] [-- --metoda devtools]
 *
 * Za pet strana iz budžeta pušta `npx lighthouse@13.5.0` (Chrome sa računara, podrazumevana
 * mobilna emulacija: Moto G Power, Slow 4G) po `--runs` puta i ispisuje medijane: četiri
 * kategorije, LCP, CLS i TBT, uz tabelu za docs/oemparts/merenja.md. JSON izveštaji idu u
 * .nocni-run/oemparts/tmp/lh/. Lighthouse nije zavisnost projekta (pravilo paketa).
 *
 * Podrazumevano je simulirano prigušenje (Lantern), kako traži plan. `--metoda devtools`
 * prigušuje stvarno (mreža i CPU u pregledaču); služi kao provera, jer na localhost-u simulacija
 * vidi JS izvršen pre prvog iscrtavanja i računa ga u LCP (vidi docs/oemparts/merenja.md).
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BAZA = "http://localhost:3241";
const IZLAZ = path.join(root, ".nocni-run", "oemparts", "tmp", "lh");

export const STRANE = [
  { ime: "pocetna", ruta: "/" },
  { ime: "asortiman", ruta: "/asortiman/" },
  { ime: "kocnice", ruta: "/asortiman/kocnice/" },
  { ime: "upit", ruta: "/upit/" },
  { ime: "kontakt", ruta: "/kontakt/" },
];

const BUDZET = { performance: 95, accessibility: 100, "best-practices": 100, seo: 100, lcp: 2000, cls: 0.02, tbt: 150 };

const args = process.argv.slice(2);
const arg = (ime, pod) => {
  const i = args.indexOf(`--${ime}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : pod;
};
const runs = Math.max(1, Number(arg("runs", "3")));
const metoda = arg("metoda", "simulate") === "devtools" ? "devtools" : "simulate";
const samo = arg("only", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

async function radiPreview() {
  try {
    const r = await fetch(`${BAZA}/`, { signal: AbortSignal.timeout(3000) });
    return r.ok;
  } catch {
    return false;
  }
}

function pusti(url, izlaz) {
  return new Promise((resolve, reject) => {
    const cmd = [
      "npx",
      "--yes",
      "--prefer-offline", // ista verzija iz npx keša, bez provere registra pri svakom merenju
      "lighthouse@13.5.0",
      url,
      "--quiet",
      '--chrome-flags="--headless=new"',
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path="${izlaz}"`,
      ...(metoda === "devtools" ? ["--throttling-method=devtools"] : []),
    ].join(" ");
    const p = spawn(cmd, { shell: true, stdio: ["ignore", "ignore", "inherit"], cwd: root });
    p.on("error", reject);
    p.on("exit", (kod) => (kod === 0 ? resolve() : reject(new Error(`lighthouse je izašao sa ${kod}: ${url}`))));
  });
}

/**
 * Zagrevanje: preview kompresuje fajl pri prvom zahtevu i pamti ga, pa prvo merenje posle
 * pokretanja servera meri kompresiju, a ne sajt. Zato se strana i njeni resursi prvo preuzmu.
 */
async function zagrej(url) {
  const zaglavlja = { "accept-encoding": "br, gzip" };
  const html = await (await fetch(url, { headers: zaglavlja })).text();
  const putanje = new Set(
    [...html.matchAll(/(?:src|href|srcSet|srcset)="([^"]+)"/g)]
      .flatMap((m) => m[1].split(","))
      .map((s) => s.trim().split(/\s+/)[0])
      .filter((s) => s.startsWith("/") && !s.startsWith("//")),
  );
  await Promise.all([...putanje].map((p) => fetch(new URL(p, url), { headers: zaglavlja }).catch(() => null)));
}

function medijana(niz) {
  const s = [...niz].sort((a, b) => a - b);
  return s[Math.floor((s.length - 1) / 2)];
}

function procitaj(fajl) {
  const lhr = JSON.parse(readFileSync(fajl, "utf8"));
  const a = lhr.audits;
  const kat = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const neuspeli = Object.values(lhr.categories)
    .filter((c) => c.id !== "performance")
    .flatMap((c) => c.auditRefs.map((r) => a[r.id]))
    .filter((au) => au && au.score !== null && au.score < 1 && au.scoreDisplayMode !== "informative")
    .map((au) => au.id);
  return {
    performance: kat("performance"),
    accessibility: kat("accessibility"),
    "best-practices": kat("best-practices"),
    seo: kat("seo"),
    lcp: a["largest-contentful-paint"]?.numericValue ?? NaN,
    cls: a["cumulative-layout-shift"]?.numericValue ?? NaN,
    tbt: a["total-blocking-time"]?.numericValue ?? NaN,
    fcp: a["first-contentful-paint"]?.numericValue ?? NaN,
    si: a["speed-index"]?.numericValue ?? NaN,
    js: Math.round(
      (a["network-requests"]?.details?.items ?? [])
        .filter((it) => it.resourceType === "Script")
        .reduce((s, it) => s + (it.transferSize ?? 0), 0) / 1024,
    ),
    neuspeli,
  };
}

async function main() {
  if (!(await radiPreview())) {
    console.error(`Preview ne odgovara na ${BAZA}/. Pokreni npm run preview pa ponovi.`);
    process.exit(1);
  }
  mkdirSync(IZLAZ, { recursive: true });
  const strane = samo.length ? STRANE.filter((s) => samo.includes(s.ime)) : STRANE;
  const redovi = [];
  let pao = false;
  for (const s of strane) {
    const merenja = [];
    await zagrej(`${BAZA}${s.ruta}`);
    for (let n = 1; n <= runs; n++) {
      const fajl = path.join(IZLAZ, `${s.ime}${metoda === "devtools" ? "-devtools" : ""}-${n}.json`);
      process.stdout.write(`${s.ruta} (${n}/${runs}) … `);
      await pusti(`${BAZA}${s.ruta}`, fajl);
      const m = procitaj(fajl);
      merenja.push(m);
      console.log(`perf ${m.performance} · LCP ${Math.round(m.lcp)} ms · TBT ${Math.round(m.tbt)} ms`);
    }
    const red = { ime: s.ime, ruta: s.ruta };
    for (const k of ["performance", "accessibility", "best-practices", "seo", "lcp", "cls", "tbt", "fcp", "si", "js"]) {
      red[k] = medijana(merenja.map((m) => m[k]));
    }
    red.raspon = Math.max(...merenja.map((m) => m.performance)) - Math.min(...merenja.map((m) => m.performance));
    red.neuspeli = [...new Set(merenja.flatMap((m) => m.neuspeli))];
    redovi.push(red);
  }

  console.log(`\nPrigušenje: ${metoda} · merenja po strani: ${runs} (medijana)`);
  console.log("\n| Strana | Perf | A11y | BP | SEO | LCP | CLS | TBT | FCP | JS (KB, prenos) | Raspon perf |");
  console.log("|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of redovi) {
    console.log(
      `| \`${r.ruta}\` | ${r.performance} | ${r.accessibility} | ${r["best-practices"]} | ${r.seo} | ` +
        `${(r.lcp / 1000).toFixed(2)} s | ${r.cls.toFixed(3)} | ${Math.round(r.tbt)} ms | ` +
        `${(r.fcp / 1000).toFixed(2)} s | ${r.js} | ${r.raspon} |`,
    );
  }
  for (const r of redovi) {
    const greske = [];
    for (const k of ["performance", "accessibility", "best-practices", "seo"]) {
      if (r[k] < BUDZET[k]) greske.push(`${k} ${r[k]} < ${BUDZET[k]}`);
    }
    if (r.lcp > BUDZET.lcp) greske.push(`LCP ${Math.round(r.lcp)} ms > ${BUDZET.lcp}`);
    if (r.cls > BUDZET.cls) greske.push(`CLS ${r.cls.toFixed(3)} > ${BUDZET.cls}`);
    if (r.tbt > BUDZET.tbt) greske.push(`TBT ${Math.round(r.tbt)} ms > ${BUDZET.tbt}`);
    if (r.neuspeli.length) greske.push(`neuspele provere: ${r.neuspeli.join(", ")}`);
    if (greske.length) {
      pao = true;
      console.log(`✗ ${r.ruta}: ${greske.join("; ")}`);
    }
  }
  if (!pao) console.log("\n✓ Sve strane su u budžetu.");
  process.exitCode = pao ? 1 : 0;
}

await main();
