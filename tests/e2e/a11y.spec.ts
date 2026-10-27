/**
 * Pristupačnost (plan K01 §10.2): axe (WCAG 2.0/2.1/2.2 A i AA) daje 0 nalaza na svakoj strani,
 * u oba projekta, posle skrola do dna (sve otkriveno); i sa otvorenim menijem i na /upit/ u
 * stanju grešaka.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { UPIT_GRESKE, UPIT_POLJA } from "@/content/upit";

import { cekajMotor, cekajOtkrivanje, jeTelefon, NEPOSTOJECA, skrolujDoDna, STRANE } from "./pomoc";

const OZNAKE = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function axe(page: Page) {
  const rezultat = await new AxeBuilder({ page }).withTags(OZNAKE).analyze();
  return rezultat.violations.map((v) => ({
    id: v.id,
    opis: v.help,
    mesta: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
  }));
}

for (const ruta of [...STRANE, NEPOSTOJECA]) {
  test(`axe 0: ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    await cekajMotor(page);
    await skrolujDoDna(page, 60);
    await cekajOtkrivanje(page);
    // Provera sa vrha: na dnu lepljivi header stoji preko sadržaja, pa bi axe meru mete i kontrast
    // računao za ono što je trenutno ispod njega (zavisi od položaja skrola).
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    expect(await axe(page)).toEqual([]);
  });
}

test("axe 0: otvoren meni", async ({ page }, info) => {
  test.skip(!jeTelefon(info), "meni postoji ispod 1280 px");
  await page.goto("/");
  await page.getByRole("button", { name: "Meni" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(400); // ulazna animacija
  expect(await axe(page)).toEqual([]);
});

test("axe 0: /upit/ sa greškama", async ({ page }) => {
  await page.goto("/upit/");
  const dugme = page.getByRole("button", { name: UPIT_POLJA.sastavi });
  await expect(dugme).toBeEnabled();
  await page.locator("#upit-vin").fill("WVWZZZ1KZ");
  await page.locator("#upit-telefon").fill("12");
  await dugme.click();
  await expect(page.getByRole("heading", { name: UPIT_GRESKE.sazetak })).toBeVisible();
  expect(await axe(page)).toEqual([]);
});
