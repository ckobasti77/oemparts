import { StilPregled } from "@/components/sections/stil/StilPregled";
import { stilStrana } from "@/content/stranice";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...stilStrana.meta, putanja: RUTE.stil, noindex: true });

/**
 * Dev-only pregled komponenti (plan §3). U produkcionom izvozu strana je prazna, ima noindex
 * i nije u sitemap-u; `check:site` to proverava.
 */
export default function StilPage() {
  if (process.env.NODE_ENV === "production") return null;
  return <StilPregled />;
}
