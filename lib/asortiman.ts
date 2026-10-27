/** Pomoćnici za content/asortiman.ts. */
import { GRUPE, SISTEMI, type Grupa, type Sistem, type SistemSlug } from "@/content/asortiman";
import { mnozina } from "@/lib/format";

export function sistemPoSlugu(slug: string): Sistem | undefined {
  return SISTEMI.find((s) => s.slug === slug);
}

export function grupaPoSlugu(slug: string): Grupa | undefined {
  return GRUPE.find((g) => g.slug === slug);
}

export function grupeSistema(slug: SistemSlug): Grupa[] {
  return GRUPE.filter((g) => g.sistem === slug);
}

/** Susedni sistemi po redosledu (za „prethodni / sledeći“). */
export function susedniSistemi(slug: SistemSlug): { prethodni?: Sistem; sledeci?: Sistem } {
  const sortirani = [...SISTEMI].sort((a, b) => a.redosled - b.redosled);
  const i = sortirani.findIndex((s) => s.slug === slug);
  return { prethodni: sortirani[i - 1], sledeci: sortirani[i + 1] };
}

/** „13 grupa“, „2 grupe“, „1 grupa“. */
export function brojGrupa(n: number): string {
  return `${n} ${mnozina(n, ["grupa", "grupe", "grupa"])}`;
}

/** Putanje rendera: 768 px original i 384 px varijanta. */
export function slikaDela(slug: string): { src: string; src384: string } {
  return { src: `/images/delovi/${slug}.webp`, src384: `/images/delovi/${slug}-384.webp` };
}
