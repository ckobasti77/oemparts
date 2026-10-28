import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Korak } from "@/content/kupovina";
import { cn } from "@/lib/cn";
import { typographer } from "@/lib/format";

/**
 * Numerisani koraci (redosled nosi informaciju). Na telefonu uspravno sa linijom levo; od 768 px
 * dve kolone, od 1280 px svi u redu sa linijom između brojeva. Isti oblik kao „Kako kupiti“ na početnoj.
 */
export function Koraci({ koraci, className }: { koraci: readonly Korak[]; className?: string }) {
  const n = koraci.length;
  return (
    <RevealGroup
      as="ol"
      className={cn("grid md:grid-cols-2 md:gap-x-[var(--gutter)] md:gap-y-10 xl:grid-cols-4", className)}
    >
      {koraci.map((k, i) => {
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
              {!poslednji ? (
                <span aria-hidden="true" className="hidden h-px flex-1 bg-line-strong xl:block" />
              ) : null}
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
  );
}
