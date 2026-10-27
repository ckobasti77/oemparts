/**
 * Zajedničko za e2e testove (plan K01 §10.2): spisak strana, praćenje grešaka i zahteva,
 * skrol do dna i čekanje da reveal motor završi.
 */
import type { Page, TestInfo } from "@playwright/test";

import { site } from "@/content/site";
import { javneRute } from "@/lib/routes";

export const BAZA = "http://localhost:3241";

/** Sve javne strane i jedna nepostojeća (404). */
export const STRANE = javneRute();
export const NEPOSTOJECA = "/nema-ove-strane/";

/** Strane sa dosta reveal meta (sekcije, mreže, članci). */
export const DUGE_STRANE = ["/", "/asortiman/", "/asortiman/kocnice/", "/vozila/", "/saradnja/", "/o-nama/", "/kako-kupiti/"];

export const jeTelefon = (info: TestInfo) => info.project.name === "telefon";

/** Brojevi iz `site.ts`, nezavisno od lib/links.ts: samo cifre, sa 381 umesto vodeće nule. */
export function cifre(telefon: string): string {
  const d = telefon.replace(/\D/g, "");
  return d.startsWith("0") ? `381${d.slice(1)}` : d;
}

export const OCEKIVANI = {
  tel: site.kontakt.telefon ? `tel:+${cifre(site.kontakt.telefon)}` : null,
  viber: site.kontakt.viber ? `viber://chat?number=%2B${cifre(site.kontakt.viber)}` : null,
  whatsapp: site.kontakt.whatsapp ? `https://wa.me/${cifre(site.kontakt.whatsapp)}` : null,
  email: site.kontakt.email ? `mailto:${site.kontakt.email}` : null,
  kp: site.kp.url || null,
};

export type Zapisnik = { greske: string[]; tudji: string[]; neuspeli: string[] };

/**
 * Prati konzolu (greške), izuzetke, neuspele zahteve i odgovore ≥ 400 ka našem serveru i svaki
 * zahtev ka tuđem domenu. `dozvoli404` važi samo za sam dokument 404 strane.
 */
export function prati(page: Page, { dozvoli404 = "" }: { dozvoli404?: string } = {}): Zapisnik {
  const z: Zapisnik = { greske: [], tudji: [], neuspeli: [] };
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    // Pregledač sam javlja status dokumenta 404; to je očekivano za nepostojeću stranu.
    if (dozvoli404 && /status of 404/.test(m.text()) && m.location().url.endsWith(dozvoli404)) return;
    z.greske.push(`${m.text()} @ ${m.location().url}`);
  });
  page.on("pageerror", (e) => z.greske.push(`pageerror: ${e.message}`));
  page.on("request", (r) => {
    const url = r.url();
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    if (!url.startsWith(BAZA)) z.tudji.push(url);
  });
  page.on("requestfailed", (r) => {
    // Prekinut prefetch pri odlasku sa strane nije greška sajta.
    if (r.failure()?.errorText === "net::ERR_ABORTED") return;
    z.neuspeli.push(`${r.url()} ${r.failure()?.errorText ?? ""}`);
  });
  page.on("response", (r) => {
    if (r.status() < 400) return;
    if (dozvoli404 && r.url() === `${BAZA}${dozvoli404}`) return;
    z.neuspeli.push(`${r.status()} ${r.url()}`);
  });
  return z;
}

/** Skrol do dna u koracima od ~70 % ekrana, kao čovek koji čita. */
export async function skrolujDoDna(page: Page, pauzaMs = 120): Promise<void> {
  for (let i = 0; i < 200; i++) {
    const kraj = await page.evaluate(() => {
      window.scrollBy(0, Math.round(window.innerHeight * 0.7));
      return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    });
    await page.waitForTimeout(pauzaMs);
    if (kraj) break;
  }
}

/** Čeka da reveal motor bude pokrenut: bar jedna meta ima stanje (ili strana nema meta). */
export async function cekajMotor(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const mete = document.querySelectorAll("[data-reveal]");
      return mete.length === 0 || document.querySelector("[data-reveal-state]") !== null;
    },
    undefined,
    { timeout: 10_000 },
  );
}

/** Čeka da nijedna meta ne bude `pending` ni `running` (posle skrola ili skoka). */
export async function cekajOtkrivanje(page: Page): Promise<void> {
  await page.waitForFunction(
    () => document.querySelector('[data-reveal-state="pending"], [data-reveal-state="running"]') === null,
    undefined,
    { timeout: 10_000 },
  );
}

/** Mete reveal-a koje nisu potpuno vidljive (opacity < 1 ili pomerene), sa opisom. */
export async function skriveneMete(page: Page, samoUEkranu = false): Promise<string[]> {
  return page.evaluate((uEkranu) => {
    const lista: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))) {
      const r = el.getBoundingClientRect();
      if (uEkranu && (r.bottom <= 0 || r.top >= window.innerHeight)) continue;
      const s = getComputedStyle(el);
      const op = Number(s.opacity);
      if (op < 1 || el.dataset.revealState === "pending" || (s.transform !== "none" && s.transform !== "")) {
        lista.push(`${el.tagName.toLowerCase()}#${el.id || "-"} [${el.dataset.revealState ?? "bez stanja"}] opacity ${op}`);
      }
    }
    return lista;
  }, samoUEkranu);
}
