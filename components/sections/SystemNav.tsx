import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { AnchorNav } from "@/components/layout/AnchorNav";
import { Reveal } from "@/components/motion/Reveal";
import { PartImage } from "@/components/ui/PartImage";
import { SISTEMI, type Sistem } from "@/content/asortiman";
import { asortimanStrana } from "@/content/stranice";
import { susedniSistemi } from "@/lib/asortiman";
import { cn } from "@/lib/cn";
import { sistemRuta } from "@/lib/routes";

/** Link na susedni sistem: strelica, mali render, „Prethodni / Sledeći sistem“ i naziv. Strelica je
 * uvek na strani smera (← levo, → desno). */
function SusedniLink({ sistem, smer }: { sistem: Sistem; smer: "prethodni" | "sledeci" }) {
  const t = asortimanStrana.susedni;
  const sledeci = smer === "sledeci";
  const Strelica = sledeci ? ArrowRightIcon : ArrowLeftIcon;
  return (
    <Link
      href={sistemRuta(sistem.slug)}
      className={cn(
        "flex h-full items-center gap-4 panel card-link p-3 pr-5",
        sledeci && "flex-row-reverse pr-3 pl-5 md:col-start-2 md:text-right",
      )}
    >
      <Strelica size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
      <div className="size-16 shrink-0 overflow-hidden rounded-sm tile-render">
        <div data-card-media="">
          <PartImage slug={sistem.slika} alt="" sizes="64px" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="type-caption text-ink-3">{sledeci ? t.sledeci : t.prethodni}</p>
        <p className="mt-0.5 type-h3 text-ink-1">{sistem.naziv}</p>
      </div>
    </Link>
  );
}

/**
 * Ostali sistemi na dnu strane sistema (plan K01 §4.3, tačka 8): prethodni i sledeći po
 * redosledu, pa čipovi svih sistema (trenutni je označen).
 */
export function SystemNav({ sistem }: { sistem: Sistem }) {
  const t = asortimanStrana.susedni;
  const { prethodni, sledeci } = susedniSistemi(sistem.slug);
  const svi = [...SISTEMI].sort((a, b) => a.redosled - b.redosled);
  return (
    <section aria-labelledby="ostali-sistemi" className="px-page pb-[var(--space-section)]">
      <Reveal>
        <h2 id="ostali-sistemi" className="type-h2 text-ink-1">
          {t.naslov}
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
          {prethodni ? <SusedniLink sistem={prethodni} smer="prethodni" /> : null}
          {sledeci ? <SusedniLink sistem={sledeci} smer="sledeci" /> : null}
        </div>
        <AnchorNav
          oznaka={t.svi}
          className="mt-6"
          stavke={svi.map((s) => ({ href: sistemRuta(s.slug), naziv: s.naziv, trenutna: s.slug === sistem.slug }))}
        />
      </Reveal>
    </section>
  );
}
