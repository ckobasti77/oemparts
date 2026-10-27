import { describe, expect, it } from "vitest";

import { SISTEMI } from "@/content/asortiman";
import { RUTE, javneRute, upitZaDeo } from "@/lib/routes";
import { DEV_RUTE, ocekivaneRute } from "../../scripts/check-site.mjs";

describe("rute", () => {
  it("20 javnih ruta, sve sa „/“ na kraju", () => {
    const rute = javneRute();
    expect(rute).toHaveLength(20);
    for (const r of rute) expect(r).toMatch(/^\/([a-z0-9-]+\/)*$/);
    expect(new Set(rute).size).toBe(rute.length);
  });

  it("check:site očekuje iste rute kao sajt", () => {
    expect(ocekivaneRute(SISTEMI)).toEqual(javneRute());
    expect(DEV_RUTE).toEqual([RUTE.stil]);
    expect(javneRute()).not.toContain(RUTE.stil);
  });

  it("upit sa delom", () => {
    expect(upitZaDeo("kocioni-diskovi")).toBe("/upit/?deo=kocioni-diskovi");
  });
});
