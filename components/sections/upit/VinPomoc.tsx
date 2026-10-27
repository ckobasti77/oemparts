import { VIN_POMOC } from "@/content/upit";
import { cn } from "@/lib/cn";

/**
 * „Gde je broj šasije?“: dva jednostavna crteža (saobraćajna dozvola sa poljem E i ugao
 * vetrobrana sa strane vozača) sa oznakama ispod i tekst koji nosi informaciju. Crteži su
 * dekorativni i bez narandžaste (signal je samo za akcije); mesto broja je istaknuto svetlom
 * ivicom. Server komponenta: SVG ne ide u klijentski paket (forma ga dobija kao children).
 */
export function VinPomoc({ className }: { className?: string }) {
  const t = VIN_POMOC.crtez;
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div aria-hidden="true" className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <svg viewBox="0 0 160 104" className="h-auto w-full rounded-xs bg-surface-2">
            <rect x="12" y="12" width="136" height="80" rx="6" className="fill-surface-1 stroke-line-strong" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="24" x2="82" y1={30 + i * 14} y2={30 + i * 14} className="stroke-line-strong" />
            ))}
            <rect x="92" y="40" width="44" height="26" rx="5" strokeWidth="1.5" className="fill-surface-3 stroke-ink-1" />
            <text x="114" y="58" textAnchor="middle" fontSize={15} className="fill-ink-1 font-semibold">
              {t.polje}
            </text>
          </svg>
          <span className="type-caption font-normal text-ink-3">{t.dozvola}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <svg viewBox="0 0 160 104" className="h-auto w-full rounded-xs bg-surface-2">
            <path d="M14 92 L46 16 H148" fill="none" className="stroke-line-strong" />
            <path d="M26 86 L52 26 H146 V86 Z" className="fill-surface-1 stroke-line" />
            <rect x="32" y="64" width="58" height="16" rx="4" strokeWidth="1.5" className="fill-surface-3 stroke-ink-1" />
            <line x1="40" x2="82" y1="72" y2="72" strokeDasharray="3 2" className="stroke-ink-2" />
          </svg>
          <span className="type-caption font-normal text-ink-3">{t.vetrobran}</span>
        </div>
      </div>
      <figcaption>
        <ul className="flex flex-col gap-2 type-body-s text-ink-2">
          {VIN_POMOC.stavke.map((s) => (
            <li key={s} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-3" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
