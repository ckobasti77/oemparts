/**
 * Sve strane (plan K01 §10.2): otvaraju se bez grešaka u konzoli i bez neuspelih zahteva,
 * nijedan zahtev ne ide na tuđi domen, tačno jedan h1, nivoi naslova bez preskakanja i bez
 * horizontalnog skrola na 360, 390, 768, 1024 i 1440 px.
 */
import { expect, test } from "@playwright/test";

import { NEPOSTOJECA, prati, skrolujDoDna, STRANE } from "./pomoc";

const SIRINE = [360, 390, 768, 1024, 1440];

for (const ruta of [...STRANE, NEPOSTOJECA]) {
  test.describe(`strana ${ruta}`, () => {
    test("otvara se bez grešaka i bez tuđih domena", async ({ page }) => {
      const z = prati(page, { dozvoli404: ruta === NEPOSTOJECA ? NEPOSTOJECA : "" });
      const odgovor = await page.goto(ruta, { waitUntil: "networkidle" });
      expect(odgovor?.status()).toBe(ruta === NEPOSTOJECA ? 404 : 200);
      // Skrol do dna učitava lenje slike i okida prefetch linkova u ekranu.
      await skrolujDoDna(page, 60);
      await page.waitForLoadState("networkidle");
      expect(z.greske, "greške u konzoli").toEqual([]);
      expect(z.neuspeli, "neuspeli zahtevi").toEqual([]);
      expect(z.tudji, "zahtevi ka tuđem domenu").toEqual([]);
    });

    test("jedan h1 i naslovi bez preskakanja nivoa", async ({ page }) => {
      await page.goto(ruta);
      const nivoi = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"))
          .filter((h) => h.checkVisibility() && !h.closest("dialog:not([open])"))
          .map((h) => ({ nivo: Number(h.tagName[1]), tekst: (h.textContent ?? "").trim().slice(0, 50) })),
      );
      expect(nivoi.filter((n) => n.nivo === 1)).toHaveLength(1);
      expect(nivoi[0]?.nivo).toBe(1);
      for (let i = 1; i < nivoi.length; i++) {
        expect(
          nivoi[i].nivo,
          `„${nivoi[i].tekst}“ (h${nivoi[i].nivo}) posle h${nivoi[i - 1].nivo}`,
        ).toBeLessThanOrEqual(nivoi[i - 1].nivo + 1);
      }
    });

    test("bez horizontalnog skrola na 360–1440 px", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "širine se menjaju u jednom projektu");
      await page.goto(ruta);
      for (const sirina of SIRINE) {
        await page.setViewportSize({ width: sirina, height: 900 });
        await page.waitForTimeout(50);
        const prelivi = await page.evaluate(() => {
          const d = document.documentElement;
          return { scroll: d.scrollWidth, sirina: d.clientWidth };
        });
        expect(prelivi.scroll, `${ruta} na ${sirina} px`).toBeLessThanOrEqual(prelivi.sirina);
      }
    });
  });
}
