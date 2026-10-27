import { ScrollCrossfade } from "@/components/motion/ScrollCrossfade";
import { ButtonLink } from "@/components/ui/Button";
import { CTA } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { typographer } from "@/lib/format";
import { kanal, kpHref } from "@/lib/links";
import { RUTE } from "@/lib/routes";

import { HeroPicture } from "./HeroPicture";

/**
 * Hero početne (plan K01 §4.1, P9). Na ≥ 1024 px render je preko cele širine, desno, sa tamnim
 * prelazom sleva zbog kontrasta teksta; ispod 1024 px stoji u okviru ispod teksta
 * (iskaz → akcija → objekat). Na skrol se sklopljen auto pretapa u rasklopljen. Nije meta reveal-a.
 */
export function Hero() {
  const t = pocetna.hero;
  const kp = kpHref();
  const tel = kanal("telefon");
  return (
    <section
      data-crossfade-scope=""
      aria-labelledby="hero-naslov"
      className="relative isolate bg-hero lg:flex lg:min-h-hero lg:items-center"
    >
      <div className="relative z-[2] px-page pt-8 pb-8 md:pt-12 md:pb-10 lg:w-full lg:py-20">
        <h1 id="hero-naslov" className="max-w-[11em] type-display-xl text-ink-1">
          {typographer(t.naslov)}
        </h1>
        <p className="mt-5 max-w-[38ch] type-lead lg:mt-6 lg:max-w-[34ch] xl:max-w-[38ch]">{t.uvod}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {kp ? (
            <ButtonLink href={kp} size="lg">
              {CTA.kp}
            </ButtonLink>
          ) : null}
          <ButtonLink href={RUTE.upit} size="lg" variant={kp ? "secondary" : "primary"}>
            {CTA.upitSasija}
          </ButtonLink>
        </div>
        {tel ? (
          <p className="mt-3 type-body-s text-ink-2">
            {t.iliPozovite}{" "}
            <a
              href={tel.href}
              className="inline-flex min-h-11 items-center link-underline font-semibold text-ink-1 tabular-nums"
            >
              {tel.vrednost}
            </a>
          </p>
        ) : null}
      </div>
      {/* 1024–1279 px: render je pomeren udesno (deo zadnjeg kraja izlazi van ekrana), da tekst i
          dugmad ne bi stajali preko prednjeg dela auta; od 1280 px stoji preko cele širine. */}
      <figure className="px-page pb-2 lg:absolute lg:inset-0 lg:z-0 lg:overflow-hidden lg:p-0">
        <ScrollCrossfade
          className="aspect-square overflow-hidden rounded-lg bg-hero md:aspect-[4/3] lg:absolute lg:inset-y-0 lg:-right-[6%] lg:left-[14%] lg:aspect-auto lg:rounded-none xl:inset-x-0"
          base={<HeroPicture stanje="assembled" alt={t.altSlike} className="max-md:object-bottom lg:object-[70%_50%]" />}
          overlay={<HeroPicture stanje="exploded" alt="" lenja className="max-md:object-bottom lg:object-[70%_50%]" />}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-linear-to-r from-hero/92 to-transparent to-55% lg:block"
        />
        <figcaption className="mt-3 type-caption text-ink-3 lg:absolute lg:right-[var(--pad)] lg:bottom-6 lg:z-[2] lg:mt-0">
          {t.natpis}
        </figcaption>
      </figure>
    </section>
  );
}
