import { LegalPage } from "@/components/layout/LegalPage";
import { POLITIKA_PRIVATNOSTI } from "@/content/pravno";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...POLITIKA_PRIVATNOSTI.meta, putanja: RUTE.privatnost });

export default function PolitikaPrivatnostiPage() {
  return <LegalPage strana={POLITIKA_PRIVATNOSTI} putanja={RUTE.privatnost} />;
}
