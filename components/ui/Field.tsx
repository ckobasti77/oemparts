import type { ComponentProps, ReactNode } from "react";
import { CaretDownIcon, WarningCircleIcon } from "@/components/ui/ikone";
import { UPIT_POLJA } from "@/content/upit";
import { cn } from "@/lib/cn";

/**
 * Polja forme (plan K01 §3.7): labela iznad, pomoć i greška ispod, povezane sa poljem preko
 * `aria-describedby`; greška postavlja `aria-invalid`. Visina 48, radijus 10, tekst 16 px.
 */

export type PoljeVeze = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  counter,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  /** Npr. „12 / 17“, desno ispod polja. */
  counter?: ReactNode;
  children: (veze: PoljeVeze) => ReactNode;
  className?: string;
}) {
  const pomocId = hint ? `${id}-pomoc` : undefined;
  const greskaId = error ? `${id}-greska` : undefined;
  const describedBy = [greskaId, pomocId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-body-s font-semibold text-ink-1">
        {label}
        {optional ? <span className="font-normal text-ink-3"> {UPIT_POLJA.neobavezno}</span> : null}
      </label>
      {children({ id, "aria-describedby": describedBy, ...(error ? { "aria-invalid": true as const } : {}) })}
      {error ? (
        <p id={greskaId} className="flex items-start gap-1.5 type-caption text-danger">
          <WarningCircleIcon size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
      {hint || counter ? (
        <div className="flex items-start justify-between gap-4">
          {hint ? (
            <p id={pomocId} className="type-caption font-normal text-ink-3">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {counter ? <span className="shrink-0 type-caption tabular-nums text-ink-3">{counter}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

const poljeOsnova =
  "w-full rounded-sm border border-control bg-surface-2 px-4 text-base text-ink-1 transition-control " +
  "hover:border-ink-3 focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent " +
  "aria-invalid:border-danger disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-1 disabled:text-ink-4";

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(poljeOsnova, "min-h-12", className)} {...rest} />;
}

export function Textarea({ className, rows = 4, ...rest }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(poljeOsnova, "min-h-30 resize-y py-3", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(poljeOsnova, "min-h-12 cursor-pointer appearance-none pr-11", className)} {...rest}>
        {children}
      </select>
      <CaretDownIcon
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-2"
      />
    </div>
  );
}

/** Grupa polja sa legendom (type-h3). */
export function Fieldset({ legend, children, className }: { legend: ReactNode; children: ReactNode; className?: string }) {
  return (
    <fieldset className={cn("flex min-w-0 flex-col gap-4", className)}>
      <legend className="mb-4 type-h3 text-ink-1">{legend}</legend>
      {children}
    </fieldset>
  );
}
