/**
 * Pokret (plan K01 §5.4, §5.7, §10.2): ništa ne ostaje sakriveno. Skrol do dna u koracima i
 * skokom (End), pa nazad; sidro (`#kocnice`); nazad i napred u istoriji; reduced motion ne sakriva
 * ništa i ne pomera ništa; LCP slika heroja nije lenja i odmah ima opacity 1.
 */
import { expect, test } from "@playwright/test";

import { cekajMotor, cekajOtkrivanje, DUGE_STRANE, skriveneMete, skrolujDoDna } from "./pomoc";

for (const ruta of DUGE_STRANE) {
  test(`skrol do dna i nazad: ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    await cekajMotor(page);
    await skrolujDoDna(page);
    await cekajOtkrivanje(page);
    expect(await skriveneMete(page)).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    expect(await skriveneMete(page)).toEqual([]);
  });
}

for (const ruta of ["/", "/asortiman/", "/asortiman/kocnice/"]) {
  test(`skok na dno (End) i na vrh (Home): ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    await cekajMotor(page);
    // Motor je sakrio bar nešto ispod ekrana, inače test ne proverava ništa.
    expect(await page.locator('[data-reveal-state="pending"]').count()).toBeGreaterThan(0);
    await page.keyboard.press("End");
    await cekajOtkrivanje(page);
    expect(await skriveneMete(page, true), "u ekranu na dnu").toEqual([]);
    await page.keyboard.press("Home");
    await cekajOtkrivanje(page);
    expect(await skriveneMete(page, true), "u ekranu na vrhu").toEqual([]);
    // Sve što je preskočeno skokom je vidljivo (ništa ne čeka iznad ekrana).
    await skrolujDoDna(page, 40);
    await cekajOtkrivanje(page);
    expect(await skriveneMete(page)).toEqual([]);
  });
}

test("sidro: /asortiman/#kocnice je vidljivo odmah", async ({ page }) => {
  await page.goto("/asortiman/#kocnice");
  const sekcija = page.locator("section#kocnice");
  await expect(sekcija).toBeInViewport();
  // Sidro staje ispod lepljivog header-a (scroll-margin-top u globals.css).
  const [vrh, dnoHeadera] = await page.evaluate(() => [
    document.querySelector("section#kocnice")!.getBoundingClientRect().top,
    document.querySelector("header#zaglavlje")!.getBoundingClientRect().bottom,
  ]);
  expect(vrh).toBeGreaterThanOrEqual(dnoHeadera);
  await page.waitForTimeout(1500); // motor je pokrenut, prva odluka je doneta
  expect(await skriveneMete(page, true)).toEqual([]);
});

test("nazad i napred: sadržaj u ekranu je vidljiv bez skrola", async ({ page }) => {
  await page.goto("/asortiman/");
  await cekajMotor(page);
  await skrolujDoDna(page, 60);
  await cekajOtkrivanje(page);
  await page.locator("section#kocnice a").first().click();
  await expect(page).toHaveURL(/\/asortiman\/kocnice\//);
  await cekajMotor(page);

  await page.goBack();
  await expect(page).toHaveURL(/\/asortiman\/$/);
  await page.waitForTimeout(1500);
  expect(await skriveneMete(page, true), "posle „nazad“").toEqual([]);

  await page.goForward();
  await expect(page).toHaveURL(/\/asortiman\/kocnice\//);
  await page.waitForTimeout(1500);
  expect(await skriveneMete(page, true), "posle „napred“").toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  for (const ruta of DUGE_STRANE) {
    test(`ništa nije sakriveno ni pomereno: ${ruta}`, async ({ page }) => {
      await page.goto(ruta, { waitUntil: "load" });
      await page.waitForTimeout(2500); // posle load + mirovanje motor bi već radio
      expect(await page.locator("[data-reveal-state]").count(), "motor ne radi").toBe(0);
      expect(await skriveneMete(page)).toEqual([]);
      if (ruta === "/") {
        await expect(page.locator("[data-crossfade-overlay]")).toBeHidden();
        await expect(page.locator("[data-crossfade-overlay]")).toHaveCSS("display", "none");
      }
    });
  }
});

test("hero: LCP slika nije lenja, ima visok prioritet i opacity 1 pri učitavanju", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  const slika = page.locator('img[fetchpriority="high"]').first();
  await slika.waitFor({ state: "attached" });
  expect(await slika.getAttribute("loading")).not.toBe("lazy");
  // Opacity slike i svih predaka je 1 od prvog trenutka.
  const opacity = await slika.evaluate((el) => {
    let o = 1;
    for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  });
  expect(opacity).toBe(1);
  await expect(slika).toBeInViewport();
  expect(await slika.evaluate((el) => el.closest("[data-reveal]"))).toBeNull();
});
