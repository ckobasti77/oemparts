"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Link navigacije sa `aria-current="page"` za trenutnu stranu (ili njenu podstranu). */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const trenutna = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
  return (
    <Link href={href} aria-current={trenutna ? "page" : undefined} className={cn(className)} onClick={onNavigate}>
      {children}
    </Link>
  );
}
