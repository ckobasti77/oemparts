import { PageHeader } from "@/components/layout/PageHeader";
import { Disclosure } from "@/components/ui/Disclosure";
import { KANALI } from "@/content/navigacija";
import { PRAVNO_OZNAKE, type PravnaStrana } from "@/content/pravno";
import { site } from "@/content/site";
import { kontaktStrana } from "@/content/stranice";
import { kanal } from "@/lib/links";

/** Sidra ispod fiksnog header-a. */
const SIDRO = "scroll-mt-[calc(var(--header-h)+1rem)]";

/** Naziv, sedište, PIB, matični broj, mejl i telefon, samo popunjeno (P4); jedini izvor je content/site.ts. */
function KontaktBlok() {
  const f = kontaktStrana.firmaPolja;
  const mejl = kanal("email");
  const tel = kanal("telefon");
  const redovi: { oznaka: string; vrednost: string; href?: string }[] = [
    { oznaka: f.naziv, vrednost: site.firma.naziv.trim() || site.brend.lockup },
    { oznaka: f.sediste, vrednost: site.firma.sediste.trim() },
    { oznaka: f.pib, vrednost: site.firma.pib.trim() },
    { oznaka: f.mb, vrednost: site.firma.mb.trim() },
    { oznaka: KANALI.email, vrednost: mejl?.vrednost ?? "", href: mejl?.href },
    { oznaka: KANALI.telefon, vrednost: tel?.vrednost ?? "", href: tel?.href },
  ].filter((r) => r.vrednost);
  return (
    <dl className="mt-6 divide-y divide-line panel px-5">
      {redovi.map((r) => (
        <div key={r.oznaka} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
          <dt className="text-ink-3">{r.oznaka}</dt>
          <dd className="text-ink-1 [overflow-wrap:anywhere]">
            {r.href ? (
              <a href={r.href} className="link-underline">
                {r.vrednost}
              </a>
            ) : (
              r.vrednost
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Pravna strana (plan K01 §4.10): H1, datum izmene i tekst do 45rem sa H2 sekcijama. Sadržaj
 * strane je lista sidra: od 1280 px lepljiva desno, ispod toga Disclosure ispod datuma. Bez reveal-a.
 */
export function LegalPage({ strana, putanja }: { strana: PravnaStrana; putanja: string }) {
  const sadrzaj = (
    <ol className="flex flex-col">
      {strana.sekcije.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="inline-flex min-h-11 min-w-11 items-center link-underline text-ink-2">
            {s.naslov}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <PageHeader naslov={strana.naslov} uvod={strana.uvod} putanja={[{ naziv: strana.naslov, putanja }]} />
      <div className="grid px-page pb-[var(--space-section)] xl:grid-cols-12 xl:gap-gutter">
        <div className="max-w-[var(--container-reading)] xl:col-span-8">
          <p className="type-body-s text-ink-3">
            {PRAVNO_OZNAKE.izmenjeno} {strana.izmenjeno}
          </p>
          <div className="mt-6 border-t border-line xl:hidden">
            <Disclosure summary={PRAVNO_OZNAKE.sadrzaj} headingLevel={2}>
              {sadrzaj}
            </Disclosure>
          </div>
          {strana.sekcije.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-naslov`} className={`mt-10 ${SIDRO}`}>
              <h2 id={`${s.id}-naslov`} className="type-h2 text-ink-1">
                {s.naslov}
              </h2>
              {s.pasusi.map((p) => (
                <p key={p} className="mt-4 text-ink-2">
                  {p}
                </p>
              ))}
              {s.blok === "kontakt" ? <KontaktBlok /> : null}
            </section>
          ))}
        </div>
        <nav
          aria-label={PRAVNO_OZNAKE.sadrzaj}
          className="hidden self-start xl:sticky xl:top-[calc(var(--header-h)+1.5rem)] xl:col-span-3 xl:col-start-10 xl:block"
        >
          <p className="mb-2 type-h3 text-ink-1">{PRAVNO_OZNAKE.sadrzaj}</p>
          {sadrzaj}
        </nav>
      </div>
    </>
  );
}
