import { Reveal } from "@/components/motion/Reveal";
import { PartImage } from "@/components/ui/PartImage";
import { TextLink } from "@/components/ui/TextLink";
import type { Grupa } from "@/content/asortiman";
import { CTA } from "@/content/navigacija";
import { asortimanStrana } from "@/content/stranice";
import { typographer } from "@/lib/format";
import { upitZaDeo } from "@/lib/routes";

/**
 * Članak grupe na strani sistema (plan K01 §4.3): render, naziv i kratak opis, pa „Šta radi“,
 * „Kada se menja“ i „Savet“, podgrupe (samo „Filteri“) i link na upit sa tim delom.
 * - < 768 px: render 160 px levo iznad teksta;
 * - ≥ 768 px: render levo (200 / 240 / 216 px), tekst desno.
 * `id` je slug grupe: na njega vode kartice sa /asortiman/ i čipovi grupa.
 */
export function GroupArticle({ grupa }: { grupa: Grupa }) {
  const t = asortimanStrana;
  const naslovId = `${grupa.slug}-naslov`;
  const stavke = [
    [t.staRadi, grupa.staRadi],
    [t.kadaSeMenja, grupa.kadaSeMenja],
    [t.savet, grupa.savet],
  ] as const;
  return (
    <Reveal
      as="article"
      id={grupa.slug}
      aria-labelledby={naslovId}
      className="grid gap-5 panel p-5 md:grid-cols-[12.5rem_minmax(0,1fr)] md:gap-6 md:p-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[13.5rem_minmax(0,1fr)] xl:p-7"
    >
      <div className="w-40 self-start overflow-hidden rounded-md tile-render md:w-auto">
        <PartImage
          slug={grupa.slug}
          alt={`${t.prikaz}: ${grupa.naziv}`}
          sizes="(min-width: 64rem) 240px, (min-width: 48rem) 200px, 160px"
        />
      </div>
      <div className="min-w-0">
        <h2 id={naslovId} className="type-h2 text-ink-1">
          {grupa.naziv}
        </h2>
        <p className="mt-2 max-w-[60ch] text-ink-2">{typographer(grupa.kratko)}</p>
        <dl className="mt-5 grid gap-4 border-t border-line pt-5">
          {stavke.map(([oznaka, tekst]) => (
            <div key={oznaka}>
              <dt className="type-body-s font-semibold text-ink-1">{oznaka}</dt>
              <dd className="mt-1 max-w-[68ch] text-ink-2">{typographer(tekst)}</dd>
            </div>
          ))}
        </dl>
        {grupa.podgrupe?.length ? (
          <div className="mt-6">
            <h3 className="type-body-s font-semibold text-ink-1">{t.podgrupe}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {grupa.podgrupe.map((p) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-sm tile-render md:size-24">
                    <PartImage slug={p.slug} alt="" sizes="96px" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-1">{p.naziv}</p>
                    <p className="mt-0.5 type-body-s text-ink-3">{typographer(p.kratko)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <TextLink href={upitZaDeo(grupa.slug)} arrow className="mt-4">
          {CTA.pitajteZaDeo}
          <span className="sr-only">: {grupa.naziv}</span>
        </TextLink>
      </div>
    </Reveal>
  );
}
