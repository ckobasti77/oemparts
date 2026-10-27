/**
 * Varijante rendera delova (K01 §2.3): za svaki public/images/delovi/<slug>.webp (768 × 768)
 * pravi <slug>-384.webp. Radi samo nad public/, ne nad _izvor/, i ne pokreće se u build-u.
 *
 *   npm run images
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "images", "delovi");
const SIZE = 384;

const files = (await readdir(dir)).filter((f) => f.endsWith(".webp") && !f.endsWith(`-${SIZE}.webp`));
let made = 0;
for (const file of files) {
  const src = path.join(dir, file);
  const out = path.join(dir, file.replace(/\.webp$/, `-${SIZE}.webp`));
  const [srcStat, outStat] = await Promise.all([stat(src), stat(out).catch(() => null)]);
  if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) continue;
  await sharp(src)
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(out);
  const { size } = await stat(out);
  console.log(`${path.basename(out)}  ${(size / 1024).toFixed(1)} KB`);
  made += 1;
}
console.log(`Gotovo: ${made} novih varijanti, ${files.length} rendera ukupno.`);
