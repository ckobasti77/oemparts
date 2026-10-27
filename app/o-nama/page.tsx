import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { oNamaStrana } from "@/content/stranice";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...oNamaStrana.meta, putanja: RUTE.oNama });

/** O nama (osnova iz K02; K06 dovršava, bez godina i brojki). */
export default function ONamaPage() {
  return (
    <>
      <PageHeader
        naslov={oNamaStrana.naslov}
        uvod={oNamaStrana.uvod}
        putanja={[{ naziv: oNamaStrana.naslov, putanja: RUTE.oNama }]}
      />
      <CtaBand />
    </>
  );
}
