import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

import { ARIA } from "@/content/navigacija";
import { cn } from "@/lib/cn";

/**
 * Tekst link: ink-1, podvlaka 1 px line-strong, na hover narandžasta (plan K01 §3.7).
 * `arrow` dodaje strelicu „dalje“; spoljni linkovi dobijaju ↗ i napomenu za čitače ekrana.
 */
export function TextLink({
  href,
  children,
  arrow = false,
  external,
  className,
  ...rest
}: Omit<ComponentProps<"a">, "href"> & {
  href: string;
  children: ReactNode;
  arrow?: boolean;
  external?: boolean;
}) {
  const spolja = external ?? /^https?:\/\//.test(href);
  const klase = cn(
    "inline-flex min-h-11 items-center gap-1.5 text-ink-1 link-underline",
    className,
  );
  const sadrzaj = (
    <>
      <span>{children}</span>
      {spolja ? (
        <>
          <ArrowUpRightIcon size={16} aria-hidden="true" className="shrink-0" />
          <span className="sr-only"> {ARIA.noviProzor}</span>
        </>
      ) : arrow ? (
        <ArrowRightIcon size={16} aria-hidden="true" className="shrink-0" />
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
    <a href={href} className={klase} {...(spolja ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {sadrzaj}
    </a>
  );
}
