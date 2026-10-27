import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/cn";

/**
 * Disclosure (FAQ): native <details>/<summary>, radi bez JavaScript-a i sa pretragom u strani.
 * Sadržaj se pri otvaranju pojavljuje CSS animacijom (opacity + 8 px, samo transform i opacity);
 * visina se ne animira (ODLUKA K01-06). Strelica se okreće 180°.
 */
export function Disclosure({
  summary,
  children,
  headingLevel = 3,
  className,
  open,
}: {
  summary: ReactNode;
  children: ReactNode;
  /** Pitanje je naslov ovog nivoa unutar <summary>. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
  open?: boolean;
}) {
  const Naslov = `h${headingLevel}` as "h3";
  return (
    <details className={cn("group border-b border-line", className)} open={open}>
      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-3 py-3 transition-control hover:bg-surface-2">
        <Naslov className="type-h3 text-ink-1">{summary}</Naslov>
        <CaretDownIcon
          size={20}
          aria-hidden="true"
          className="shrink-0 text-ink-2 transition-transform duration-[var(--dur-base)] ease-snap group-open:rotate-180"
        />
      </summary>
      <div data-disclosure-content="" className="px-3 pb-5 text-ink-2">
        {children}
      </div>
    </details>
  );
}
