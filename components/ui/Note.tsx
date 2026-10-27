import type { ReactNode } from "react";
import { InfoIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/cn";

/** Napomena: udubljen panel sa ikonom (plan K01 §3.7). */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-3 panel-inset p-4 type-body-s text-ink-2", className)}>
      <InfoIcon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-3" />
      <div>{children}</div>
    </div>
  );
}
