/**
 * Meni (plan K01 §10.2, telefon): Tab do „Meni“ i Enter otvara; fokus je u dijalogu i Tab
 * kruži unutra; Escape zatvara i vraća fokus na dugme; skrol strane je zaključan dok je meni
 * otvoren; link zatvara meni i vodi na stranu.
 */
import { expect, test, type Page } from "@playwright/test";

import { ARIA } from "@/content/navigacija";

test.skip(({ isMobile }) => !isMobile, "meni postoji ispod 1280 px");

async function tabDoMenija(page: Page) {
  const dugme = page.getByRole("button", { name: ARIA.meni, exact: true });
  for (let i = 0; i < 10 && !(await dugme.evaluate((d) => d === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(dugme).toBeFocused();
  return dugme;
}

test("tastatura: otvaranje, fokus u dijalogu, Tab kruži, Escape vraća fokus", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const dugme = await tabDoMenija(page);
  await page.keyboard.press("Enter");

  const dijalog = page.getByRole("dialog", { name: ARIA.meni });
  await expect(dijalog).toBeVisible();
  await expect(dugme).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: ARIA.zatvoriMeni })).toBeFocused();

  const fokusabilnih = await dijalog.locator("a[href], button").count();
  for (let i = 0; i < fokusabilnih + 3; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]")), `Tab ${i + 1}`).toBe(true);
  }
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]"))).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dijalog).toBeHidden();
  await expect(dugme).toBeFocused();
  await expect(dugme).toHaveAttribute("aria-expanded", "false");
});

test("skrol strane je zaključan dok je meni otvoren", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 400));
  const pre = await page.evaluate(() => window.scrollY);
  // Nativni fokus + Enter: `click()` i `focus()` u Playwright-u skroluju lepljivi header „u vidik“
  // i tako sami menjaju skrol (pregledač to ne radi, provereno programskim klikom).
  await page.getByRole("button", { name: ARIA.meni, exact: true }).evaluate((d: HTMLElement) => d.focus());
  expect(await page.evaluate(() => window.scrollY)).toBe(pre);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: ARIA.meni })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains("menu-open"))).toBe(true);
  await page.mouse.move(195, 600);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBe(pre);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: ARIA.meni })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.classList.contains("menu-open"))).toBe(false);
});

test("link u meniju zatvara meni i vodi na stranu", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: ARIA.meni, exact: true }).click();
  const dijalog = page.getByRole("dialog", { name: ARIA.meni });
  await expect(dijalog).toBeVisible();
  await dijalog.getByRole("link", { name: "Asortiman", exact: true }).click();
  await expect(page).toHaveURL(/\/asortiman\/$/);
  await expect(dijalog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
