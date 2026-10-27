import type { Metadata, Viewport } from "next";

import "./globals.css";
import { fontVariables } from "./fonts";
import { BottomBar, imaDonjuTraku } from "@/components/layout/BottomBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MAIN_ID, SkipLink } from "@/components/layout/SkipLink";
import { RevealEngine } from "@/components/motion/RevealEngine";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domen),
  title: site.brend.lockup,
  description: site.opis,
  applicationName: site.brend.ime,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: site.temaBoja,
  colorScheme: "dark",
};

/**
 * Ljuska svih strana: skip link, header (sa menijem), sadržaj, footer i donja traka akcija.
 * `data-bottom-bar` na `<html>` rezerviše prostor trake (< 1024 px) pre prvog iscrtavanja, bez
 * `:has()`; postavlja se samo kad traka ima bar jedan kanal. Sentinel na vrhu dokumenta
 * pokreće sažimanje header-a (HeaderState).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  const traka = imaDonjuTraku();
  return (
    <html lang={site.jezik} className={fontVariables} {...(traka ? { "data-bottom-bar": "" } : {})}>
      <body>
        <div data-header-sentinel="" aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-6 w-px" />
        <SkipLink />
        <Header />
        <main id={MAIN_ID} tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        {traka ? <BottomBar /> : null}
        <RevealEngine />
      </body>
    </html>
  );
}
