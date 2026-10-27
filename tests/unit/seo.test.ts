import { describe, expect, it } from "vitest";

import { SISTEMI } from "@/content/asortiman";
import { kupovinaStrana } from "@/content/kupovina";
import { pocetna } from "@/content/pocetna";
import { POLITIKA_PRIVATNOSTI, USLOVI_KORISCENJA } from "@/content/pravno";
import { saradnjaStrana } from "@/content/saradnja";
import { asortimanStrana, kontaktStrana, oNamaStrana } from "@/content/stranice";
import { upitStrana } from "@/content/upit";
import { vozilaStrana } from "@/content/vozila";
import { breadcrumbLd, faqLd, prodavnicaLd, sazmi, serijalizuj, websiteLd } from "@/lib/jsonld";
import { NASLOV_MAX, apsolutniUrl, naslovStrane, pageMetadata } from "@/lib/seo";

describe("naslov strane", () => {
  it("pun sufiks kad staje u 60 znakova", () => {
    expect(naslovStrane("Kontakt")).toBe("Kontakt | Euromotors Plus · OEM Parts");
  });
  it("kratak sufiks kad pun ne staje", () => {
    expect(naslovStrane("Originalni i OEM delovi za VW grupu")).toBe("Originalni i OEM delovi za VW grupu | Euromotors Plus");
  });
  it("bez sufiksa kad ni kratak ne staje; naslov se ne seče", () => {
    const n = "Vešanje i upravljanje — delovi za vozila VW grupe";
    expect(naslovStrane(n)).toBe(n);
  });

  it("svi naslovi strana su jedinstveni i ≤ 60 znakova", () => {
    const naslovi = [
      pocetna.meta.naslov,
      asortimanStrana.meta.naslov,
      ...SISTEMI.map((s) => `${s.naziv}${asortimanStrana.sistemNaslovSufiks}`),
      vozilaStrana.meta.naslov,
      upitStrana.meta.naslov,
      saradnjaStrana.meta.naslov,
      oNamaStrana.meta.naslov,
      kupovinaStrana.meta.naslov,
      kontaktStrana.meta.naslov,
      POLITIKA_PRIVATNOSTI.meta.naslov,
      USLOVI_KORISCENJA.meta.naslov,
    ].map(naslovStrane);
    expect(new Set(naslovi).size).toBe(naslovi.length);
    for (const n of naslovi) expect(n.length, n).toBeLessThanOrEqual(NASLOV_MAX);
  });

  it("svi meta opisi strana su jedinstveni; opisi sistema 120–160 znakova", () => {
    const opisi = [
      pocetna.meta.opis,
      asortimanStrana.meta.opis,
      ...SISTEMI.map((s) => s.metaOpis),
      vozilaStrana.meta.opis,
      upitStrana.meta.opis,
      saradnjaStrana.meta.opis,
      oNamaStrana.meta.opis,
      kupovinaStrana.meta.opis,
      kontaktStrana.meta.opis,
      POLITIKA_PRIVATNOSTI.meta.opis,
      USLOVI_KORISCENJA.meta.opis,
    ];
    expect(new Set(opisi).size).toBe(opisi.length);
    for (const s of SISTEMI) {
      expect(s.metaOpis.length, s.slug).toBeGreaterThanOrEqual(120);
      expect(s.metaOpis.length, s.slug).toBeLessThanOrEqual(160);
    }
  });
});

describe("pageMetadata", () => {
  it("canonical sa „/“, OG i Twitter iz istih vrednosti", () => {
    const m = pageMetadata({ naslov: "Kontakt", opis: "Opis strane.", putanja: "/kontakt/" });
    expect(m.alternates?.canonical).toBe("/kontakt/");
    expect(m.title).toEqual({ absolute: "Kontakt | Euromotors Plus · OEM Parts" });
    expect(m.openGraph).toMatchObject({ url: "/kontakt/", locale: "sr_RS", siteName: "Euromotors Plus" });
    expect(m.robots).toEqual({ index: true, follow: true });
  });
  it("noindex", () => {
    expect(pageMetadata({ naslov: "Stil", opis: "x", putanja: "/stil/", noindex: true }).robots).toEqual({
      index: false,
      follow: false,
    });
  });
  it("apsolutni URL na domenu sajta", () => {
    expect(apsolutniUrl("/asortiman/kocnice/")).toBe("https://www.example.com/asortiman/kocnice/");
  });
});

describe("JSON-LD", () => {
  it("izostavlja prazne vrednosti", () => {
    expect(sazmi({ a: "", b: null, c: undefined, d: [], e: "x" })).toEqual({ e: "x" });
  });

  it("Organization bez adrese, AutoPartsStore sa adresom; sameAs bez generičkog KP linka", () => {
    const bez = prodavnicaLd();
    expect(bez["@type"]).toBe("Organization");
    expect(bez.address).toBeUndefined();
    expect(bez.sameAs).toBeUndefined();
    expect(bez.telephone).toBe("+381600000000");

    const sa = prodavnicaLd({
      adresa: { ulica: "Ulica 1", postanskiBroj: "11000", mesto: "Beograd" },
      firma: { naziv: "Firma d.o.o." },
      kontakt: { telefon: "", email: "" },
      radnoVreme: [{ dani: ["pon", "pet"], od: "08:00", do: "16:00" }],
      kpUrl: "https://www.kupujemprodajem.com/euromotors/svi-oglasi",
    });
    expect(sa["@type"]).toBe("AutoPartsStore");
    expect(sa.address).toMatchObject({ addressLocality: "Beograd", addressCountry: "RS" });
    expect(sa.sameAs).toEqual(["https://www.kupujemprodajem.com/euromotors/svi-oglasi"]);
    expect(sa.telephone).toBeUndefined();
    expect(sa.openingHoursSpecification).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Friday"], opens: "08:00", closes: "16:00" },
    ]);
  });

  it("BreadcrumbList sa apsolutnim URL-ovima", () => {
    const b = breadcrumbLd([
      { naziv: "Početna", putanja: "/" },
      { naziv: "Asortiman", putanja: "/asortiman/" },
    ]);
    expect(b.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Početna", item: "https://www.example.com/" },
      { "@type": "ListItem", position: 2, name: "Asortiman", item: "https://www.example.com/asortiman/" },
    ]);
  });

  it("WebSite i FAQPage", () => {
    expect(websiteLd()).toMatchObject({ "@type": "WebSite", name: "Euromotors Plus", alternateName: "OEM Parts" });
    expect(faqLd([{ pitanje: "P?", odgovor: "O." }]).mainEntity).toEqual([
      { "@type": "Question", name: "P?", acceptedAnswer: { "@type": "Answer", text: "O." } },
    ]);
  });

  it("serijalizacija menja „<“ (XSS)", () => {
    const s = serijalizuj({ x: "</script><script>alert(1)</script>" });
    expect(s).not.toContain("<");
    expect(JSON.parse(s)).toEqual({ x: "</script><script>alert(1)</script>" });
  });
});
