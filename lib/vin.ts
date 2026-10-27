/**
 * Broj šasije (VIN, ISO 3779): 17 znakova A–Z i 0–9 bez I, O i Q. Kontrolna cifra (9. znak)
 * se ne proverava: evropska VW vozila je nemaju (plan K01 §7.2).
 */

export const VIN_DUZINA = 17;
const VIN_ZNAK = /^[A-HJ-NPR-Z0-9]$/;

export type VinGreska = "prazan" | "duzina" | "slova-ioq" | "znakovi";

export type VinProvera = {
  ok: boolean;
  normalizovan: string;
  duzina: number;
  greska?: VinGreska;
  /** Ispravan VIN kad se O i Q zamene sa 0, a I sa 1. */
  predlog?: string;
};

/** Velika slova, bez razmaka (i neprelomnih), crtica i tačaka. */
export function normalizeVin(unos: string): string {
  return unos.toUpperCase().replace(/[\s.\-‐-―−]/g, "");
}

function samoVinZnakovi(vin: string): boolean {
  return [...vin].every((z) => VIN_ZNAK.test(z));
}

export function validateVin(unos: string): VinProvera {
  const normalizovan = normalizeVin(unos);
  const duzina = [...normalizovan].length;
  if (!normalizovan) return { ok: false, normalizovan, duzina, greska: "prazan" };

  if (!/^[A-Z0-9]+$/.test(normalizovan)) return { ok: false, normalizovan, duzina, greska: "znakovi" };

  if (/[IOQ]/.test(normalizovan)) {
    const zamena = normalizovan.replace(/[OQ]/g, "0").replace(/I/g, "1");
    const predlog = zamena.length === VIN_DUZINA && samoVinZnakovi(zamena) ? zamena : undefined;
    return { ok: false, normalizovan, duzina, greska: "slova-ioq", ...(predlog ? { predlog } : {}) };
  }

  if (duzina !== VIN_DUZINA) return { ok: false, normalizovan, duzina, greska: "duzina" };
  return { ok: true, normalizovan, duzina };
}
