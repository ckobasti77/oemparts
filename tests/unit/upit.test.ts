import { describe, expect, it } from "vitest";

import { UPIT_GRESKE } from "@/content/upit";
import { mailtoHref, whatsappHref } from "@/lib/links";
import {
  PRAZAN_UPIT,
  deoIzUpita,
  linkoviPoruke,
  naslovPoruke,
  proveriUpit,
  sastaviPoruku,
  upitJeIspravan,
  type UpitPolja,
} from "@/lib/upit";

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

  it("ime od jednog znaka: posebna poruka", () => {
    expect(proveriUpit({ ...PUN, ime: " J " }).ime).toBe(UPIT_GRESKE.imeKratko);
    expect(proveriUpit({ ...PUN, ime: "Jo" }).ime).toBeUndefined();
  });

  it("neispravan telefon", () => {
    expect(proveriUpit({ ...PUN, telefon: "123" }).telefon).toBe(UPIT_GRESKE.telefonNeispravan);
  });

  it("VIN: dužina, I/O/Q sa predlogom, znakovi", () => {
    expect(proveriUpit({ ...PUN, vin: "WVWZZZ1KZ8W00000" }).vin).toBe("Broj šasije ima 17 znakova. Upisano je 16.");
    expect(proveriUpit({ ...PUN, vin: "WVWZZZ1KZ8WOOOOO1" }).vin).toBe(
      "Broj šasije ne sadrži slova I, O ni Q. Da li ste mislili na WVWZZZ1KZ8W000001?",
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

const KONTAKT = { viber: "+381 60 000 0000", whatsapp: "060 000 0000", email: "info@example.com" };

/** Vrednost parametra iz linka, dekodirana (radi i za `viber:` i `mailto:`, koje URL ne čita). */
function izLinka(href: string, param: string): string {
  const deo = href
    .slice(href.indexOf("?") + 1)
    .split("&")
    .find((p) => p.startsWith(`${param}=`));
  if (deo === undefined) throw new Error(`nema ${param} u ${href}`);
  return decodeURIComponent(deo.slice(param.length + 1));
}

/** Kodirana vrednost sme da sadrži samo znake koje encodeURIComponent ostavlja i `%XX`. */
function cistoKodirano(href: string, param: string): void {
  const deo = href
    .slice(href.indexOf("?") + 1)
    .split("&")
    .find((p) => p.startsWith(`${param}=`))!;
  expect(deo.slice(param.length + 1)).toMatch(/^(?:[A-Za-z0-9\-_.!~*'()]|%[0-9A-F]{2})*$/);
}

describe("linkoviPoruke: svaki link nosi celu poruku, ispravno kodiranu", () => {
  const TESKO: UpitPolja = {
    ime: "Đorđe Šćepanović & sin",
    telefon: "+381 64 123 4567",
    vin: "wvw zzz-1kz8w000001",
    marka: "Škoda",
    model: "Octavia #3",
    deo: "Leva prednja čeljust + nosač (50% pohabano?)\nI zadnji diskovi = 2 kom.",
    napomena: "Žuto svetlo „ABS“ na tabli; ćošak 100/200",
  };

  it.each([
    ["sva polja", PUN],
    ["dijakritika, posebni znaci i više redova", TESKO],
    ["samo obavezna polja (bez napomene i vozila)", { ...PUN, marka: "", model: "", napomena: "" }],
    ["bez broja šasije, sa markom i modelom", { ...PUN, vin: "" }],
  ])("%s", (_, polja) => {
    const poruka = sastaviPoruku(polja);
    const l = linkoviPoruke(polja, KONTAKT);

    expect(l.viber).toMatch(/^viber:\/\/chat\?number=%2B381600000000&draft=/);
    expect(izLinka(l.viber!, "draft")).toBe(poruka);
    cistoKodirano(l.viber!, "draft");

    expect(l.whatsapp).toMatch(/^https:\/\/wa\.me\/381600000000\?text=/);
    expect(new URL(l.whatsapp!).searchParams.get("text")).toBe(poruka);
    cistoKodirano(l.whatsapp!, "text");

    expect(l.email).toMatch(/^mailto:info@example\.com\?subject=/);
    expect(izLinka(l.email!, "subject")).toBe(naslovPoruke(polja));
    expect(izLinka(l.email!, "body")).toBe(poruka.replace(/\n/g, "\r\n"));
    expect(l.email).not.toMatch(/%0D(?!%0A)/);
    cistoKodirano(l.email!, "subject");
    cistoKodirano(l.email!, "body");
  });

  it("dijakritika se kodira kao UTF-8 u svakom linku", () => {
    const l = linkoviPoruke(TESKO, KONTAKT);
    for (const href of [l.viber!, l.whatsapp!, l.email!]) {
      expect(href).toContain("%C4%90or%C4%91e"); // Đorđe
      expect(href).toContain("%C5%A0%C4%87epanovi%C4%87"); // Šćepanović
      expect(href).toContain("%C5%BDuto"); // Žuto
      expect(href).toContain("%E2%80%9EABS%E2%80%9C"); // „ABS“
      expect(href).toContain("%20%26%20sin"); // „ & sin“
    }
    expect(l.email).toContain("subject=Upit%20po%20broju%20%C5%A1asije%3A%20WVWZZZ1KZ8W000001");
  });

  it("poruka sadrži normalizovan broj šasije, telefon i sve redove opisa", () => {
    const poruka = sastaviPoruku(TESKO);
    expect(poruka).toContain("Broj šasije: WVWZZZ1KZ8W000001");
    expect(poruka).toContain("Telefon: +381 64 123 4567");
    expect(poruka).toContain("Vozilo: Škoda Octavia #3");
    expect(poruka).toContain("Deo: Leva prednja čeljust + nosač (50% pohabano?)\nI zadnji diskovi = 2 kom.");
  });

  it("kanal bez vrednosti daje null (ne prikazuje se)", () => {
    expect(linkoviPoruke(PUN, { viber: "", whatsapp: "nije broj", email: "" })).toEqual({
      viber: null,
      whatsapp: null,
      email: null,
    });
    const samoMejl = linkoviPoruke(PUN, { viber: "", whatsapp: "", email: "info@example.com" });
    expect(samoMejl.viber).toBeNull();
    expect(samoMejl.whatsapp).toBeNull();
    expect(samoMejl.email).not.toBeNull();
  });

  it("podrazumevano koristi kontakt iz content/site.ts", () => {
    const l = linkoviPoruke(PUN);
    expect(l.viber).toContain("number=%2B381600000000");
    expect(l.email).toContain("mailto:info@example.com?");
  });
});

describe("sastaviPoruku: prazna i nepotpuna polja", () => {
  it("prazna forma daje samo zaglavlje", () => {
    expect(sastaviPoruku(PRAZAN_UPIT)).toBe("Upit sa sajta Euromotors Plus · OEM Parts");
  });

  it("polja samo sa razmacima se izostavljaju", () => {
    const poruka = sastaviPoruku({ ...PUN, napomena: "  \n \t ", model: "   ", marka: "" });
    expect(poruka).not.toContain("Napomena:");
    expect(poruka).not.toContain("Vozilo:");
  });

  it("višak praznih redova u opisu se sažima, redovi ostaju", () => {
    expect(sastaviPoruku({ ...PUN, deo: "Prvi red\n\n\n\nDrugi red  " })).toContain("Deo: Prvi red\n\nDrugi red");
  });
});

describe("validacija broja šasije u formi", () => {
  it.each([
    ["WVWZZZ1KZ8W000001", undefined],
    ["wvwzzz1kz8w000001", undefined],
    ["WVW ZZZ 1KZ 8W0 00001", undefined],
    ["WVW-ZZZ-1KZ8W000001", undefined],
    ["WVWZZZ1KZ8W00000", "Broj šasije ima 17 znakova. Upisano je 16."],
    ["WVWZZZ1KZ8W0000012", "Broj šasije ima 17 znakova. Upisano je 18."],
    ["WVWZZZ1KZ8WQ00001", "Broj šasije ne sadrži slova I, O ni Q. Da li ste mislili na WVWZZZ1KZ8W000001?"],
    ["WVWZZZIKZ8W000001", "Broj šasije ne sadrži slova I, O ni Q. Da li ste mislili na WVWZZZ1KZ8W000001?"],
    ["WVWZZZ1KZ8WO", "Broj šasije ne sadrži slova I, O ni Q."],
    ["WVWZZZ1KZ8W00000Č", "Broj šasije sadrži samo slova A–Z i cifre 0–9."],
    ["WVWZZZ1KZ8W0000/1", "Broj šasije sadrži samo slova A–Z i cifre 0–9."],
  ])("%s", (vin, greska) => {
    expect(proveriUpit({ ...PUN, vin }).vin).toBe(greska);
  });

  it("bez broja šasije: dovoljan je model, a „Druga marka“ bez modela traži model", () => {
    expect(proveriUpit({ ...PUN, vin: "", marka: "", model: "Golf" })).toEqual({});
    expect(proveriUpit({ ...PUN, vin: "", marka: "Druga marka", model: "" })).toEqual({
      model: UPIT_GRESKE.modelPrazno,
    });
  });

  it("ispravan broj šasije ne traži marku ni model", () => {
    expect(proveriUpit({ ...PUN, marka: "", model: "" })).toEqual({});
  });
});

describe("deoIzUpita (/upit/?deo=<grupa>)", () => {
  const DELOVI = { "kocioni-diskovi": "Kočioni diskovi", "filter-ulja": "Filter ulja" };

  it("poznata grupa popunjava „Deo“", () => {
    expect(deoIzUpita("?deo=kocioni-diskovi", DELOVI)).toBe("Kočioni diskovi: ");
    expect(deoIzUpita("?x=1&deo=filter-ulja", DELOVI)).toBe("Filter ulja: ");
  });

  it("nepoznata, prazna ili zlonamerna vrednost ne popunjava ništa", () => {
    expect(deoIzUpita("", DELOVI)).toBe("");
    expect(deoIzUpita("?deo=", DELOVI)).toBe("");
    expect(deoIzUpita("?deo=nepostoji", DELOVI)).toBe("");
    expect(deoIzUpita("?deo=__proto__", DELOVI)).toBe("");
    expect(deoIzUpita("?deo=toString", DELOVI)).toBe("");
    expect(deoIzUpita("?deo=%3Cscript%3E", DELOVI)).toBe("");
  });
});
