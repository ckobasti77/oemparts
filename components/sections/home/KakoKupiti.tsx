import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { KORACI_KUPOVINE } from "@/content/kupovina";
import { pocetna } from "@/content/pocetna";
import { typographer } from "@/lib/format";
import { RUTE } from "@/lib/routes";

/**
 * Kako kupiti (sekcija 5): tri koraka. Brojevi su ovde opravdani jer redosled nosi informaciju.
 * Na telefonu koraci idu uspravno sa linijom levo, od 768 px vodoravno sa linijom između brojeva.
 */
export function KakoKupiti() {
  const t = pocetna.kako;
  const n = KORACI_KUPOVINE.length;
  return (
    <section aria-labelledby="kako-naslov" className="bg-bg-raised px-page py-section">
      <Reveal className="mb-[var(--space-block)] flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="kako-naslov" className="type-display-l text-ink-1">
          {t.naslov}
        </h2>
        {/* Prikaz se zadaje omotaču: `hidden` na samom linku bi se sudario sa njegovim `inline-flex`. */}
        <div className="hidden shrink-0 md:block">
          <TextLink href={RUTE.kakoKupiti} arrow>
            {t.link}
          </TextLink>
        </div>
      </Reveal>
      <RevealGroup as="ol" className="grid md:grid-cols-3 md:gap-gutter">
        {KORACI_KUPOVINE.map((k, i) => {
          const poslednji = i === n - 1;
          return (
            <RevealItem
              as="li"
              key={k.naslov}
              className="relative grid grid-cols-[3rem_1fr] items-start gap-x-4 pb-10 last:pb-0 md:block md:pb-0"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xs border border-line-strong bg-surface-1 type-display-m text-ink-2 tabular-nums"
                >
                  {i + 1}
                </span>
                {!poslednji ? <span aria-hidden="true" className="hidden h-px flex-1 bg-line-strong md:block" /> : null}
              </div>
              {!poslednji ? (
                <span aria-hidden="true" className="absolute top-14 bottom-2 left-6 w-px bg-line-strong md:hidden" />
              ) : null}
              <div className="md:mt-6 md:pr-6">
                <h3 className="pt-2.5 type-h3 text-ink-1 md:pt-0">{typographer(k.naslov)}</h3>
                <p className="mt-2 max-w-[40ch] text-ink-2">{typographer(k.tekst)}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
      <div className="mt-8 md:hidden">
        <TextLink href={RUTE.kakoKupiti} arrow>
          {t.link}
        </TextLink>
      </div>
    </section>
  );
}
