import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { IKONA_KANALA } from "@/components/layout/ContactChannels";
import { ARIA } from "@/content/navigacija";
import { kontaktStrana } from "@/content/stranice";
import { cn } from "@/lib/cn";
import { kanali } from "@/lib/links";

/**
 * Kanali kao redovi jednog panela (plan K01 §4.9): ceo red je link, visine 64 px — ikona, naziv,
 * vrednost i strelica (↗ za novi prozor). Samo kanali sa vrednošću (P4). Panel r 14 sa 4 px
 * unutrašnjeg razmaka, pa su redovi r 10 (koncentrično); fokus prsten prati red.
 */
export function ChannelList({ className }: { className?: string }) {
  const lista = kanali();
  if (lista.length === 0) return null;
  return (
    <ul className={cn("panel divide-y divide-line p-1", className)}>
      {lista.map((k) => {
        const Ikona = IKONA_KANALA[k.kanal];
        const Strelica = k.spoljni ? ArrowUpRightIcon : ArrowRightIcon;
        const vrednost = k.vrednost || (k.kanal === "kp" ? kontaktStrana.kpVrednost : "");
        return (
          <li key={k.kanal} className="py-0.5 first:pt-0 last:pb-0">
            <a
              href={k.href}
              {...(k.spoljni ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex min-h-16 items-center gap-4 rounded-sm px-4 py-2 transition-control hover:bg-surface-2"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xs border border-line bg-surface-2 text-ink-2 transition-control group-hover:text-ink-1"
              >
                <Ikona size={20} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="font-semibold text-ink-1">{k.oznaka}</span>
                {vrednost ? <span className="text-ink-2 tabular-nums [overflow-wrap:anywhere]">{vrednost}</span> : null}
              </span>
              {k.spoljni ? <span className="sr-only"> {ARIA.noviProzor}</span> : null}
              <Strelica
                size={18}
                aria-hidden="true"
                className="shrink-0 text-ink-3 transition-transform duration-[var(--dur-base)] ease-out group-hover:translate-x-0.5 group-hover:text-ink-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
