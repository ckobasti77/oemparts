import { serijalizuj, type JsonLd as JsonLdData } from "@/lib/jsonld";

/** JSON-LD u server HTML-u (vodič json-ld.md: native <script>, `<` zamenjen). */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serijalizuj(data) }} />;
}
