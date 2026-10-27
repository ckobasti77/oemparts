import { LegalPage } from "@/components/layout/LegalPage";
import { USLOVI_KORISCENJA } from "@/content/pravno";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...USLOVI_KORISCENJA.meta, putanja: RUTE.uslovi });

export default function UsloviKoriscenjaPage() {
  return <LegalPage strana={USLOVI_KORISCENJA} putanja={RUTE.uslovi} />;
}
