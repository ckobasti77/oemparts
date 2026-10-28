import { ChannelList } from "@/components/layout/ChannelList";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { oNamaStrana } from "@/content/stranice";
import { popuniKanale } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...oNamaStrana.meta, putanja: RUTE.oNama });

/**
 * O nama (plan K01 §4.7): šta radimo, razlika između originalnih, OEM i zamenskih delova i kako
 * radimo. Bez godina, brojki i recenzija (P5). Od 1024 px desno je lepljiv panel sa kanalima.
 */
export default function ONamaPage() {
  const t = oNamaStrana;
  return (
    <>
      <PageHeader naslov={t.naslov} uvod={t.uvod} putanja={[{ naziv: t.naslov, putanja: RUTE.oNama }]} />

      <div className="grid gap-block px-page pb-[var(--space-section)] lg:grid-cols-12 lg:gap-gutter">
        <div className="flex max-w-[var(--container-reading)] flex-col gap-14 lg:col-span-7">
          <Reveal as="section" variant="fade" aria-labelledby="sta-naslov">
            <h2 id="sta-naslov" className="type-h2 text-ink-1">
              {t.sta.naslov}
            </h2>
            {t.sta.pasusi.map((p) => (
              <p key={p} className="mt-4 text-ink-2">
                {popuniKanale(p, t.sta.kanali, "instr")}
              </p>
            ))}
          </Reveal>

          <Reveal as="section" variant="fade" aria-labelledby="pojmovi-naslov">
            <h2 id="pojmovi-naslov" className="type-h2 text-ink-1">
              {t.pojmovi.naslov}
            </h2>
            <p className="mt-4 text-ink-2">{t.pojmovi.uvod}</p>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {t.pojmovi.stavke.map((s) => (
                <div key={s.izraz} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-semibold text-ink-1">{s.izraz}</dt>
                  <dd className="text-ink-2">{s.tekst}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-ink-2">{t.pojmovi.zasto}</p>
            <p className="mt-4 font-semibold text-ink-1">{t.pojmovi.zakljucak}</p>
          </Reveal>

          <section aria-labelledby="kako-naslov">
            <Reveal>
              <h2 id="kako-naslov" className="type-h2 text-ink-1">
                {t.kako.naslov}
              </h2>
            </Reveal>
            <RevealGroup as="ul" className="mt-6 grid gap-4">
              {t.kako.stavke.map((s) => (
                <RevealItem as="li" key={s.naslov} className="panel p-5">
                  <h3 className="type-h3 text-ink-1">{s.naslov}</h3>
                  <p className="mt-2 text-ink-2">{s.tekst}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        </div>

        <aside
          aria-labelledby="panel-naslov"
          className="hidden self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-4 lg:col-start-9 lg:block"
        >
          <h2 id="panel-naslov" className="mb-4 type-h3 text-ink-1">
            {t.panelNaslov}
          </h2>
          <ChannelList uspravno />
        </aside>
      </div>

      <CtaBand naslov={t.cta.naslov} tekst={t.cta.tekst} />
    </>
  );
}
