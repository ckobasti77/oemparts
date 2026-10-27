import { describe, expect, it } from "vitest";

import { brojGrupa } from "@/lib/asortiman";
import { adresaTekst, formatRadnoVreme, mnozina, typographer } from "@/lib/format";
import { staggerDelayMs } from "@/lib/motion";

describe("množina", () => {
  it.each([
    [1, "grupa"],
    [2, "grupe"],
    [4, "grupe"],
    [5, "grupa"],
    [11, "grupa"],
    [12, "grupa"],
    [13, "grupa"],
    [21, "grupa"],
    [22, "grupe"],
  ])("%i %s", (n, oblik) => {
    expect(mnozina(n, ["grupa", "grupe", "grupa"])).toBe(oblik);
  });
  it("broj grupa sa neprelomnim razmakom", () => {
    expect(brojGrupa(13)).toBe("13 grupa");
  });
});

describe("tipografija", () => {
  it("jednoslovne reči, jedinice i crta", () => {
    expect(typographer("Delovi i servis")).toBe("Delovi i servis");
    expect(typographer("disk 312 mm")).toBe("disk 312 mm");
    expect(typographer("Kočnice — delovi")).toBe("Kočnice — delovi");
  });
});

describe("radno vreme", () => {
  it("prazno kad nije uneto", () => {
    expect(formatRadnoVreme([])).toBe("");
  });
  it("uzastopni dani i minuti", () => {
    expect(
      formatRadnoVreme([
        { dani: ["pon", "uto", "sre", "cet", "pet"], od: "08:00", do: "16:30" },
        { dani: ["sub"], od: "08:00", do: "13:00" },
      ]),
    ).toBe("Pon–pet 8–16:30, sub 8–13");
  });
});

describe("stagger", () => {
  it("60 ms razmak, poslednja najviše 180 ms posle prve", () => {
    expect([0, 1, 2, 3].map((i) => staggerDelayMs(i, 4))).toEqual([0, 60, 120, 180]);
    expect(staggerDelayMs(12, 13)).toBe(180);
    expect(staggerDelayMs(0, 1)).toBe(0);
  });
});

describe("adresaTekst", () => {
  it("ulica, poštanski broj i mesto u jednom redu; prazno kad nije uneto", () => {
    expect(adresaTekst({ ulica: "Ulica 1", postanskiBroj: "11000", mesto: "Beograd" })).toBe("Ulica 1, 11000 Beograd");
    expect(adresaTekst({ ulica: "", postanskiBroj: "", mesto: "Beograd" })).toBe("Beograd");
    expect(adresaTekst({ ulica: " ", postanskiBroj: "", mesto: "" })).toBe("");
  });
});
