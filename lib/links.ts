/**
 * Graditelji linkova za kanale kontakta (plan K01 §7.1). Kanal bez ispravne vrednosti vraća
 * `null` i ne prikazuje se nigde (P4). Jedini izvor za header, meni, donju traku, footer i kontakt.
 */
import { site } from "@/content/site";
import { KANALI, KANALI_OBLICI } from "@/content/navigacija";
import { formatPhone, normalizePhone } from "@/lib/format";

/** Cifre E.164 broja bez znaka plus. */
function cifre(e164: string): string {
  return e164.replace(/\D/g, "");
}

/** `tel:+381641234567` */
export function telHref(telefon: string | null | undefined): string | null {
  const e164 = normalizePhone(telefon);
  return e164 ? `tel:+${cifre(e164)}` : null;
}

/**
 * `viber://chat?number=%2B381641234567`. Viber za ovaj oblik ne dokumentuje unapred upisan
 * tekst, pa se poruka kopira pri kliku (ODLUKA K01-08).
 */
export function viberHref(telefon: string | null | undefined): string | null {
  const e164 = normalizePhone(telefon);
  return e164 ? `viber://chat?number=${encodeURIComponent(`+${cifre(e164)}`)}` : null;
}

/** `https://wa.me/381641234567`, sa `?text=` (URL-kodirano) kad postoji poruka. */
export function whatsappHref(telefon: string | null | undefined, tekst?: string): string | null {
  const e164 = normalizePhone(telefon);
  if (!e164) return null;
  const base = `https://wa.me/${cifre(e164)}`;
  return tekst && tekst.trim() ? `${base}?text=${encodeURIComponent(tekst)}` : base;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `mailto:` sa naslovom i telom. Novi red se pre kodiranja pretvara u CRLF (`%0D%0A`, RFC 6068).
 */
export function mailtoHref(
  email: string | null | undefined,
  opcije: { subject?: string; body?: string } = {},
): string | null {
  const adresa = email?.trim() ?? "";
  if (!EMAIL.test(adresa)) return null;
  const params: string[] = [];
  if (opcije.subject) params.push(`subject=${encodeURIComponent(opcije.subject)}`);
  if (opcije.body) params.push(`body=${encodeURIComponent(opcije.body.replace(/\r?\n/g, "\r\n"))}`);
  return `mailto:${adresa}${params.length ? `?${params.join("&")}` : ""}`;
}

/** Link KP prodavnice: samo `https:` adresa na domenu kupujemprodajem.com. */
export function kpHref(url: string = site.kp.url): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const ok = u.protocol === "https:" && (host === "kupujemprodajem.com" || host.endsWith(".kupujemprodajem.com"));
    return ok ? u.href : null;
  } catch {
    return null;
  }
}

/** Da li je KP link samo početna strana platforme (privremena vrednost, nije profil firme). */
export function kpJeGenericki(url: string = site.kp.url): boolean {
  const href = kpHref(url);
  return href !== null && new URL(href).pathname.replace(/\/+$/, "") === "";
}

/** Google mapa za ugradnju (učitava se tek na klik, P3). */
export function mapaEmbedSrc(upit: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(upit)}&output=embed`;
}

/** Link ka Google mapama (otvara se u novom prozoru). */
export function mapaLink(upit: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(upit)}`;
}

export type VrstaKanala = "telefon" | "viber" | "whatsapp" | "email" | "kp";

export type Kanal = {
  kanal: VrstaKanala;
  oznaka: string;
  /** Vrednost za prikaz (broj sa neprelomnim razmacima, mejl); prazno za KP. */
  vrednost: string;
  href: string;
  /** Otvara se u novom prozoru (WhatsApp i KP). */
  spoljni: boolean;
};

type KontaktPodaci = {
  telefon: string;
  viber: string;
  whatsapp: string;
  email: string;
};

/** Svi kanali koji imaju ispravnu vrednost, redom: telefon, Viber, WhatsApp, e-pošta, KP. */
export function kanali(kontakt: KontaktPodaci = site.kontakt, kpUrl: string = site.kp.url): Kanal[] {
  const lista: (Kanal | null)[] = [];
  const tel = telHref(kontakt.telefon);
  lista.push(tel ? { kanal: "telefon", oznaka: KANALI.telefon, vrednost: formatPhone(kontakt.telefon), href: tel, spoljni: false } : null);
  const vib = viberHref(kontakt.viber);
  lista.push(vib ? { kanal: "viber", oznaka: KANALI.viber, vrednost: formatPhone(kontakt.viber), href: vib, spoljni: false } : null);
  const wa = whatsappHref(kontakt.whatsapp);
  lista.push(wa ? { kanal: "whatsapp", oznaka: KANALI.whatsapp, vrednost: formatPhone(kontakt.whatsapp), href: wa, spoljni: true } : null);
  const mail = mailtoHref(kontakt.email);
  lista.push(mail ? { kanal: "email", oznaka: KANALI.email, vrednost: kontakt.email.trim(), href: mail, spoljni: false } : null);
  const kp = kpHref(kpUrl);
  lista.push(kp ? { kanal: "kp", oznaka: KANALI.kp, vrednost: "", href: kp, spoljni: true } : null);
  return lista.filter((k): k is Kanal => k !== null);
}

/** Jedan kanal po vrsti ili `null`. */
export function kanal(vrsta: VrstaKanala): Kanal | null {
  return kanali().find((k) => k.kanal === vrsta) ?? null;
}

/** Donja traka akcija (< 1024 px): telefon, Viber i KP, samo oni sa vrednošću (ODLUKA K01-21). */
export function brzeAkcije(lista: readonly Kanal[] = kanali()): Kanal[] {
  return lista.filter((k) => k.kanal === "telefon" || k.kanal === "viber" || k.kanal === "kp");
}

/** „a“, „a ili b“, „a, b ili c“. */
export function nabroj(delovi: readonly string[], veznik = "ili"): string {
  if (delovi.length <= 1) return delovi[0] ?? "";
  return `${delovi.slice(0, -1).join(", ")} ${veznik} ${delovi[delovi.length - 1]}`;
}

export type KanalPoruke = keyof typeof KANALI_OBLICI;
export type Padez = "instr" | "gen";

/** Kanali koji imaju vrednost, kao reči u padežu: „telefonom, Viberom ili mejlom“. */
export function kanaliTekstom(vrste: readonly KanalPoruke[], padez: Padez, lista: readonly Kanal[] = kanali()): string {
  const postoje = new Set(lista.map((k) => k.kanal));
  return nabroj(vrste.filter((v) => postoje.has(v)).map((v) => KANALI_OBLICI[v][padez]));
}

/**
 * Popunjava `{kanali}` u tekstu iz content/ spiskom kanala koji postoje. Kad nijedan ne postoji,
 * rečenica sa `{kanali}` se izostavlja, pa tekst nikad ne pominje kanal koji se ne prikazuje (P4).
 */
export function popuniKanale(
  tekst: string,
  vrste: readonly KanalPoruke[],
  padez: Padez,
  lista: readonly Kanal[] = kanali(),
): string {
  const spisak = kanaliTekstom(vrste, padez, lista);
  if (spisak) return tekst.replaceAll("{kanali}", spisak);
  return tekst
    .split(/(?<=[.!?])\s+/)
    .filter((recenica) => !recenica.includes("{kanali}"))
    .join(" ");
}
