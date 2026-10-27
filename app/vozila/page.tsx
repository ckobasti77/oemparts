import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tag } from "@/components/ui/Chip";
import { MARKE, vozilaStrana } from "@/content/vozila";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...vozilaStrana.meta, putanja: RUTE.vozila });

/** Marke i modeli, samo tekstom (P6). Osnova iz K02; K04 dovršava. */
export default function VozilaPage() {
  return (
    <>
      <PageHeader
        naslov={vozilaStrana.naslov}
        uvod={vozilaStrana.uvod}
        putanja={[{ naziv: vozilaStrana.naslov, putanja: RUTE.vozila }]}
      />
      <RevealGroup as="ul" className="grid gap-4 px-page md:grid-cols-2">
        {MARKE.map((m) => (
          <RevealItem as="li" key={m.slug} id={m.slug} className="panel p-6">
            <h2 className="type-display-m text-ink-1">{m.naziv}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {m.modeli.map((model) => (
                <li key={model}>
                  <Tag>{model}</Tag>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-6 max-w-[90ch] px-page type-body-s text-ink-3">{vozilaStrana.napomenaZigovi}</p>
      <CtaBand />
    </>
  );
}
