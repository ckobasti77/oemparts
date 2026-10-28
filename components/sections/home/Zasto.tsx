import {
  HandshakeIcon,
  IdentificationCardIcon,
  SealCheckIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { pocetna } from "@/content/pocetna";
import { typographer } from "@/lib/format";
import { popuniKanale } from "@/lib/links";

/** Ikone redom uz stavke „Zašto“ (plan K01 §3.8). */
const IKONE = [SealCheckIcon, IdentificationCardIcon, WrenchIcon, HandshakeIcon];

/** Zašto mi (sekcija 4): uvod levo (lepljiv od 1024 px), četiri reda desno, razdvojeni linijom. Bez CTA. */
export function Zasto() {
  const t = pocetna.zasto;
  return (
    <section aria-labelledby="zasto-naslov" className="px-page py-section">
      <div className="grid gap-block lg:grid-cols-12 lg:gap-gutter">
        <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5 lg:self-start">
          <h2 id="zasto-naslov" className="max-w-[14ch] type-display-l text-ink-1">
            {t.naslov}
          </h2>
          <p className="mt-4 max-w-[40ch] type-lead">{t.uvod}</p>
        </Reveal>
        <RevealGroup as="ul" className="lg:col-span-6 lg:col-start-7">
          {t.stavke.map((s, i) => {
            const Ikona = IKONE[i % IKONE.length];
            return (
              <RevealItem
                as="li"
                key={s.naslov}
                className="flex gap-4 border-t border-line py-6 first:border-t-0 first:pt-0 last:pb-0 md:gap-5"
              >
                <Ikona size={24} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-2" />
                <div>
                  <h3 className="type-h3 text-ink-1">{typographer(s.naslov)}</h3>
                  <p className="mt-1.5 max-w-[52ch] text-ink-2">
                    {typographer(popuniKanale(s.tekst, pocetna.kanaliZasto, "instr"))}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
