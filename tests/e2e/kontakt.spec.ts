/**
 * Mapa na klik (P3, plan K01 §10.2): pre klika nema nijednog zahteva ka Google-u; posle klika
 * iframe postoji. Dok adresa u content/site.ts nije podešena, mapa se ne prikazuje.
 */
import { expect, test } from "@playwright/test";

import { site } from "@/content/site";

import { skrolujDoDna } from "./pomoc";

const imaAdresu = Boolean(site.adresa.ulica && site.adresa.mesto);

test("/kontakt/: bez adrese nema mape ni zahteva ka Google-u", async ({ page }) => {
  test.skip(imaAdresu, "adresa je podešena; važi sledeći test");
  const google: string[] = [];
  page.on("request", (r) => {
    if (/google\./.test(new URL(r.url()).hostname)) google.push(r.url());
  });
  await page.goto("/kontakt/", { waitUntil: "networkidle" });
  await skrolujDoDna(page, 60);
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(google).toEqual([]);
});

test("/kontakt/: mapa se učitava tek na klik", async ({ page }) => {
  test.skip(!imaAdresu, "adresa nije podešena u content/site.ts (P4), pa se mapa ne prikazuje");
  const google: string[] = [];
  page.on("request", (r) => {
    if (/google\./.test(new URL(r.url()).hostname)) google.push(r.url());
  });
  await page.goto("/kontakt/", { waitUntil: "networkidle" });
  await skrolujDoDna(page, 60);
  expect(google, "pre klika").toEqual([]);
  await page.getByRole("button", { name: /mapu/i }).click();
  await expect(page.locator("iframe")).toHaveCount(1);
});
