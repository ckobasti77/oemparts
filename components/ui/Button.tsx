import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { ARIA } from "@/content/navigacija";
import { cn } from "@/lib/cn";

/**
 * Dugme (plan K01 §3.6). Jedno primarno (narandžasto) po oblasti; sekundarno je jedina
 * alternativa pored njega; tiho je za ponovljene akcije (kanali, kartice). Radijus 10,
 * visina 48 (md) / 56 (lg). Hover menja boju za 80 ms, pritisak spušta 1 px.
 */
export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "md" | "lg";

const osnova =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-sm type-button " +
  "transition-control press cursor-pointer text-center " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

const varijante: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[var(--shadow-button)] hover:bg-accent-hover active:bg-accent-active " +
    "active:shadow-none focus-ring-inverse disabled:bg-surface-2 disabled:text-ink-4 disabled:shadow-none",
  secondary:
    "border border-control text-ink-1 hover:border-ink-3 hover:bg-surface-2 active:bg-surface-3 " +
    "disabled:border-line disabled:bg-transparent disabled:text-ink-4",
  quiet:
    "border border-line-strong bg-surface-3 text-ink-1 shadow-[var(--shadow-rest)] hover:border-ink-4 " +
    "hover:bg-surface-4 active:bg-surface-3 disabled:border-line disabled:bg-surface-1 disabled:text-ink-4",
};

const velicine: Record<ButtonSize, string> = {
  md: "min-h-12 px-4",
  lg: "min-h-14 px-5",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}): string {
  return cn(osnova, varijante[variant], velicine[size], fullWidth && "w-full", className);
}

type Zajednicko = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ikona ispred teksta (20 px). */
  icon?: ReactNode;
  fullWidth?: boolean;
};

export type ButtonProps = ComponentProps<"button"> & Zajednicko;

export function Button({ variant, size, icon, fullWidth, className, children, type, ...rest }: ButtonProps) {
  return (
    <button type={type ?? "button"} className={buttonClasses({ variant, size, fullWidth, className })} {...rest}>
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export type ButtonLinkProps = Omit<ComponentProps<"a">, "href"> &
  Zajednicko & {
    href: string;
    /** Otvara se u novom prozoru, sa strelicom i napomenom za čitače ekrana. Podrazumevano za http(s). */
    external?: boolean;
  };

/** Link koji izgleda kao dugme: interno kroz next/link, spolja i za tel:/viber:/mailto: kao <a>. */
export function ButtonLink({
  href,
  variant,
  size,
  icon,
  fullWidth,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const spolja = external ?? /^https?:\/\//.test(href);
  const klase = buttonClasses({ variant, size, fullWidth, className });
  const sadrzaj = (
    <>
      {icon ? (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {spolja ? (
        <>
          <ArrowUpRightIcon size={16} aria-hidden="true" className="shrink-0" />
          <span className="sr-only"> {ARIA.noviProzor}</span>
        </>
      ) : null}
    </>
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={klase} {...rest}>
        {sadrzaj}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={klase}
      {...(spolja ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {sadrzaj}
    </a>
  );
}
