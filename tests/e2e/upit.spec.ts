/**
 * Upit po broju šasije, samo tastaturom (plan K01 §10.2): prazna forma vodi fokus na sažetak
 * grešaka, polja nose aria-invalid i aria-describedby; broj šasije sa „O“ daje poruku i predlog;
 * ispravna forma daje pregled jednak `sastaviPoruku`, linkovi nose celu poruku, „Kopiraj
 * poruku“ puni clipboard, a sastavljanje ne šalje nijedan mrežni zahtev.
 */
import { expect, test, type Page } from "@playwright/test";

import { UPIT_GRESKE, UPIT_POLJA, UPIT_SLANJE } from "@/content/upit";
import { PRAZAN_UPIT, naslovPoruke, sastaviPoruku, type UpitPolja } from "@/lib/upit";

/** Tab dok fokus ne stigne na element koji odgovara selektoru (i tekstu, ako je dat). */
async function tabDo(page: Page, sel: string, tekst = "", max = 60): Promise<void> {
  for (let i = 0; i < max; i++) {
    const stigao = await page.evaluate(
      ([s, t]) => {
        const a = document.activeElement;
        return !!a && a.matches(s) && (!t || (a.textContent ?? "").includes(t));
      },
      [sel, tekst] as const,
    );
    if (stigao) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`Tab nije stigao do ${sel} ${tekst}`);
}

async function otvori(page: Page) {
  await page.goto("/upit/", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: UPIT_POLJA.sastavi })).toBeEnabled();
}

test("prazna forma: sažetak dobija fokus, polja aria-invalid i aria-describedby", async ({ page }) => {
  await otvori(page);
  await tabDo(page, 'button[type="submit"]');
  await page.keyboard.press("Enter");

  const sazetak = page.locator('[aria-labelledby="upit-sazetak-naslov"]');
  await expect(sazetak).toBeFocused();
  await expect(sazetak).toContainText(UPIT_GRESKE.sazetak);

  const neispravna = page.locator('[aria-invalid="true"]');
  expect(await neispravna.count()).toBeGreaterThanOrEqual(3);
  for (const id of ["upit-deo", "upit-ime", "upit-telefon"]) {
    const polje = page.locator(`#${id}`);
    await expect(polje).toHaveAttribute("aria-invalid", "true");
    const opis = (await polje.getAttribute("aria-describedby")) ?? "";
    const tekstovi = await Promise.all(
      opis.split(/\s+/).filter(Boolean).map((d) => page.locator(`[id="${d}"]`).innerText()),
    );
    expect(tekstovi.join(" "), `${id}: greška je u aria-describedby`).toMatch(/Upišite|Napišite/);
  }

  // Link u sažetku vodi fokus na polje.
  await page.keyboard.press("Tab");
  const prvi = page.locator('[aria-labelledby="upit-sazetak-naslov"] a').first();
  await expect(prvi).toBeFocused();
  const cilj = ((await prvi.getAttribute("href")) ?? "").slice(1);
  await page.keyboard.press("Enter");
  await expect(page.locator(`[id="${cilj}"]`)).toBeFocused();
});

test("broj šasije sa „O“: poruka i predlog, Enter upisuje ispravku", async ({ page }) => {
  await otvori(page);
  await tabDo(page, "#upit-vin");
  await page.keyboard.type("WVWZZZ1KZAW0O0001");
  await page.keyboard.press("Tab");
  const predlog = "WVWZZZ1KZAW000001";
  await expect(page.getByText(UPIT_GRESKE.vinIoq)).toBeVisible();
  await expect(page.getByText(UPIT_GRESKE.vinPredlog.replace("{predlog}", predlog))).toBeVisible();
  await expect(page.locator("#upit-vin")).toHaveAttribute("aria-invalid", "true");

  const primeni = page.getByRole("button", { name: UPIT_GRESKE.vinPrimeni.replace("{predlog}", predlog) });
  await expect(primeni).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await expect(primeni).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#upit-vin")).toHaveValue(predlog);
});

test("ispravna forma: pregled, linkovi sa celom porukom, kopiranje i bez mrežnih zahteva", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://localhost:3241" });
  await otvori(page);
  const polja: UpitPolja = {
    ...PRAZAN_UPIT,
    vin: "WVWZZZ1KZAW000001",
    deo: "Prednji kočioni diskovi i pločice",
    ime: "Auto servis Đurić",
    telefon: "060 123 4567",
  };

  await tabDo(page, "#upit-vin");
  await page.keyboard.type(polja.vin);
  await tabDo(page, "#upit-deo");
  await page.keyboard.type(polja.deo);
  await tabDo(page, "#upit-ime");
  await page.keyboard.type(polja.ime);
  await tabDo(page, "#upit-telefon");
  await page.keyboard.type(polja.telefon);

  const zahtevi: string[] = [];
  page.on("request", (r) => zahtevi.push(`${r.method()} ${r.url()}`));
  await page.keyboard.press("Enter");

  const naslov = page.locator("#upit-poruka-naslov");
  await expect(naslov).toBeFocused();
  const poruka = sastaviPoruku(polja);
  await expect(page.locator("section pre")).toHaveText(poruka);
  await page.waitForTimeout(300);
  // Podaci ne idu nigde: nijedan zahtev osim GET/HEAD ka našem statičkom sajtu (prefetch strana
  // i lenjo učitan kod), i nijedan URL ne nosi vrednost iz forme.
  const tragovi = [polja.vin, "1234567", encodeURIComponent(polja.ime), "Đurić", "%C4%90uri%C4%87"];
  const saljuPodatke = () =>
    zahtevi.filter(
      (z) => !/^(GET|HEAD) http:\/\/localhost:3241\//.test(z) || tragovi.some((t) => z.includes(t)),
    );
  expect(saljuPodatke(), "sastavljanje ne šalje ništa").toEqual([]);

  const href = async (ime: string) =>
    (await page.getByRole("link", { name: ime }).getAttribute("href")) ?? "";
  const wa = new URL(await href(UPIT_SLANJE.whatsapp));
  expect(wa.searchParams.get("text")).toBe(poruka);
  const viber = await href(UPIT_SLANJE.viber);
  expect(new URLSearchParams(viber.split("?")[1]).get("draft")).toBe(poruka);
  const mejl = await href(UPIT_SLANJE.mejl);
  const upit = new URLSearchParams(mejl.split("?")[1]);
  expect(upit.get("subject")).toBe(naslovPoruke(polja));
  expect((upit.get("body") ?? "").replace(/\r\n/g, "\n")).toBe(poruka);

  await tabDo(page, "button", UPIT_SLANJE.kopiraj);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: UPIT_SLANJE.kopirano })).toBeVisible();
  // Windows clipboard vraća redove kao CRLF.
  const kopirano = await page.evaluate(() => navigator.clipboard.readText());
  expect(kopirano.replace(/\r\n/g, "\n")).toBe(poruka);
  expect(saljuPodatke(), "ni kopiranje ne šalje ništa").toEqual([]);
});
