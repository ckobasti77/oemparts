import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Disclosure } from "@/components/ui/Disclosure";
import { FAQ_KUPOVINA, KORACI_KUPOVINE, kupovinaStrana } from "@/content/kupovina";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...kupovinaStrana.meta, putanja: RUTE.kakoKupiti });

/** Kako kupiti: koraci i česta pitanja (osnova iz K02; K06 dodaje FAQPage i dovršava). */
export default function KakoKupitiPage() {
  return (
    <>
      <PageHeader
        naslov={kupovinaStrana.naslov}
        uvod={kupovinaStrana.uvod}
        putanja={[{ naziv: kupovinaStrana.naslov, putanja: RUTE.kakoKupiti }]}
      />
      <RevealGroup as="ol" className="grid gap-4 px-page md:grid-cols-3">
        {KORACI_KUPOVINE.map((k, i) => (
          <RevealItem as="li" key={k.naslov} className="panel p-6">
            <span aria-hidden="true" className="type-display-m text-ink-3">
              {i + 1}
            </span>
            <h2 className="mt-3 type-h3 text-ink-1">{k.naslov}</h2>
            <p className="mt-2 text-ink-2">{k.tekst}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <Section id="pitanja" naslov={kupovinaStrana.pitanjaNaslov}>
        <div className="max-w-[var(--container-reading)] border-t border-line">
          {FAQ_KUPOVINA.map((p) => (
            <Disclosure key={p.pitanje} summary={p.pitanje}>
              <p>{p.odgovor}</p>
            </Disclosure>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
