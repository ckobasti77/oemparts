/**
 * Statički pregled izvoza (`npm run preview`, port 3241), bez paketa. Ponaša se kao hosting:
 * - putanja sa „/“ na kraju → index.html; bez „/“ a folder postoji → 308 na „…/“;
 * - nepostojeće → out/404.html sa statusom 404;
 * - tačni MIME tipovi, brotli/gzip kompresija teksta (realna merenja), keš za /_next/static/.
 *
 *   node scripts/serve-out.mjs [--port 3241] [--dir out]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const arg = (ime, pod) => {
  const i = args.indexOf(`--${ime}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : pod;
};
const port = Number(arg("port", "3241"));
const dir = path.resolve(root, arg("dir", "out"));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const TEKST = new Set([".html", ".css", ".js", ".mjs", ".json", ".map", ".webmanifest", ".txt", ".xml", ".svg"]);
const kes = new Map();

async function postoji(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}

async function nadji(urlPath) {
  let p;
  try {
    // Više kosih crta na početku (`//kontakt`) bi u Location dale adresu na drugom hostu (K08).
    p = decodeURIComponent(urlPath).replace(/^\/+/, "/");
  } catch {
    return { status: 400 };
  }
  const fajl = path.resolve(dir, `.${p}`);
  if (fajl !== dir && !fajl.startsWith(dir + path.sep)) return { status: 403 };
  if (p.endsWith("/")) {
    const index = path.join(fajl, "index.html");
    return (await postoji(index)) ? { status: 200, fajl: index } : { status: 404 };
  }
  if (await postoji(fajl)) return { status: 200, fajl };
  if (!path.extname(p) && (await postoji(path.join(fajl, "index.html")))) return { status: 308, lokacija: `${p}/` };
  return { status: 404 };
}

async function sadrzaj(fajl, kodiranje) {
  // Vreme izmene je u ključu: posle novog `npm run build` server ne služi stari sadržaj (K08).
  const kljuc = `${fajl}|${kodiranje}|${(await stat(fajl)).mtimeMs}`;
  if (kes.has(kljuc)) return kes.get(kljuc);
  const sirovo = await readFile(fajl);
  let telo = sirovo;
  if (kodiranje === "br") telo = brotliCompressSync(sirovo, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } });
  else if (kodiranje === "gzip") telo = gzipSync(sirovo, { level: 9 });
  kes.set(kljuc, telo);
  return telo;
}

const obradi = async (req, res) => {
  const pocetak = Date.now();
  const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;
  const log = (status) => console.log(`${status} ${req.method} ${urlPath} ${Date.now() - pocetak}ms`);
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return log(405);
  }
  let r = await nadji(urlPath);
  if (r.status === 308) {
    res.writeHead(308, { Location: r.lokacija }).end();
    return log(308);
  }
  if (r.status === 400 || r.status === 403) {
    res.writeHead(r.status).end();
    return log(r.status);
  }
  let status = 200;
  if (r.status === 404) {
    status = 404;
    r = { fajl: path.join(dir, "404.html") };
    if (!(await postoji(r.fajl))) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404");
      return log(404);
    }
  }
  const ext = path.extname(r.fajl).toLowerCase();
  const prihvata = String(req.headers["accept-encoding"] ?? "");
  const kodiranje = TEKST.has(ext) ? (/\bbr\b/.test(prihvata) ? "br" : /\bgzip\b/.test(prihvata) ? "gzip" : null) : null;
  const telo = await sadrzaj(r.fajl, kodiranje);
  const zaglavlja = {
    "Content-Type": MIME[ext] ?? "application/octet-stream",
    "Content-Length": telo.length,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": urlPath.startsWith("/_next/static/")
      ? "public, max-age=31536000, immutable"
      : ext === ".html"
        ? "no-cache"
        : "public, max-age=3600",
  };
  if (TEKST.has(ext)) zaglavlja.Vary = "Accept-Encoding";
  if (kodiranje) zaglavlja["Content-Encoding"] = kodiranje;
  res.writeHead(status, zaglavlja);
  if (req.method === "HEAD") res.end();
  else res.end(telo);
  log(status);
};

const server = createServer((req, res) => {
  obradi(req, res).catch((e) => {
    // Fajl je nestao ili se ne može pročitati (npr. dok traje `npm run build`): 500, a server radi dalje.
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500");
  });
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`Port ${port} je zauzet — ne gasim tuđi proces. Oslobodi port pa pokušaj ponovo.`);
  } else {
    console.error(e);
  }
  process.exit(1);
});

stat(dir)
  .then(() => {
    server.listen(port, () => console.log(`Statički pregled ${path.relative(root, dir)}/ na http://localhost:${port}/`));
  })
  .catch(() => {
    console.error(`Nema foldera ${dir}. Prvo pokreni: npm run build`);
    process.exit(1);
  });

for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => server.close(() => process.exit(0)));
