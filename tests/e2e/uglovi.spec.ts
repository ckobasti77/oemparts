/**
 * Radijusi (O3, plan K01 §10.2): nijedno dugme, polje, kartica, slika ni panel u sadržaju nema
 * izračunat border-radius 0. Izuzeci su ivice koje dodiruju ekran: header, donja traka, footer,
 * trake preko cele širine, hero slika i logotipi (SVG crtež, ne okvir).
 */
import { expect, test } from "@playwright/test";

const STRANE = ["/", "/asortiman/", "/asortiman/kocnice/", "/vozila/", "/upit/", "/saradnja/", "/kontakt/", "/kako-kupiti/"];

const METE = [
  "button",
  "input:not([type=hidden])",
  "select",
  "textarea",
  "summary",
  "img",
  "iframe",
  ".panel",
  ".panel-raised",
  ".panel-inset",
  ".card-link",
  ".tile-render",
].join(", ");

const IZUZECI = "[data-crossfade-scope] img, img[src*='/images/brand/']";

for (const ruta of STRANE) {
  test(`bez oštrih uglova: ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const ostri = await page.evaluate(
      ([mete, izuzeci]) =>
        Array.from(document.querySelectorAll<HTMLElement>(`main :is(${mete})`))
          .filter((el) => el.checkVisibility() && !el.matches(izuzeci) && !el.classList.contains("sr-only"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width < 4 || r.height < 4) return false;
            // Slika ili pločica unutar zaobljenog okvira sa overflow:hidden je već zaobljena.
            const sece = (n: HTMLElement | null): boolean => {
              for (let p = n; p && p !== document.body; p = p.parentElement) {
                const s = getComputedStyle(p);
                if (parseFloat(s.borderTopLeftRadius) > 0 && s.overflow !== "visible") return true;
              }
              return false;
            };
            const s = getComputedStyle(el);
            const radijus = Math.min(
              parseFloat(s.borderTopLeftRadius),
              parseFloat(s.borderTopRightRadius),
              parseFloat(s.borderBottomLeftRadius),
              parseFloat(s.borderBottomRightRadius),
            );
            return radijus === 0 && !sece(el.parentElement);
          })
          .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`),
      [METE, IZUZECI] as const,
    );
    expect(ostri).toEqual([]);
  });
}
