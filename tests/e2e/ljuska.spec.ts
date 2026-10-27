/**
 * Ljuska (plan K01 §10.2): donja traka postoji ispod 1024 px i ne pokriva footer; mete u
 * header-u, meniju, traci i formi su ≥ 44 × 44 px (polja i dugmad forme 48); header posle
 * skrola dobija `data-condensed="true"`.
 */
import { expect, test, type Locator } from "@playwright/test";

import { ARIA } from "@/content/navigacija";

import { jeTelefon } from "./pomoc";

/** Vidljive interaktivne mete ispod `koren` koje su manje od `min` px po visini ili širini. */
const INTERAKTIVNI = "a[href], button, input, select, textarea, summary";

async function maleMete(koren: Locator, min = 44, sel = INTERAKTIVNI): Promise<string[]> {
  return koren.evaluateAll(
    (korenovi, [m, s]) =>
      korenovi.flatMap((k) =>
        Array.from(k.querySelectorAll<HTMLElement>(s))
          .filter((el) => el.checkVisibility() && !el.classList.contains("sr-only"))
          .filter((el) => {
            // Link unutar rečenice je izuzetak (WCAG 2.5.8, „inline“).
            if (el.tagName === "A" && getComputedStyle(el).display === "inline") return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && (r.width < Number(m) || r.height < Number(m));
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()} „${(el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 30)}“ ${Math.round(r.width)}×${Math.round(r.height)}`;
          }),
      ),
    [min, sel] as const,
  );
}

test("donja traka: vidljiva ispod 1024 px, skrivena od 1024", async ({ page }, info) => {
  await page.goto("/");
  const traka = page.getByRole("navigation", { name: ARIA.brzeAkcije });
  if (jeTelefon(info)) {
    await expect(traka).toBeVisible();
    await page.setViewportSize({ width: 1023, height: 844 });
    await expect(traka).toBeVisible();
    await page.setViewportSize({ width: 1024, height: 844 });
    await expect(traka).toBeHidden();
  } else {
    await expect(traka).toBeHidden();
  }
});

test("donja traka ne pokriva poslednji red footera ni sadržaja", async ({ page }, info) => {
  test.skip(!jeTelefon(info), "traka postoji ispod 1024 px");
  for (const ruta of ["/", "/kontakt/", "/upit/", "/uslovi-koriscenja/"]) {
    await page.goto(ruta);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(200);
    const { dnoFootera, vrhTrake } = await page.evaluate(() => {
      const f = document.querySelector("footer")!;
      const poslednji = Array.from(f.querySelectorAll("*"))
        .filter((e) => (e as HTMLElement).checkVisibility() && e.children.length === 0)
        .at(-1)!;
      const traka = document.querySelector('nav[aria-label="Brze akcije"]')!;
      return {
        dnoFootera: poslednji.getBoundingClientRect().bottom,
        vrhTrake: traka.getBoundingClientRect().top,
      };
    });
    expect(dnoFootera, ruta).toBeLessThanOrEqual(vrhTrake);
  }
});

test("mete ≥ 44 px: header, donja traka i meni", async ({ page }, info) => {
  await page.goto("/");
  expect(await maleMete(page.locator("header#zaglavlje"))).toEqual([]);
  if (jeTelefon(info)) {
    expect(await maleMete(page.getByRole("navigation", { name: ARIA.brzeAkcije }))).toEqual([]);
    await page.getByRole("button", { name: ARIA.meni, exact: true }).click();
    const dijalog = page.getByRole("dialog", { name: ARIA.meni });
    await expect(dijalog).toBeVisible();
    await page.waitForTimeout(400);
    expect(await maleMete(dijalog)).toEqual([]);
  }
});

test("mete ≥ 44 px u sadržaju; polja i dugmad forme 48 px", async ({ page }) => {
  for (const ruta of ["/", "/asortiman/", "/asortiman/kocnice/", "/kontakt/", "/saradnja/", "/kako-kupiti/"]) {
    await page.goto(ruta);
    expect(await maleMete(page.locator("main")), ruta).toEqual([]);
  }
  await page.goto("/upit/");
  expect(await maleMete(page.locator("main")), "/upit/").toEqual([]);
  const polja = 'input:not([type="hidden"]), select, textarea, button';
  expect(await maleMete(page.locator("main form"), 48, polja), "/upit/ polja i dugmad").toEqual([]);
});

test("header posle skrola dobija podlogu", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header#zaglavlje");
  await expect(header).toHaveAttribute("data-condensed", "false");
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(header).toHaveAttribute("data-condensed", "true");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).toHaveAttribute("data-condensed", "false");
});
