/**
 * Linkovi (plan K01 §10.2): interni linkovi iz header-a, menija, footera i početne vraćaju 200;
 * KP, tel, Viber, WhatsApp i mejl su tačni (vrednosti iz content/site.ts); /upit/?deo= popunjava
 * polje „Deo“.
 */
import { expect, test } from "@playwright/test";

import { GRUPE } from "@/content/asortiman";

import { jeTelefon, OCEKIVANI } from "./pomoc";

test("interni linkovi iz header-a, menija, footera i početne vraćaju 200", async ({ page, request }) => {
  await page.goto("/");
  const hrefovi = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>("header a[href], dialog a[href], footer a[href], main a[href]"))
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/")),
  );
  const jedinstveni = [...new Set(hrefovi.map((h) => h.split("#")[0].split("?")[0]))];
  expect(jedinstveni.length).toBeGreaterThan(15);
  for (const h of jedinstveni) {
    expect(h, "interni link ima „/“ na kraju").toMatch(/\/$/);
    const r = await request.get(h, { maxRedirects: 0 });
    expect(r.status(), h).toBe(200);
  }
});

test("KupujemProdajem linkovi su tačni i otvaraju se u novom prozoru", async ({ page }) => {
  test.skip(!OCEKIVANI.kp, "KP link nije podešen");
  for (const ruta of ["/", "/asortiman/", "/kontakt/", "/kako-kupiti/"]) {
    await page.goto(ruta);
    const linkovi = page.locator('a[href*="kupujemprodajem"]');
    const n = await linkovi.count();
    expect(n, ruta).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const a = linkovi.nth(i);
      await expect(a).toHaveAttribute("href", OCEKIVANI.kp!);
      await expect(a).toHaveAttribute("target", "_blank");
      const rel = (await a.getAttribute("rel")) ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  }
});

test("tel, Viber, WhatsApp i mejl linkovi su tačni", async ({ page }) => {
  await page.goto("/kontakt/");
  const svi = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map((a) => a.getAttribute("href") ?? ""),
  );
  const proveri = (prefiks: string, ocekivano: string | null) => {
    const nadjeni = svi.filter((h) => h.startsWith(prefiks));
    if (!ocekivano) {
      expect(nadjeni, `${prefiks} bez vrednosti se ne prikazuje`).toEqual([]);
      return;
    }
    expect(nadjeni.length, prefiks).toBeGreaterThan(0);
    for (const h of nadjeni) expect(h).toBe(ocekivano);
  };
  proveri("tel:", OCEKIVANI.tel);
  proveri("viber:", OCEKIVANI.viber);
  proveri("https://wa.me/", OCEKIVANI.whatsapp);
  proveri("mailto:", OCEKIVANI.email);
});

test("donja traka (telefon) i header (desktop) imaju tačne kanale", async ({ page }, info) => {
  await page.goto("/");
  if (jeTelefon(info)) {
    const traka = page.getByRole("navigation", { name: "Brze akcije" });
    await expect(traka).toBeVisible();
    if (OCEKIVANI.tel) await expect(traka.locator(`a[href="${OCEKIVANI.tel}"]`)).toHaveCount(1);
    if (OCEKIVANI.viber) await expect(traka.locator(`a[href="${OCEKIVANI.viber}"]`)).toHaveCount(1);
    if (OCEKIVANI.kp) await expect(traka.locator(`a[href="${OCEKIVANI.kp}"]`)).toHaveCount(1);
  } else {
    const header = page.locator("header#zaglavlje");
    // Meni (dijalog) je takođe u header-u, ali od 1280 px nije vidljiv.
    if (OCEKIVANI.tel) await expect(header.locator(`a[href="${OCEKIVANI.tel}"]:visible`)).toHaveCount(1);
    if (OCEKIVANI.kp) await expect(header.locator(`a[href="${OCEKIVANI.kp}"]:visible`)).toHaveCount(1);
  }
});

test("/upit/?deo=kocioni-diskovi popunjava polje „Deo“", async ({ page }) => {
  const grupa = GRUPE.find((g) => g.slug === "kocioni-diskovi");
  expect(grupa).toBeTruthy();
  await page.goto("/upit/?deo=kocioni-diskovi");
  await expect(page.locator("#upit-deo")).toHaveValue(`${grupa!.naziv}: `);
});
