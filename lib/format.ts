/**
 * Formatiranje: telefoni (E.164 i prikaz), radno vreme, množina i srpski neprelomni razmaci.
 * Prilagođeno iz _izvor/autodelovi/code/lib/format/{phone,nbsp,hours}.ts.txt.
 */
import type { Dan, RadnoVreme } from "@/content/site";

const NBSP = " ";
const SERBIA = "381";
/** Trocifreni pozivni brojevi u Srbiji; ostali fiksni su dvocifreni (10–39). */
const THREE_DIGIT_AREA_CODES = new Set(["230", "280", "290", "390"]);
const TWO_DIGIT_COUNTRY_CODES = new Set(
  (
    "20 27 30 31 32 33 34 36 39 40 41 43 44 45 46 47 48 49 51 52 53 54 55 56 57 58 " +
    "60 61 62 63 64 65 66 81 82 84 86 90 91 92 93 94 95 98"
  ).split(" "),
);
const ALLOWED_CHARS = /^\+?[\d\s  ()./-]+$/;

function isSerbianNationalNumber(nsn: string): boolean {
  return /^6\d{7,8}$/.test(nsn) || /^[1-3]\d{7,8}$/.test(nsn);
}

/**
 * Broj telefona u E.164 obliku (`+381641234567`) ili `null` kad je prazan ili neispravan.
 * Prima `064 123 4567`, `+381 64 123 4567`, `00381…`, `(011) 123-45-67`, `+381 (0) 64 …`.
 */
export function normalizePhone(input: string | null | undefined): string | null {
  if (typeof input !== "string") return null;
  const text = input.trim().replace(/\(\s*0\s*\)/g, " ");
  if (!text || !ALLOWED_CHARS.test(text)) return null;
  const hasPlus = text.startsWith("+");
  const digits = text.replace(/\D/g, "");
  if (!digits) return null;

  let international: string | null = null;
  let national: string | null = null;
  if (hasPlus) international = digits;
  else if (digits.startsWith("00")) international = digits.slice(2);
  else if (digits.startsWith(SERBIA) && (digits.length === 11 || digits.length === 12)) international = digits;
  else if (digits.startsWith("0")) national = digits.slice(1);
  else if (/^6\d{7,8}$/.test(digits)) national = digits;

  if (international !== null) {
    if (international.startsWith(SERBIA)) {
      national = international.slice(SERBIA.length).replace(/^0/, "");
    } else {
      return /^[1-9]\d{7,14}$/.test(international) ? `+${international}` : null;
    }
  }
  if (national === null || !isSerbianNationalNumber(national)) return null;
  return `+${SERBIA}${national}`;
}

function groupSubscriber(subscriber: string): string[] {
  return subscriber.length > 3 ? [subscriber.slice(0, 3), subscriber.slice(3)] : [subscriber];
}

/**
 * Prikaz broja: `+381 64 123 4567`. Podrazumevano sa neprelomnim razmacima (U+00A0), da se
 * broj ne prelama; `separator: " "` za tekst poruke.
 */
export function formatPhone(input: string, separator: string = NBSP): string {
  const normalized = normalizePhone(input);
  if (!normalized) return input.trim();
  const digits = normalized.slice(1);
  if (digits.startsWith(SERBIA)) {
    const national = digits.slice(SERBIA.length);
    const areaLength = !national.startsWith("6") && THREE_DIGIT_AREA_CODES.has(national.slice(0, 3)) ? 3 : 2;
    return [`+${SERBIA}`, national.slice(0, areaLength), ...groupSubscriber(national.slice(areaLength))].join(separator);
  }
  const ccLength =
    digits.startsWith("1") || digits.startsWith("7") ? 1 : TWO_DIGIT_COUNTRY_CODES.has(digits.slice(0, 2)) ? 2 : 3;
  return `+${digits.slice(0, ccLength)}${separator}${digits.slice(ccLength)}`;
}

const DAN_KRATKO: Record<Dan, string> = {
  pon: "pon",
  uto: "uto",
  sre: "sre",
  cet: "čet",
  pet: "pet",
  sub: "sub",
  ned: "ned",
};
const REDOSLED: readonly Dan[] = ["pon", "uto", "sre", "cet", "pet", "sub", "ned"];

function sat(vreme: string): string {
  const [h, m] = vreme.split(":");
  const hour = String(Number(h));
  return m && m !== "00" ? `${hour}:${m}` : hour;
}

/** „Pon–pet 8–16, sub 8–13“; prazno kad radno vreme nije uneto. */
export function formatRadnoVreme(redovi: readonly RadnoVreme[]): string {
  const delovi = redovi
    .filter((r) => r.dani.length > 0)
    .map((r) => {
      const dani = [...r.dani].sort((a, b) => REDOSLED.indexOf(a) - REDOSLED.indexOf(b));
      const prvi = DAN_KRATKO[dani[0]];
      const poslednji = DAN_KRATKO[dani[dani.length - 1]];
      const uzastopni = dani.every((d, i) => i === 0 || REDOSLED.indexOf(d) === REDOSLED.indexOf(dani[i - 1]) + 1);
      const daniTekst =
        dani.length === 1 ? prvi : uzastopni ? `${prvi}–${poslednji}` : dani.map((d) => DAN_KRATKO[d]).join(", ");
      return `${daniTekst} ${sat(r.od)}–${sat(r.do)}`;
    });
  const tekst = delovi.join(", ");
  return tekst ? tekst.charAt(0).toUpperCase() + tekst.slice(1) : "";
}

/** Srpska množina: mnozina(2, ["grupa", "grupe", "grupa"]) → „grupe“. */
export function mnozina(n: number, oblici: readonly [string, string, string]): string {
  const d = Math.abs(n) % 10;
  const s = Math.abs(n) % 100;
  if (d === 1 && s !== 11) return oblici[0];
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return oblici[1];
  return oblici[2];
}

const UNIT_AFTER_NUMBER = /(\d)[ \t]+(RSD|kom\.?|mm|cm|kg|kW|KS|V|%|dana|din\.?)(?![\p{L}\p{N}])/gu;
const ONE_LETTER_WORD = /(?<![\p{L}\p{N}_])([iuskoaIUSKOA])[ \t]+(?=\S)/gu;
const SPACED_DASH = /[ \t]+([–—])(?=\s|$)/g;

/**
 * Srpska tipografija: broj ostaje uz jedinicu, jednoslovne reči (i, u, s, k, o, a) uz
 * sledeću reč, a crta nikad ne počinje red.
 */
export function typographer(text: string): string {
  return text
    .replace(UNIT_AFTER_NUMBER, `$1${NBSP}$2`)
    .replace(ONE_LETTER_WORD, `$1${NBSP}`)
    .replace(SPACED_DASH, `${NBSP}$1`);
}
