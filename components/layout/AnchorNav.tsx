import { ChipLink } from "@/components/ui/Chip";

/**
 * Brza navigacija čipovima (sidra na strani ili susedne strane). Ispod 768 px jedan red sa
 * vodoravnim skrolom do ivica ekrana; poslednjih 3,5 rem se gasi, kao znak da red ide dalje (K08:
 * sa užim prelazom čip koji se završi tačno na margini izgledao je kao kraj reda). Od 768 px se prelama. `py-1` ostavlja mesta fokus prstenu, koji bi inače odsekao kontejner sa skrolom.
 */
export function AnchorNav({
  oznaka,
  stavke,
  className,
}: {
  /** `aria-label` navigacije. */
  oznaka: string;
  stavke: readonly { href: string; naziv: string; trenutna?: boolean }[];
  className?: string;
}) {
  return (
    <nav aria-label={oznaka} className={className}>
      <ul className="scroll-row flex gap-2 py-1 max-md:-mx-[var(--margin)] max-md:px-[var(--margin)] max-md:[mask-image:linear-gradient(to_right,black_calc(100%-3.5rem),transparent)] md:flex-wrap">
        {stavke.map((s) => (
          <li key={s.href} className="shrink-0">
            <ChipLink href={s.href} current={s.trenutna}>
              {s.naziv}
            </ChipLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
