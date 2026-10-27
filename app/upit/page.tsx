import {
  CaretDownIcon,
  ChatCircleTextIcon,
  CheckIcon,
  CopyIcon,
  EnvelopeIcon,
  QuestionIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

import { ContactChannels } from "@/components/layout/ContactChannels";
import { PageHeader } from "@/components/layout/PageHeader";
import { UpitForma, type IkoneUpita } from "@/components/sections/upit/UpitForma";
import { VinPomoc } from "@/components/sections/upit/VinPomoc";
import { Note } from "@/components/ui/Note";
import { GRUPE } from "@/content/asortiman";
import { pocetna } from "@/content/pocetna";
import { UPIT_SLANJE, upitStrana, VIN_POMOC } from "@/content/upit";
import { popuniKanale } from "@/lib/links";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  ...upitStrana.meta,
  opis: popuniKanale(upitStrana.meta.opis, upitStrana.kanali, "instr"),
  putanja: RUTE.upit,
});

/** slug → naziv grupe (i podgrupe), za `/upit/?deo=<grupa>` iz članka grupe. */
const DELOVI: Record<string, string> = Object.fromEntries(
  GRUPE.flatMap((g) => [[g.slug, g.naziv] as const, ...(g.podgrupe ?? []).map((p) => [p.slug, p.naziv] as const)]),
);

/** Ikone forme: crta ih server, pa ne ulaze u klijentski paket (ODLUKA K05). */
const IKONE: IkoneUpita = {
  viber: <ChatCircleTextIcon size={20} />,
  whatsapp: <WhatsappLogoIcon size={20} />,
  mejl: <EnvelopeIcon size={20} />,
  kopiraj: <CopyIcon size={20} />,
  kopirano: <CheckIcon size={20} />,
  pomoc: <QuestionIcon size={18} />,
  strelica: <CaretDownIcon size={14} />,
  upozorenje: <WarningCircleIcon size={20} />,
};

/**
 * Upit po broju šasije (P2, plan K01 §4.5): forma sastavlja poruku u pregledaču, a posetilac je
 * šalje Viberom, WhatsApp-om ili mejlom. Od 1024 px desno je lepljiva kolona sa pomoći za broj
 * šasije i objašnjenjem šta se dešava; na telefonu je pomoć ispod polja, a ostatak posle forme.
 * Bez reveal-a (forma se ne skriva radi efekta).
 */
export default function UpitPage() {
  return (
    <>
      <PageHeader
        naslov={upitStrana.naslov}
        uvod={popuniKanale(upitStrana.uvod, upitStrana.kanali, "gen")}
        putanja={[{ naziv: upitStrana.naslov, putanja: RUTE.upit }]}
      />
      <div className="grid gap-block px-page pb-[var(--space-section)] lg:grid-cols-12 lg:gap-gutter">
        <div className="min-w-0 lg:col-span-7">
          <noscript>
            <div className="mb-6 flex flex-col gap-4 rounded-md border border-line-strong bg-surface-1 p-5">
              <p className="text-ink-1">
                {popuniKanale(UPIT_SLANJE.bezJs, pocetna.kanaliZasto, "instr")}
              </p>
              <ContactChannels bezKp />
            </div>
          </noscript>
          <UpitForma delovi={DELOVI} pomocVin={<VinPomoc />} ikone={IKONE} />
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <section aria-labelledby="vin-pomoc-naslov" className="hidden panel p-6 lg:block">
              <h2 id="vin-pomoc-naslov" className="type-h3 text-ink-1">
                {VIN_POMOC.naslov}
              </h2>
              <VinPomoc className="mt-4" />
            </section>
            <section aria-labelledby="posle-naslov" className="lg:px-6">
              <h2 id="posle-naslov" className="type-h3 text-ink-1">
                {VIN_POMOC.posleNaslov}
              </h2>
              <ol className="mt-4 flex flex-col gap-3">
                {VIN_POMOC.posle.map((korak, i) => (
                  <li key={korak} className="flex items-start gap-3 text-ink-2">
                    <span
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center rounded-xs border border-line-strong type-body-s font-semibold text-ink-2 tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{korak}</span>
                  </li>
                ))}
              </ol>
              <Note className="mt-6">
                <p className="font-semibold text-ink-1">{upitStrana.privatnostNaslov}</p>
                <p className="mt-1">{upitStrana.privatnost}</p>
              </Note>
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}
