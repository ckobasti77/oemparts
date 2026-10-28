import { ClockIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";

import { FOOTER } from "@/content/navigacija";
import { cn } from "@/lib/cn";

/**
 * Radno vreme i adresa (footer i kontakt na početnoj), samo ono što postoji (P4). Oznaka je `dt`
 * za čitače ekrana, a ikona je u `dd`: `div` u `dl` sme da sadrži samo `dt` i `dd` (K08; ranije je
 * ikona bila pored, pa bi axe `dlitem` pao čim se upiše radno vreme ili adresa).
 */
export function RadnoVremeAdresa({
  radnoVreme,
  adresa,
  className,
}: {
  radnoVreme: string;
  adresa: string;
  className?: string;
}) {
  if (!radnoVreme && !adresa) return null;
  return (
    <dl className={cn("type-body-s text-ink-2", className)}>
      {radnoVreme ? (
        <div>
          <dt className="sr-only">{FOOTER.radnoVreme}</dt>
          <dd className="flex gap-3">
            <ClockIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
            <span>{radnoVreme}</span>
          </dd>
        </div>
      ) : null}
      {adresa ? (
        <div>
          <dt className="sr-only">{FOOTER.adresa}</dt>
          <dd className="flex gap-3">
            <MapPinIcon size={20} aria-hidden="true" className="shrink-0 text-ink-3" />
            <span>{adresa}</span>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
