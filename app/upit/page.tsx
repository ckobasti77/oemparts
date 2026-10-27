import { ContactChannels } from "@/components/layout/ContactChannels";
import { PageHeader } from "@/components/layout/PageHeader";
import { Note } from "@/components/ui/Note";
import { upitStrana, VIN_POMOC } from "@/content/upit";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...upitStrana.meta, putanja: RUTE.upit });

/**
 * Upit po broju šasije (osnova iz K02). K05 pravi formu koja sklapa poruku i otvara Viber,
 * WhatsApp ili mejl (P2); do tada su ovde kanali za direktan kontakt.
 */
export default function UpitPage() {
  return (
    <>
      <PageHeader
        naslov={upitStrana.naslov}
        uvod={upitStrana.uvod}
        putanja={[{ naziv: upitStrana.naslov, putanja: RUTE.upit }]}
      />
      <div className="grid gap-8 px-page pb-[var(--space-section)] lg:grid-cols-[1fr_22rem]">
        <ContactChannels className="max-w-3xl content-start" />
        <aside className="flex flex-col gap-4">
          <h2 className="type-h3 text-ink-1">{VIN_POMOC.naslov}</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-2">
            {VIN_POMOC.stavke.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <Note>{upitStrana.privatnost}</Note>
        </aside>
      </div>
    </>
  );
}
