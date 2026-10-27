// Poravnava segmentne prefetch fajlove statičkog izvoza (posle `next build`, deo `npm run build`).
//
// Next 16.4.3 na Windows-u izvozi segment `/upit/__PAGE__` kao `out/upit/__next.upit/__PAGE__.txt`
// (putanja segmenta dolazi sa „\“, a u ime fajla se pretvara samo „/“), dok klijent traži
// `out/upit/__next.upit.__PAGE__.txt`. Rezultat su 404 odgovori na prefetch i greške u konzoli.
// Skripta svaki fajl iz takvog podfoldera premesti u ravno ime sa tačkama i obriše prazan
// podfolder. Na Linux-u/macOS-u (hosting) podfoldera nema, pa skripta ne radi ništa.
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");
const PREFIKS = "__next.";

async function fajloviU(dir) {
  const lista = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) lista.push(...(await fajloviU(p)));
    else lista.push(p);
  }
  return lista;
}

async function obidji(dir, rezultat) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith(PREFIKS)) {
      for (const fajl of await fajloviU(p)) {
        const deo = path.relative(p, fajl).split(path.sep).join(".");
        const cilj = path.join(dir, `${e.name}.${deo}`);
        await rename(fajl, cilj);
        rezultat.premesteno++;
      }
      await rm(p, { recursive: true, force: true });
      rezultat.foldera++;
    } else if (e.name !== "_next") {
      await obidji(p, rezultat);
    }
  }
}

try {
  await stat(OUT);
} catch {
  console.error(`fix-export-segments: nema foldera ${OUT}`);
  process.exit(1);
}

const rezultat = { premesteno: 0, foldera: 0 };
await obidji(OUT, rezultat);
console.log(
  rezultat.premesteno
    ? `fix-export-segments: ${rezultat.premesteno} segmentnih fajlova poravnato (${rezultat.foldera} podfoldera)`
    : "fix-export-segments: nema šta da se poravna",
);
