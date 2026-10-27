/**
 * Upit po broju šasije (P2): provera polja i sastav poruke. Čiste funkcije; forma (K05)
 * samo prikazuje rezultat. Ništa se ne šalje na server.
 */
import { site } from "@/content/site";
import { UPIT_GRESKE, UPIT_LIMITI, UPIT_POLJA, UPIT_PORUKA } from "@/content/upit";
import { formatPhone, normalizePhone } from "@/lib/format";
import { mailtoHref, viberHref, whatsappHref } from "@/lib/links";
import { validateVin } from "@/lib/vin";

export type UpitPolja = {
  ime: string;
  telefon: string;
  vin: string;
  marka: string;
  model: string;
  deo: string;
  napomena: string;
};

export type UpitGreske = Partial<Record<keyof UpitPolja, string>>;

export const PRAZAN_UPIT: UpitPolja = {
  ime: "",
  telefon: "",
  vin: "",
  marka: "",
  model: "",
  deo: "",
  napomena: "",
};

/** Jednoredno polje: bez viška razmaka. */
function red(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Višeredno polje: zadržava redove, `\r\n` → `\n`, bez praznog viška. Brojač u formi meri isto. */
export function tekst(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function zameni(sablon: string, vrednosti: Record<string, string | number>): string {
  return sablon.replace(/\{(\w+)\}/g, (_, k: string) => String(vrednosti[k] ?? ""));
}

/** Marka koja se prikazuje u poruci („Druga marka“ se ne upisuje). */
function markaZaPoruku(marka: string): string {
  const m = red(marka);
  return m === UPIT_POLJA.markaDruga ? "" : m;
}

export function proveriUpit(polja: UpitPolja): UpitGreske {
  const greske: UpitGreske = {};
  const ime = red(polja.ime);
  if (!ime) greske.ime = UPIT_GRESKE.imePrazno;
  else if (ime.length < 2) greske.ime = UPIT_GRESKE.imeKratko;
  else if (ime.length > UPIT_LIMITI.ime) greske.ime = zameni(UPIT_GRESKE.predugo, { max: UPIT_LIMITI.ime });

  if (!red(polja.telefon)) greske.telefon = UPIT_GRESKE.telefonPrazno;
  else if (!normalizePhone(polja.telefon)) greske.telefon = UPIT_GRESKE.telefonNeispravan;

  const vinUnos = red(polja.vin);
  const model = red(polja.model);
  if (vinUnos) {
    const v = validateVin(vinUnos);
    if (!v.ok) {
      if (v.greska === "duzina") greske.vin = zameni(UPIT_GRESKE.vinDuzina, { n: v.duzina });
      else if (v.greska === "slova-ioq")
        greske.vin = v.predlog
          ? `${UPIT_GRESKE.vinIoq} ${zameni(UPIT_GRESKE.vinPredlog, { predlog: v.predlog })}`
          : UPIT_GRESKE.vinIoq;
      else greske.vin = UPIT_GRESKE.vinZnakovi;
    }
  } else if (!red(polja.marka) && !model) {
    greske.vin = UPIT_GRESKE.voziloPrazno;
  } else if (!model) {
    greske.model = UPIT_GRESKE.modelPrazno;
  }
  if (model.length > UPIT_LIMITI.model) greske.model = zameni(UPIT_GRESKE.predugo, { max: UPIT_LIMITI.model });

  const deo = tekst(polja.deo);
  if (deo.length < 3) greske.deo = UPIT_GRESKE.deoPrazno;
  else if (deo.length > UPIT_LIMITI.deo) greske.deo = zameni(UPIT_GRESKE.predugo, { max: UPIT_LIMITI.deo });

  if (tekst(polja.napomena).length > UPIT_LIMITI.napomena)
    greske.napomena = zameni(UPIT_GRESKE.predugo, { max: UPIT_LIMITI.napomena });

  return greske;
}

export function upitJeIspravan(polja: UpitPolja): boolean {
  return Object.keys(proveriUpit(polja)).length === 0;
}

/** Tekst poruke (plan K01 §7.4). Redovi bez vrednosti se izostavljaju. */
export function sastaviPoruku(polja: UpitPolja): string {
  const vin = red(polja.vin) ? validateVin(polja.vin).normalizovan : "";
  const vozilo = [markaZaPoruku(polja.marka), red(polja.model)].filter(Boolean).join(" ");
  const telefon = red(polja.telefon) ? formatPhone(polja.telefon, " ") : "";
  const redovi: [string, string][] = [
    [UPIT_PORUKA.ime, red(polja.ime)],
    [UPIT_PORUKA.telefon, telefon],
    [UPIT_PORUKA.vin, vin],
    [UPIT_PORUKA.vozilo, vozilo],
    [UPIT_PORUKA.deo, tekst(polja.deo)],
    [UPIT_PORUKA.napomena, tekst(polja.napomena)],
  ];
  return [UPIT_PORUKA.zaglavlje, ...redovi.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");
}

/** Naslov mejla: po broju šasije, inače po vozilu. */
export function naslovPoruke(polja: UpitPolja): string {
  if (red(polja.vin)) return zameni(UPIT_PORUKA.naslovVin, { vin: validateVin(polja.vin).normalizovan });
  const vozilo = [markaZaPoruku(polja.marka), red(polja.model)].filter(Boolean).join(" ");
  return vozilo ? zameni(UPIT_PORUKA.naslovVozilo, { vozilo }) : UPIT_PORUKA.naslovOpsti;
}

export type LinkoviPoruke = { viber: string | null; whatsapp: string | null; email: string | null };

/**
 * Linkovi za slanje cele poruke (plan K01 §7.5): Viber i WhatsApp nose tekst, mejl naslov i telo.
 * Kanal bez vrednosti u `content/site.ts` daje `null` i ne prikazuje se (P4).
 */
export function linkoviPoruke(
  polja: UpitPolja,
  kontakt: { viber: string; whatsapp: string; email: string } = site.kontakt,
): LinkoviPoruke {
  const poruka = sastaviPoruku(polja);
  return {
    viber: viberHref(kontakt.viber, poruka),
    whatsapp: whatsappHref(kontakt.whatsapp, poruka),
    email: mailtoHref(kontakt.email, { subject: naslovPoruke(polja), body: poruka }),
  };
}

/** Početni tekst polja „Deo“ za `/upit/?deo=<grupa>`: „Kočioni diskovi: “; nepoznat slug daje „“. */
export function deoIzUpita(pretraga: string, delovi: Readonly<Record<string, string>>): string {
  const slug = new URLSearchParams(pretraga).get("deo");
  const naziv = slug && Object.hasOwn(delovi, slug) ? delovi[slug] : "";
  return naziv ? `${naziv}: ` : "";
}
