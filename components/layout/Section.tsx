import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/**
 * Sekcija strane: `py-section`, naslov (h2) i opcioni uvod u reveal bloku, pa sadržaj.
 * `ton="raised"` daje traku preko cele širine (bez radijusa: dodiruje ivice ekrana).
 */
export function Section({
  id,
  naslov,
  uvod,
  naslovStil = "sans",
  ton = "bg",
  akcija,
  children,
  className,
}: {
  id?: string;
  naslov?: string;
  uvod?: ReactNode;
  /** `display` za sekcije početne (velika slova), `sans` za unutrašnje strane. */
  naslovStil?: "display" | "sans";
  ton?: "bg" | "raised";
  /** Link ili dugme desno od naslova (≥ 768 px), ispod na telefonu. */
  akcija?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("px-page py-section", ton === "raised" && "bg-bg-raised", className)}
      aria-labelledby={naslov && id ? `${id}-naslov` : undefined}
    >
      {naslov ? (
        <Reveal className="mb-[var(--space-block)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[60ch]">
            <h2
              id={id ? `${id}-naslov` : undefined}
              className={naslovStil === "display" ? "type-display-l text-ink-1" : "type-h2 text-ink-1"}
            >
              {naslov}
            </h2>
            {uvod ? <p className="mt-4 type-lead">{uvod}</p> : null}
          </div>
          {akcija ? <div className="shrink-0">{akcija}</div> : null}
        </Reveal>
      ) : null}
      {children}
    </section>
  );
}
