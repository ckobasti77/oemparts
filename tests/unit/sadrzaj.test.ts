import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { GRUPE, SISTEMI } from "@/content/asortiman";
import * as kupovina from "@/content/kupovina";
import * as navigacija from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import * as saradnja from "@/content/saradnja";
import { site } from "@/content/site";
import * as stranice from "@/content/stranice";
import * as upit from "@/content/upit";
import { MARKE, vozilaStrana } from "@/content/vozila";
import * as pravno from "@/content/pravno";
import { grupeSistema } from "@/lib/asortiman";

const PUBLIC = path.resolve(__dirname, "../../public");

/** Svi stringovi iz vrednosti (rekurzivno). */
function stringovi(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(stringovi);
  if (v && typeof v === "object") return Object.values(v).flatMap(stringovi);
  return [];
}

const ASCII_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("asortiman: integritet", () => {
  it("10 sistema i 44 grupe, jedinstveni ASCII slugovi", () => {
    expect(SISTEMI).toHaveLength(10);
    expect(GRUPE).toHaveLength(44);
    const slugovi = [...SISTEMI.map((s) => s.slug), ...GRUPE.map((g) => g.slug)];
    expect(new Set(slugovi).size).toBe(slugovi.length);
    for (const s of slugovi) expect(s).toMatch(ASCII_SLUG);
  });

  it("svaka grupa ima tačno jedan postojeći sistem; svaki sistem ima bar jednu grupu", () => {
    const sistemi = new Set(SISTEMI.map((s) => s.slug));
    for (const g of GRUPE) expect(sistemi.has(g.sistem)).toBe(true);
    for (const s of SISTEMI) expect(grupeSistema(s.slug).length).toBeGreaterThan(0);
    expect(SISTEMI.reduce((n, s) => n + grupeSistema(s.slug).length, 0)).toBe(44);
  });

  it("svaka grupa i podgrupa ima render (768 i 384) koji postoji i sve tekstove", () => {
    const slugovi = GRUPE.flatMap((g) => [g.slug, ...(g.podgrupe ?? []).map((p) => p.slug)]);
    expect(slugovi).toHaveLength(48);
    for (const slug of slugovi) {
      expect(existsSync(path.join(PUBLIC, "images", "delovi", `${slug}.webp`)), `${slug}.webp`).toBe(true);
      expect(existsSync(path.join(PUBLIC, "images", "delovi", `${slug}-384.webp`)), `${slug}-384.webp`).toBe(true);
    }
    for (const g of GRUPE) {
      for (const polje of [g.naziv, g.kratko, g.staRadi, g.kadaSeMenja, g.savet]) expect(polje.trim().length).toBeGreaterThan(2);
    }
  });

  it("slika sistema je postojeća grupa tog sistema; meta opis 120–160 znakova", () => {
    for (const s of SISTEMI) {
      const grupa = GRUPE.find((g) => g.slug === s.slika);
      expect(grupa?.sistem, s.slug).toBe(s.slug);
      expect(s.metaOpis.length, s.slug).toBeGreaterThanOrEqual(120);
      expect(s.metaOpis.length, s.slug).toBeLessThanOrEqual(160);
    }
  });

  it("opisi grupa ne tvrde ništa o lageru (P5)", () => {
    for (const t of stringovi([GRUPE, SISTEMI])) {
      expect(t).not.toMatch(/\b(većina|reparirane|na stanju|nove i|lager)\b/i);
    }
  });
});

describe("asortiman: strana sistema (K04)", () => {
  const reci = (t: string) => t.split(/\s+/).filter(Boolean).length;

  it("svaka grupa pripada tačno jednom sistemu", () => {
    for (const g of GRUPE) {
      const sistemi = SISTEMI.filter((s) => grupeSistema(s.slug).some((x) => x.slug === g.slug));
      expect(sistemi.map((s) => s.slug), g.slug).toEqual([g.sistem]);
    }
  });

  it("uvod: 2–3 pasusa, ukupno 80–150 reči", () => {
    for (const s of SISTEMI) {
      expect(s.uvod.length, s.slug).toBeGreaterThanOrEqual(2);
      expect(s.uvod.length, s.slug).toBeLessThanOrEqual(3);
      const n = reci(s.uvod.join(" "));
      expect(n, `${s.slug}: ${n} reči`).toBeGreaterThanOrEqual(80);
      expect(n, `${s.slug}: ${n} reči`).toBeLessThanOrEqual(150);
    }
  });

  it("šta navesti u upitu: 3–5 stavki, svaka je rečenica", () => {
    for (const s of SISTEMI) {
      expect(s.upitSaveti.length, s.slug).toBeGreaterThanOrEqual(3);
      expect(s.upitSaveti.length, s.slug).toBeLessThanOrEqual(5);
      for (const savet of s.upitSaveti) expect(savet, s.slug).toMatch(/^\p{Lu}.{8,}\.$/u);
    }
  });

  it("tekst strane sistema ima bar 200 reči (cilj 250; ispod cilja samo upozorenje)", () => {
    for (const s of SISTEMI) {
      const tekst = [
        s.naziv,
        ...s.uvod,
        ...s.upitSaveti,
        ...grupeSistema(s.slug).flatMap((g) => [
          g.naziv,
          g.kratko,
          g.staRadi,
          g.kadaSeMenja,
          g.savet,
          ...(g.podgrupe ?? []).flatMap((p) => [p.naziv, p.kratko]),
        ]),
      ].join(" ");
      const n = reci(tekst);
      expect(n, `${s.slug}: ${n} reči`).toBeGreaterThanOrEqual(200);
      if (n < 250) console.warn(`[sadrzaj] ${s.slug}: ${n} reči na strani sistema (cilj ≥ 250)`);
    }
  });
});

describe("marke i modeli", () => {
  it("pet marki VW grupe, samo nazivi modela", () => {
    expect(MARKE.map((m) => m.naziv)).toEqual(["Volkswagen", "Audi", "Škoda", "SEAT", "Cupra"]);
    for (const m of MARKE) {
      expect(m.modeli.length).toBeGreaterThan(0);
      for (const model of m.modeli) expect(model).not.toMatch(/\b(19|20)\d{2}\b/);
    }
  });
});

describe("tekstovi sajta: bez izmišljenih činjenica (P5) i placeholder teksta", () => {
  const sajt = stringovi([site.opis, pocetna, kupovina, saradnja, navigacija, upit, stranice, vozilaStrana]);
  // Uvodi, saveti i meta opisi sistema (K04) prolaze iste provere kao tekstovi sajta.
  const sistemi = stringovi(SISTEMI.map((s) => [s.opis, s.uvod, s.upitSaveti, s.metaOpis]));
  const sve = [...sajt, ...stringovi(pravno), ...stringovi(GRUPE), ...stringovi(SISTEMI)];

  it("bez godina, rokova, procenata i cena", () => {
    for (const t of [...sajt, ...sistemi])
      expect(t, t).not.toMatch(/\b\d+\s*(godin|god\.|dana|sati|%|rsd|din\b|€|eur\b)/i);
  });

  it("bez obećanja i marketinških fraza", () => {
    for (const t of [...sajt, ...sistemi, ...stringovi(GRUPE)])
      expect(t, t).not.toMatch(
        /garancij|popust|rabat|besplatn|najbolj|najjeftin|najbrž|brza dostava|hiljad|zadovoljn|jeftin/i,
      );
  });

  it("bez lorem, TODO, TBD, undefined i null", () => {
    for (const t of sve) expect(t, t).not.toMatch(/\b(lorem|todo|tbd|undefined|null)\b/i);
  });

  it("ispravno pisanje marki i platforme", () => {
    for (const t of sve) {
      expect(t, t).not.toMatch(/\bSkoda\b/);
      expect(t, t).not.toMatch(/\bSeat\b/);
      expect(t, t).not.toMatch(/\bCUPRA\b/);
      expect(t, t).not.toMatch(/Kupujem Prodajem|kupujemprodajem(?!\.com)/);
    }
  });
});

describe("P4: privremene vrednosti", () => {
  it("telefon, mejl, KP i domen su očigledno privremeni", () => {
    expect(site.kontakt.telefon).toBe("+381 60 000 0000");
    expect(site.kontakt.email).toBe("info@example.com");
    expect(site.domen).toBe("https://www.example.com");
    expect(site.kp.url).toBe("https://www.kupujemprodajem.com/");
  });
});
