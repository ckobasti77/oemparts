import { PageHeader } from "@/components/layout/PageHeader";
import { PRAVNO_OZNAKE, type PravnaStrana } from "@/content/pravno";

/** Pravna strana: H1, datum izmene, tekst do 45rem sa H2 sekcijama. Bez reveal-a. */
export function LegalPage({ strana, putanja }: { strana: PravnaStrana; putanja: string }) {
  return (
    <>
      <PageHeader naslov={strana.naslov} uvod={strana.uvod} putanja={[{ naziv: strana.naslov, putanja }]} />
      <div className="max-w-[calc(var(--container-reading)+2*var(--pad))] px-page pb-[var(--space-section)]">
        <p className="type-body-s text-ink-3">{PRAVNO_OZNAKE.izmenjeno} {strana.izmenjeno}</p>
        {strana.sekcije.map((s) => (
          <section key={s.naslov} className="mt-10">
            <h2 className="type-h2 text-ink-1">{s.naslov}</h2>
            {s.pasusi.map((p) => (
              <p key={p} className="mt-4 text-ink-2">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
