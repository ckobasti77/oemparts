import Link from "next/link";

import { ARIA } from "@/content/navigacija";
import type { Mrvica } from "@/lib/jsonld";

/**
 * Putanja: Početna / Asortiman / Kočnice. Poslednja stavka je trenutna strana (nije link).
 * Isti niz ide u BreadcrumbList JSON-LD (lib/jsonld.ts).
 */
export function Breadcrumbs({ items }: { items: readonly Mrvica[] }) {
  return (
    <nav aria-label={ARIA.putanja}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 type-body-s text-ink-3">
        {items.map((m, i) => {
          const poslednja = i === items.length - 1;
          return (
            <li key={m.putanja} className="flex items-center gap-2">
              {poslednja ? (
                <span aria-current="page" className="text-ink-1">
                  {m.naziv}
                </span>
              ) : (
                <>
                  <Link href={m.putanja} className="inline-flex min-h-11 items-center link-underline">
                    {m.naziv}
                  </Link>
                  <span aria-hidden="true" className="text-ink-4">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
