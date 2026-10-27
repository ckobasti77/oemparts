import { describe, expect, it } from "vitest";

import { UPIT_GRESKE } from "@/content/upit";
import { mailtoHref, whatsappHref } from "@/lib/links";
import { PRAZAN_UPIT, naslovPoruke, proveriUpit, sastaviPoruku, upitJeIspravan, type UpitPolja } from "@/lib/upit";

const PUN: UpitPolja = {
  ime: "Test Testić",
  telefon: "060 000 0000",
  vin: "wvwzzz1kz8w000001",
  marka: "Volkswagen",
  model: "Golf",
  deo: "Prednji kočioni diskovi i pločice",
  napomena: "Vozilo je dizel.",
};

describe("sastaviPoruku", () => {
  it("sva polja", () => {
    expect(sastaviPoruku(PUN)).toBe(
      [
        "Upit sa sajta Euromotors Plus · OEM Parts",
        "Ime: Test Testić",
        "Telefon: +381 60 000 0000",
        "Broj šasije: WVWZZZ1KZ8W000001",
        "Vozilo: Volkswagen Golf",
        "Deo: Prednji kočioni diskovi i pločice",
        "Napomena: Vozilo je dizel.",
      ].join("\n"),
    );
  });

  it("izostavlja prazna polja", () => {
    const poruka = sastaviPoruku({ ...PUN, marka: "", model: "", napomena: "" });
    expect(poruka).not.toContain("Vozilo:");
    expect(poruka).not.toContain("Napomena:");
  });

  it("bez broja šasije, sa vozilom", () => {
    const poruka = sastaviPoruku({ ...PUN, vin: "" });
    expect(poruka).not.toContain("Broj šasije");
    expect(poruka).toContain("Vozilo: Volkswagen Golf");
  });

  it("„Druga marka“ se ne upisuje", () => {
    expect(sastaviPoruku({ ...PUN, vin: "", marka: "Druga marka", model: "Golf" })).toContain("Vozilo: Golf");
  });

  it("dijakritika, višak razmaka i CRLF", () => {
    const poruka = sastaviPoruku({ ...PUN, ime: "  Đorđe   Šćepanović ", deo: "Leva  čeljust\r\nzadnja" });
    expect(poruka).toContain("Ime: Đorđe Šćepanović");
    expect(poruka).toContain("Deo: Leva čeljust\nzadnja");
    expect(poruka).not.toContain("\r");
  });

  it("dužina ostaje ispod 1600 znakova i sa najdužim poljima", () => {
    const poruka = sastaviPoruku({ ...PUN, ime: "I".repeat(80), model: "M".repeat(60), deo: "D".repeat(500), napomena: "N".repeat(500) });
    expect(poruka.length).toBeLessThan(1600);
  });

  it("cela poruka preživi kodiranje u WhatsApp i mejl linku", () => {
    const poruka = sastaviPoruku(PUN);
    const wa = whatsappHref("060 000 0000", poruka)!;
    expect(decodeURIComponent(new URL(wa).searchParams.get("text") ?? "")).toBe(poruka);
    expect(new URL(wa).searchParams.get("text")).toBe(poruka);
    const mail = mailtoHref("info@example.com", { subject: naslovPoruke(PUN), body: poruka })!;
    const body = decodeURIComponent(mail.split("&body=")[1]);
    expect(body).toBe(poruka.replace(/\n/g, "\r\n"));
  });
});

describe("naslovPoruke", () => {
  it("po broju šasije", () => {
    expect(naslovPoruke(PUN)).toBe("Upit po broju šasije: WVWZZZ1KZ8W000001");
  });
  it("po vozilu", () => {
    expect(naslovPoruke({ ...PUN, vin: "" })).toBe("Upit: Volkswagen Golf");
  });
  it("opšti", () => {
    expect(naslovPoruke({ ...PUN, vin: "", marka: "", model: "" })).toBe("Upit po broju šasije");
  });
});

describe("proveriUpit", () => {
  it("ispravan upit", () => {
    expect(proveriUpit(PUN)).toEqual({});
    expect(upitJeIspravan(PUN)).toBe(true);
  });

  it("prazna forma", () => {
    expect(proveriUpit(PRAZAN_UPIT)).toEqual({
      ime: UPIT_GRESKE.imePrazno,
      telefon: UPIT_GRESKE.telefonPrazno,
      vin: UPIT_GRESKE.voziloPrazno,
      deo: UPIT_GRESKE.deoPrazno,
    });
  });

  it("neispravan telefon", () => {
    expect(proveriUpit({ ...PUN, telefon: "123" }).telefon).toBe(UPIT_GRESKE.telefonNeispravan);
  });

  it("VIN: dužina, I/O/Q sa predlogom, znakovi", () => {
    expect(proveriUpit({ ...PUN, vin: "WVWZZZ1KZ8W00000" }).vin).toBe("Broj šasije ima 17 znakova. Upisano je 16.");
    expect(proveriUpit({ ...PUN, vin: "WVWZZZ1KZ8WOOOOO1" }).vin).toBe(
      "Broj šasije ne sadrži slova I, O ni Q. Da li ste mislili WVWZZZ1KZ8W000001?",
    );
    expect(proveriUpit({ ...PUN, vin: "WVWZZZ1KZ8W00000*" }).vin).toBe(UPIT_GRESKE.vinZnakovi);
  });

  it("bez broja šasije: marka bez modela traži model", () => {
    expect(proveriUpit({ ...PUN, vin: "", model: "" })).toEqual({ model: UPIT_GRESKE.modelPrazno });
  });

  it("predugačak tekst", () => {
    expect(proveriUpit({ ...PUN, deo: "D".repeat(501) }).deo).toBe("Tekst je predug. Najviše 500 znakova.");
  });
});
