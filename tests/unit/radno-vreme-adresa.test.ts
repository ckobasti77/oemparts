import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { RadnoVremeAdresa } from "@/components/layout/RadnoVremeAdresa";
import { FOOTER } from "@/content/navigacija";

// Ceo Phosphor paket se u vitest-u uvozi ~2 min; za strukturu bloka dovoljna je zamena ikone.
vi.mock("@phosphor-icons/react/dist/ssr", async () => {
  const { createElement: el } = await import("react");
  const ikona = (props: Record<string, unknown>) => el("svg", { "aria-hidden": props["aria-hidden"] });
  return { ClockIcon: ikona, MapPinIcon: ikona };
});

/**
 * K08: blok „radno vreme i adresa“ (footer i kontakt na početnoj). `div` u `dl` sme da sadrži samo
 * `dt` i `dd`; ranije je ikona stajala pored, pa bi axe (`dlitem`, `definition-list`) pao čim se u
 * site.ts upiše radno vreme ili adresa. Sa praznim podacima (P4) blok se ne crta.
 */
describe("RadnoVremeAdresa", () => {
  it("dt i dd su jedina deca svakog div-a u dl, a ikona je u dd", () => {
    const html = renderToStaticMarkup(
      createElement(RadnoVremeAdresa, { radnoVreme: "Pon–pet 8–16", adresa: "Ulica 1, 11000 Beograd" }),
    );
    const grupe = [...html.matchAll(/<div>([\s\S]*?)<\/div>/g)].map((m) => m[1]);
    expect(html.startsWith("<dl")).toBe(true);
    expect(grupe).toHaveLength(2);
    for (const g of grupe) expect(g).toMatch(/^<dt[^>]*>[^<]+<\/dt><dd[^>]*><svg[\s\S]*<\/svg><span>[^<]+<\/span><\/dd>$/);
    expect(grupe[0]).toContain(`>${FOOTER.radnoVreme}</dt>`);
    expect(grupe[1]).toContain(`>${FOOTER.adresa}</dt>`);
  });

  it("crta samo ono što postoji, a bez podataka ništa", () => {
    const samoAdresa = renderToStaticMarkup(createElement(RadnoVremeAdresa, { radnoVreme: "", adresa: "Beograd" }));
    expect(samoAdresa).toContain(FOOTER.adresa);
    expect(samoAdresa).not.toContain(FOOTER.radnoVreme);
    expect(renderToStaticMarkup(createElement(RadnoVremeAdresa, { radnoVreme: "", adresa: "" }))).toBe("");
  });
});
