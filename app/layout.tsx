import type { Metadata, Viewport } from "next";

import "./globals.css";
import { fontVariables } from "./fonts";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.jezik} className={fontVariables}>
      <body>
        <SkipLink />
        <Header />
        <main id={MAIN_ID} tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <RevealEngine />
      </body>
    </html>
  );
}
