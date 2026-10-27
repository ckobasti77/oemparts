import { notFound } from "next/navigation";

import { CtaBand } from "@/components/layout/CtaBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { CTA } from "@/content/navigacija";
import { SISTEMI } from "@/content/asortiman";
import { asortimanStrana } from "@/content/stranice";
import { grupeSistema, sistemPoSlugu } from "@/lib/asortiman";
import { RUTE, sistemRuta, upitZaDeo } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SISTEMI.map((s) => ({ sistem: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/asortiman/[sistem]">) {
  const { sistem } = await params;
  const s = sistemPoSlugu(sistem);
  if (!s) return {};
  return pageMetadata({
    naslov: `${s.naziv}${asortimanStrana.sistemNaslovSufiks}`,
    opis: s.metaOpis,
    putanja: sistemRuta(s.slug),
  });
}

/** Strana sistema (osnova iz K02; K04 dodaje uvod, rendere, savete i susedne sisteme). */
export default async function SistemPage({ params }: PageProps<"/asortiman/[sistem]">) {
  const { sistem } = await params;
  const s = sistemPoSlugu(sistem);
  if (!s) notFound();
  const grupe = grupeSistema(s.slug);
  return (
    <>
      <PageHeader
        naslov={s.naziv}
        uvod={s.uvod.join(" ")}
        putanja={[
          { naziv: asortimanStrana.naslov, putanja: RUTE.asortiman },
          { naziv: s.naziv, putanja: sistemRuta(s.slug) },
        ]}
      />
      <div className="flex flex-col gap-4 px-page">
        {grupe.map((g) => (
          <Reveal as="article" key={g.slug} id={g.slug} className="panel p-6">
            <h2 className="type-h2 text-ink-1">{g.naziv}</h2>
            <p className="mt-2 text-ink-2">{g.kratko}</p>
            <dl className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <dt className="type-body-s font-semibold text-ink-1">{asortimanStrana.staRadi}</dt>
                <dd className="mt-1 type-body-s text-ink-2">{g.staRadi}</dd>
              </div>
              <div>
                <dt className="type-body-s font-semibold text-ink-1">{asortimanStrana.kadaSeMenja}</dt>
                <dd className="mt-1 type-body-s text-ink-2">{g.kadaSeMenja}</dd>
              </div>
              <div>
                <dt className="type-body-s font-semibold text-ink-1">{asortimanStrana.savet}</dt>
                <dd className="mt-1 type-body-s text-ink-2">{g.savet}</dd>
              </div>
            </dl>
            <TextLink href={upitZaDeo(g.slug)} arrow className="mt-3">
              {CTA.pitajteZaDeo}
              <span className="sr-only">: {g.naziv}</span>
            </TextLink>
          </Reveal>
        ))}
      </div>
      <CtaBand />
    </>
  );
}
