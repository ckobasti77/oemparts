import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import manifest from "@/app/manifest";
import sitemap from "@/app/sitemap";
import { SISTEMI } from "@/content/asortiman";
import { FAQ_KUPOVINA } from "@/content/kupovina";
import { pocetna } from "@/content/pocetna";
import { POLITIKA_PRIVATNOSTI, USLOVI_KORISCENJA } from "@/content/pravno";
import { saradnjaStrana } from "@/content/saradnja";
import { site } from "@/content/site";
import { asortimanStrana, kontaktStrana, oNamaStrana } from "@/content/stranice";
import { upitStrana } from "@/content/upit";
import { vozilaStrana } from "@/content/vozila";
import { kupovinaStrana } from "@/content/kupovina";
import { kanali, popuniKanale, popuniPitanja } from "@/lib/links";
import { prodavnicaLd } from "@/lib/jsonld";
import { RUTE, javneRute } from "@/lib/routes";
import { ogSlikaZa, pageMetadata } from "@/lib/seo";
import { ogStrane } from "../../scripts/og.mjs";

const root = path.resolve(__dirname, "../..");

const sadrzaj = {
  SISTEMI,
  pocetna,
  asortimanStrana,
  vozilaStrana,
  upitStrana,
  saradnjaStrana,
  oNamaStrana,
  kupovinaStrana,
  kontaktStrana,
  site,
};

describe("sitemap, robots, manifest", () => {
  it("sitemap ima sve javne strane, apsolutne i sa „/“, a nijednu dev-only", () => {
    const url = sitemap().map((s) => s.url);
    expect(url).toEqual(javneRute().map((r) => new URL(r, site.domen).href));
    expect(url).toHaveLength(20);
    for (const u of url) expect(u).toMatch(/^https:\/\/www\.example\.com\/([a-z0-9-]+\/)*$/);
    expect(url.join("\n")).not.toContain(RUTE.stil);
  });

  it("robots dozvoljava sve i pominje sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(r.sitemap).toBe("https://www.example.com/sitemap.xml");
  });

  it("manifest uzima podatke iz content/site.ts, a ikonice postoje", () => {
    const m = manifest();
    expect(m.name).toBe(site.brend.lockup);
    expect(m.start_url).toBe("/");
    expect(m.lang).toBe("sr-Latn");
    expect(m.theme_color).toBe(site.temaBoja);
    expect(m.icons?.length).toBeGreaterThan(0);
    for (const ik of m.icons ?? []) expect(existsSync(path.join(root, "public", ik.src)), ik.src).toBe(true);
  });
});

describe("OG slike", () => {
  it("ogSlikaZa: pocetna, asortiman, sistemi, ostale strane i opšte", () => {
    expect(ogSlikaZa("/")).toBe("/og/pocetna.png");
    expect(ogSlikaZa("/asortiman/")).toBe("/og/asortiman.png");
    expect(ogSlikaZa("/asortiman/kocnice/")).toBe("/og/asortiman-kocnice.png");
    expect(ogSlikaZa("/kako-kupiti/")).toBe("/og/kako-kupiti.png");
    expect(ogSlikaZa("/politika-privatnosti/")).toBe("/og/opste.png");
    expect(ogSlikaZa("/uslovi-koriscenja/")).toBe("/og/opste.png");
    expect(ogSlikaZa("/stil/")).toBe("/og/opste.png");
  });

  it("skripta pravi 19 slika, a svaka javna strana ima svoju i ona postoji u public/og/", () => {
    const imena = new Set(ogStrane(sadrzaj).map((s) => s.ime));
    expect(imena.size).toBe(19);
    for (const r of javneRute()) {
      const fajl = ogSlikaZa(r);
      expect(imena.has(path.basename(fajl, ".png")), fajl).toBe(true);
      expect(existsSync(path.join(root, "public", fajl)), fajl).toBe(true);
    }
  });

  it("svaki PNG je 1200×630 i manji od 200 KB", () => {
    for (const s of ogStrane(sadrzaj)) {
      const b = readFileSync(path.join(root, "public", "og", `${s.ime}.png`));
      expect(b.readUInt32BE(16), s.ime).toBe(1200);
      expect(b.readUInt32BE(20), s.ime).toBe(630);
      expect(b.length, s.ime).toBeLessThan(200 * 1024);
    }
  });

  it("pageMetadata podrazumevano dodaje OG i Twitter sliku strane", () => {
    const m = pageMetadata({ naslov: "O nama", opis: "Opis.", putanja: "/o-nama/" });
    expect(m.openGraph).toMatchObject({ images: [{ url: "/og/o-nama.png", width: 1200, height: 630 }] });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", images: ["/og/o-nama.png"] });
  });
});

describe("K06 strane", () => {
  it("meta opisi O nama, Kako kupiti i pravnih strana imaju 120–160 znakova, a naslovi ≤ 60", () => {
    for (const meta of [oNamaStrana.meta, kupovinaStrana.meta, POLITIKA_PRIVATNOSTI.meta, USLOVI_KORISCENJA.meta]) {
      expect(meta.opis.length, meta.naslov).toBeGreaterThanOrEqual(120);
      expect(meta.opis.length, meta.naslov).toBeLessThanOrEqual(160);
      const m = pageMetadata({ naslov: meta.naslov, opis: meta.opis, putanja: "/x/" });
      expect((m.title as { absolute: string }).absolute.length).toBeLessThanOrEqual(60);
    }
  });

  it("meta opisi Kontakta i Upita sa svim kanalima i KP-om imaju 120–160 znakova", () => {
    const kontakt = [popuniKanale(kontaktStrana.meta.opis, kontaktStrana.kanaliMeta, "instr"), kontaktStrana.meta.opisKp].join(" ");
    const upit = popuniKanale(upitStrana.meta.opis, upitStrana.kanali, "instr");
    for (const o of [kontakt, upit]) {
      expect(o.length, o).toBeGreaterThanOrEqual(120);
      expect(o.length, o).toBeLessThanOrEqual(160);
    }
  });

  it("pravne sekcije imaju jedinstvena sidra, a politika kaže da nema kolačića ni analitike", () => {
    for (const p of [POLITIKA_PRIVATNOSTI, USLOVI_KORISCENJA]) {
      const ids = p.sekcije.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
      expect(p.izmenjeno).toBe("28. 10. 2026.");
    }
    const tekst = POLITIKA_PRIVATNOSTI.sekcije.flatMap((s) => s.pasusi).join(" ");
    expect(tekst).toMatch(/kolačiće/);
    expect(tekst).toMatch(/analitiku/);
    expect(tekst).toMatch(/ne šalje na server/);
  });

  it("pravni tekstovi ne sadrže podatke o firmi ni kontakt: dolaze iz content/site.ts", () => {
    const sve = [POLITIKA_PRIVATNOSTI, USLOVI_KORISCENJA].flatMap((p) => p.sekcije.flatMap((s) => s.pasusi)).join(" ");
    expect(sve).not.toMatch(/@|\+381|\bPIB\b \d|example\.com/);
  });

  it("česta pitanja: {kanali} se popunjava samo kanalima koji imaju vrednost", () => {
    const sa = popuniPitanja(FAQ_KUPOVINA);
    expect(sa[0].odgovor).toBe(
      "Ne. Sajt ne prodaje online. Delove kupujete preko naše prodavnice na KupujemProdajem. Možete ih kupiti i direktno, posle dogovora telefonom, Viberom, WhatsApp-om ili mejlom.",
    );
    expect(sa[6].odgovor).toContain("telefonom ili mejlom");
    for (const p of sa) expect(p.odgovor).not.toContain("{kanali}");

    const bez = popuniPitanja(FAQ_KUPOVINA, kanali({ telefon: "", viber: "", whatsapp: "", email: "" }, ""));
    expect(bez[0].odgovor).toBe("Ne. Sajt ne prodaje online. Delove kupujete preko naše prodavnice na KupujemProdajem.");
    expect(bez[6].odgovor).toBe("Pre kupovine proverite deo po broju šasije.");
    for (const p of bez) expect(p.odgovor).not.toMatch(/Viber|WhatsApp|mejl|telefon/);
  });

  it("JSON-LD firme: kontakt samo iz site.ts, slika je OG početne, prazna adresa daje Organization", () => {
    const ld = prodavnicaLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.image).toBe("https://www.example.com/og/pocetna.png");
    expect(ld.email).toBe(site.kontakt.email);
    expect(ld.telephone).toBe("+381600000000");
  });
});
