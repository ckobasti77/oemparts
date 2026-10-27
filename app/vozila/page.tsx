import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { MARKE, vozilaStrana } from "@/content/vozila";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...vozilaStrana.meta, putanja: RUTE.vozila });

/**
 * Marke i modeli (plan K01 §4.4), samo tekstom (P6): bez logotipa, boja, godina i kodova.
 * Pet marki je jedan panel sa redovima (ime levo, modeli desno), kao tehnički list; `id` reda
 * je slug marke (sidra sa početne). Modeli su običan tekst, ne oznake: oznaka nalik čipu bi
 * izgledala kao link, a nije (ODLUKA K04). Na kraju napomena o žigovima i poziv na upit.
 */
export default function VozilaPage() {
  const t = vozilaStrana;
  return (
    <>
      <PageHeader naslov={t.naslov} uvod={t.uvod} putanja={[{ naziv: t.naslov, putanja: RUTE.vozila }]} />
      <div className="px-page">
        <Reveal as="ul" className="divide-y divide-line panel">
          {MARKE.map((m) => (
            <li
              key={m.slug}
              id={m.slug}
              className="grid gap-4 p-5 md:grid-cols-12 md:items-center md:gap-x-[var(--gutter)] md:px-8 md:py-7"
            >
              <h2 className="type-display-m text-ink-1 md:col-span-4">{m.naziv}</h2>
              <ul
                aria-label={`${t.modeli}: ${m.naziv}`}
                className="flex flex-wrap gap-x-6 gap-y-1 type-lead md:col-span-8"
              >
                {m.modeli.map((model) => (
                  <li key={model}>{model}</li>
                ))}
              </ul>
            </li>
          ))}
        </Reveal>
        <p className="mt-6 max-w-[68ch] type-body-s text-ink-3">{t.napomenaZigovi}</p>
      </div>
      <CtaBand naslov={t.cta.naslov} tekst={t.cta.tekst} />
    </>
  );
}
