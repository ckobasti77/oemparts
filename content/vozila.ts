/**
 * Marke i modeli (P6: samo tekstom, bez logotipa i boja). Iz _izvor/autodelovi/data/seed/vehicles.ts.txt
 * preuzeti su samo nazivi marki i modela; godine, generacije i kodovi nisu potvrđeni.
 */

export type MarkaSlug = "volkswagen" | "audi" | "skoda" | "seat" | "cupra";
export type Marka = { slug: MarkaSlug; naziv: string; modeli: readonly string[] };

export const MARKE: readonly Marka[] = [
  { slug: "volkswagen", naziv: "Volkswagen", modeli: ["Golf", "Passat", "Polo", "Caddy", "Touran", "Tiguan"] },
  { slug: "audi", naziv: "Audi", modeli: ["A3", "A4", "A6"] },
  { slug: "skoda", naziv: "Škoda", modeli: ["Octavia", "Fabia", "Superb", "Rapid", "Kodiaq", "Karoq"] },
  { slug: "seat", naziv: "SEAT", modeli: ["Leon", "Ibiza", "Ateca"] },
  { slug: "cupra", naziv: "Cupra", modeli: ["Formentor", "Leon", "Ateca"] },
];

export const vozilaStrana = {
  meta: {
    naslov: "Delovi po markama i modelima VW grupe",
    opis: "Delovi za Volkswagen, Audi, Škoda, SEAT i Cupra: Golf, Passat, Octavia, A4, Leon i drugi modeli. Pošaljite broj šasije i proverićemo deo pre ponude.",
  },
  naslov: "Marke i modeli",
  uvod:
    "Delove nabavljamo za vozila pet marki VW grupe. Spisak modela nije potpun: ako vaš model nije naveden, pošaljite broj šasije i proverićemo.",
  /** Oznaka liste modela za čitače ekrana: „Modeli: Volkswagen“. */
  modeli: "Modeli",
  napomenaZigovi:
    "Volkswagen, Audi, Škoda, SEAT i Cupra su žigovi svojih vlasnika. Nazive marki koristimo samo da označimo vozila kojima su delovi namenjeni.",
  cta: {
    naslov: "Vašeg modela nema na spisku?",
    tekst: "Isti model ima više generacija, motora i opreme. Pošaljite broj šasije i šta vam treba, pa ćemo proveriti deo baš za vaše vozilo.",
  },
};
