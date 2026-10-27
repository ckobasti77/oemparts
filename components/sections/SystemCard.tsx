import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { PartImage } from "@/components/ui/PartImage";
import type { Sistem } from "@/content/asortiman";
import { brojGrupa, grupeSistema } from "@/lib/asortiman";
import { cn } from "@/lib/cn";
import { sistemRuta } from "@/lib/routes";

/**
 * Kartica sistema (početna; K04 je koristi i na asortimanu). Cela kartica je jedan link.
 * - < 768 px: render 1:1 iznad naziva (mreža 2 kolone), opis od 480 px;
 * - 768–1279 px: vodoravna (render 112 px levo, tekst desno), mreža 2 kolone — 10 sistema bez
 *   siročeta u poslednjem redu;
 * - ≥ 1280 px: render iznad naziva, mreža 5 kolona.
 * Hover (fini pokazivač): kartica −2 px, render 1,03 (`card-link`).
 */
export function SystemCard({
  sistem,
  naslov: Naslov = "h3",
  className,
}: {
  sistem: Sistem;
  /** Nivo naslova u kartici. */
  naslov?: "h2" | "h3";
  className?: string;
}) {
  const n = grupeSistema(sistem.slug).length;
  return (
    <Link
      href={sistemRuta(sistem.slug)}
      className={cn(
        "flex h-full flex-col overflow-hidden panel card-link",
        "md:flex-row md:items-center md:gap-4 md:p-3",
        "xl:flex-col xl:items-stretch xl:gap-0 xl:p-0",
        className,
      )}
    >
      <div className="tile-render overflow-hidden md:size-28 md:shrink-0 md:rounded-xs xl:size-auto xl:rounded-none">
        <div data-card-media="">
          <PartImage slug={sistem.slika} alt="" sizes="(min-width: 80rem) 232px, (min-width: 48rem) 112px, 46vw" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4 md:p-0 md:pr-2 xl:p-4">
        <Naslov className="type-h3 text-ink-1">{sistem.naziv}</Naslov>
        <p className="hidden type-body-s text-ink-2 sm:line-clamp-2 xl:line-clamp-3">{sistem.opis}</p>
        <p className="mt-auto flex items-center justify-between gap-2 pt-2 type-caption text-ink-3">
          <span>{brojGrupa(n)}</span>
          <ArrowRightIcon size={16} aria-hidden="true" className="shrink-0" />
        </p>
      </div>
    </Link>
  );
}
