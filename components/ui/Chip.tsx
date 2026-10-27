import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Čip-link: 44 px, površina 2, radijus 6 (plan K01 §3.7). Za brzu navigaciju i oblake linkova. */
export function ChipLink({
  href,
  children,
  current = false,
  className,
}: {
  href: string;
  children: ReactNode;
  current?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-xs bg-surface-2 px-3 type-body-s text-ink-2 transition-control",
        "hover:bg-surface-3 hover:text-ink-1 aria-[current=page]:bg-accent-subtle aria-[current=page]:text-ink-1",
        "aria-[current=page]:shadow-[inset_0_-2px_0_var(--color-accent)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Oznaka (nije link): 32 px, radijus 6. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-xs bg-surface-2 px-2.5 type-caption text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
