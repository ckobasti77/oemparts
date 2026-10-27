import { ARIA } from "@/content/navigacija";

export const MAIN_ID = "sadrzaj";

/** Prvi element za fokus; vidljiv tek na fokus. */
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_ID}`}
      className="fixed top-3 left-3 z-[var(--z-skip)] inline-flex min-h-12 -translate-y-[200%] items-center rounded-sm bg-accent px-4 type-button text-on-accent focus-ring-inverse focus:translate-y-0"
    >
      {ARIA.preskoci}
    </a>
  );
}
