import { describe, expect, it } from "vitest";

import { formatPhone, normalizePhone } from "@/lib/format";
import {
  brzeAkcije,
  kanali,
  kanaliTekstom,
  kpHref,
  kpJeGenericki,
  mailtoHref,
  mapaEmbedSrc,
  nabroj,
  popuniKanale,
  telHref,
  viberHref,
  whatsappHref,
} from "@/lib/links";

const KONTAKT = {
  telefon: "+381 60 000 0000",
  viber: "+381 60 000 0000",
  whatsapp: "+381 60 000 0000",
  email: "info@example.com",
};

describe("normalizePhone", () => {
  it.each([
    ["+381 60 000 0000", "+381600000000"],
    ["060 000 0000", "+381600000000"],
    ["060/000-0000", "+381600000000"],
    ["00381 60 000 0000", "+381600000000"],
    ["381600000000", "+381600000000"],
    ["60 000 0000", "+381600000000"],
    ["+381 (0) 60 000 0000", "+381600000000"],
    ["+381 060 000 0000", "+381600000000"],
    ["(011) 123-45-67", "+381111234567"],
    ["+49 151 12345678", "+4915112345678"],
  ])("%s → %s", (ulaz, izlaz) => {
    expect(normalizePhone(ulaz)).toBe(izlaz);
  });

  it.each(["", "   ", "abc", "123", "+381 99", "060 000 0000 ext 5"])("neispravno: „%s“", (ulaz) => {
    expect(normalizePhone(ulaz)).toBeNull();
  });
});

describe("formatPhone", () => {
  it("grupiše broj sa neprelomnim razmacima", () => {
    expect(formatPhone("060 000 0000")).toBe("+381 60 000 0000");
  });
  it("u poruci koristi obične razmake", () => {
    expect(formatPhone("060 000 0000", " ")).toBe("+381 60 000 0000");
  });
  it("trocifreni pozivni broj", () => {
    expect(formatPhone("0230 123 45", " ")).toBe("+381 230 123 45");
  });
});

describe("linkovi kanala", () => {
  it("tel:", () => {
    expect(telHref(KONTAKT.telefon)).toBe("tel:+381600000000");
    expect(telHref("")).toBeNull();
  });

  it("viber:// sa kodiranim plusom", () => {
    expect(viberHref(KONTAKT.viber)).toBe("viber://chat?number=%2B381600000000");
  });

  it("WhatsApp bez i sa tekstom (dijakritika, novi red, posebni znaci)", () => {
    expect(whatsappHref(KONTAKT.whatsapp)).toBe("https://wa.me/381600000000");
    expect(whatsappHref(KONTAKT.whatsapp, "Upit: kočioni diskovi\nIme: Đorđe")).toBe(
      "https://wa.me/381600000000?text=Upit%3A%20ko%C4%8Dioni%20diskovi%0AIme%3A%20%C4%90or%C4%91e",
    );
    expect(whatsappHref(KONTAKT.whatsapp, "A&B #1 + 50% ? ć ž")).toBe(
      "https://wa.me/381600000000?text=A%26B%20%231%20%2B%2050%25%20%3F%20%C4%87%20%C5%BE",
    );
    expect(whatsappHref(KONTAKT.whatsapp, "   ")).toBe("https://wa.me/381600000000");
  });

  it("mailto sa naslovom i telom (CRLF)", () => {
    expect(mailtoHref(KONTAKT.email)).toBe("mailto:info@example.com");
    expect(
      mailtoHref(KONTAKT.email, { subject: "Upit po broju šasije", body: "Ime: Đorđe\nTelefon: 064 123 4567" }),
    ).toBe(
      "mailto:info@example.com?subject=Upit%20po%20broju%20%C5%A1asije&body=Ime%3A%20%C4%90or%C4%91e%0D%0ATelefon%3A%20064%20123%204567",
    );
    expect(mailtoHref("nije-mejl")).toBeNull();
    expect(mailtoHref("")).toBeNull();
  });

  it("KP link: samo https na kupujemprodajem.com", () => {
    expect(kpHref("https://www.kupujemprodajem.com/")).toBe("https://www.kupujemprodajem.com/");
    expect(kpHref("https://kupujemprodajem.com/prodavnica/1")).toBe("https://kupujemprodajem.com/prodavnica/1");
    expect(kpHref("http://www.kupujemprodajem.com/")).toBeNull();
    expect(kpHref("https://kupujemprodajem.com.example.org/")).toBeNull();
    expect(kpHref("nije url")).toBeNull();
    expect(kpJeGenericki("https://www.kupujemprodajem.com/")).toBe(true);
    expect(kpJeGenericki("https://www.kupujemprodajem.com/euromotors/svi-oglasi")).toBe(false);
  });

  it("mapa se kodira", () => {
    expect(mapaEmbedSrc("Beograd, Srbija")).toBe("https://www.google.com/maps?q=Beograd%2C%20Srbija&output=embed");
  });
});

describe("kanali()", () => {
  it("svi kanali sa vrednošću, redom", () => {
    expect(kanali(KONTAKT, "https://www.kupujemprodajem.com/").map((k) => k.kanal)).toEqual([
      "telefon",
      "viber",
      "whatsapp",
      "email",
      "kp",
    ]);
  });

  it("kanal bez vrednosti se ne prikazuje", () => {
    const lista = kanali({ ...KONTAKT, telefon: "", email: "nije-mejl" }, "");
    expect(lista.map((k) => k.kanal)).toEqual(["viber", "whatsapp"]);
  });

  it("WhatsApp i KP se otvaraju u novom prozoru", () => {
    const lista = kanali(KONTAKT, "https://www.kupujemprodajem.com/");
    expect(lista.filter((k) => k.spoljni).map((k) => k.kanal)).toEqual(["whatsapp", "kp"]);
  });
});

describe("brzeAkcije (donja traka)", () => {
  it("telefon, Viber i KP redom, bez WhatsApp-a i mejla", () => {
    expect(brzeAkcije(kanali(KONTAKT)).map((k) => k.kanal)).toEqual(["telefon", "viber", "kp"]);
  });

  it("kanal bez vrednosti se izostavlja; bez ijednog traka je prazna", () => {
    expect(brzeAkcije(kanali({ ...KONTAKT, viber: "" })).map((k) => k.kanal)).toEqual(["telefon", "kp"]);
    expect(brzeAkcije(kanali({ telefon: "", viber: "", whatsapp: "", email: "" }, ""))).toEqual([]);
  });
});

describe("kanali u rečenici", () => {
  it("nabroj: jedan, dva i više delova", () => {
    expect(nabroj([])).toBe("");
    expect(nabroj(["a"])).toBe("a");
    expect(nabroj(["a", "b"])).toBe("a ili b");
    expect(nabroj(["a", "b", "c"])).toBe("a, b ili c");
  });

  it("samo kanali sa vrednošću, u traženom padežu", () => {
    const sve = kanali(KONTAKT);
    expect(kanaliTekstom(["telefon", "viber", "whatsapp", "email"], "instr", sve)).toBe(
      "telefonom, Viberom, WhatsApp-om ili mejlom",
    );
    expect(kanaliTekstom(["viber", "whatsapp", "email"], "gen", sve)).toBe("Vibera, WhatsApp-a ili mejla");
    const bezViber = kanali({ ...KONTAKT, viber: "", whatsapp: "" });
    expect(kanaliTekstom(["telefon", "viber", "whatsapp", "email"], "instr", bezViber)).toBe("telefonom ili mejlom");
  });

  it("popuniKanale menja {kanali}, a bez kanala izostavlja celu rečenicu", () => {
    const tekst = "Pošaljite broj šasije. Poruku šaljete preko {kanali}.";
    expect(popuniKanale(tekst, ["viber", "email"], "gen", kanali(KONTAKT))).toBe(
      "Pošaljite broj šasije. Poruku šaljete preko Vibera ili mejla.",
    );
    const prazno = kanali({ telefon: "", viber: "", whatsapp: "", email: "" }, "");
    expect(popuniKanale(tekst, ["viber", "email"], "gen", prazno)).toBe("Pošaljite broj šasije.");
  });
});
