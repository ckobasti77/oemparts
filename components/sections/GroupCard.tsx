import Link from "next/link";

import { PartImage } from "@/components/ui/PartImage";
import type { Grupa } from "@/content/asortiman";
import { typographer } from "@/lib/format";
import { grupaRuta } from "@/lib/routes";

/**
 * Kartica grupe delova (asortiman): render 1:1 i naziv; kratak opis od 480 px. Cela kartica je
 * jedan link na članak grupe (`/asortiman/<sistem>/#<grupa>`). Hover kao `SystemCard`.
 * `prioritet`: render je u prvom ekranu (LCP), vidi `PartImage`.
 */
export function GroupCard({ grupa, prioritet = false }: { grupa: Grupa; prioritet?: boolean }) {
  return (
    <Link href={grupaRuta(grupa.sistem, grupa.slug)} className="flex h-full flex-col overflow-hidden panel card-link">
      <div className="tile-render overflow-hidden">
        <div data-card-media="">
          <PartImage
            slug={grupa.slug}
            alt=""
            prioritet={prioritet}
            sizes="(min-width: 80rem) 244px, (min-width: 48rem) 30vw, 46vw"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="type-body leading-snug font-semibold text-ink-1">{typographer(grupa.naziv)}</h3>
        <p className="hidden type-body-s text-ink-3 sm:block">{typographer(grupa.kratko)}</p>
      </div>
    </Link>
  );
}
