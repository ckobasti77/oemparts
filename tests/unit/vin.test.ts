import { describe, expect, it } from "vitest";

import { normalizeVin, validateVin } from "@/lib/vin";

describe("broj šasije (VIN)", () => {
  it("ispravan VIN od 17 znakova", () => {
    expect(validateVin("WVWZZZ1KZ8W000001")).toEqual({ ok: true, normalizovan: "WVWZZZ1KZ8W000001", duzina: 17 });
  });

  it("normalizuje mala slova, razmake, crtice i tačke", () => {
    expect(normalizeVin(" wvw zzz-1kz.8w 000001 ")).toBe("WVWZZZ1KZ8W000001");
    expect(normalizeVin("WVW ZZZ1KZ8W000001")).toBe("WVWZZZ1KZ8W000001");
    expect(validateVin("wvwzzz1kz8w000001").ok).toBe(true);
  });

  it("kontrolna cifra se ne proverava (u Evropi je nema)", () => {
    // Na 9. mestu je „Z“ (uobičajeno za evropska VW vozila), što bi po severnoameričkom pravilu palo.
    expect(validateVin("TMBZZZ1Z2ZB000001").ok).toBe(true);
  });

  it.each([
    ["WVWZZZ1KZ8W00000", 16],
    ["WVWZZZ1KZ8W0000011", 18],
  ])("pogrešna dužina: %s", (vin, n) => {
    const r = validateVin(vin);
    expect(r.ok).toBe(false);
    expect(r.greska).toBe("duzina");
    expect(r.duzina).toBe(n);
  });

  it("slova I, O i Q nisu dozvoljena, uz predlog", () => {
    const r = validateVin("WVWZZZ1KZ8WOOOOO1");
    expect(r.ok).toBe(false);
    expect(r.greska).toBe("slova-ioq");
    expect(r.predlog).toBe("WVWZZZ1KZ8W000001");
    expect(validateVin("WVWZZZIKZ8W000001").predlog).toBe("WVWZZZ1KZ8W000001");
  });

  it("I/O/Q bez predloga kad dužina nije dobra", () => {
    const r = validateVin("WVWO");
    expect(r.greska).toBe("slova-ioq");
    expect(r.predlog).toBeUndefined();
  });

  it("ostali znaci", () => {
    expect(validateVin("WVWZZZ1KZ8W00000*").greska).toBe("znakovi");
    expect(validateVin("WVWZZZ1KZ8W00000Ž").greska).toBe("znakovi");
  });

  it("prazan", () => {
    expect(validateVin("   ").greska).toBe("prazan");
  });
});
