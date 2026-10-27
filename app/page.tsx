import { ButtonLink } from "@/components/ui/Button";
import { ContactChannels } from "@/components/layout/ContactChannels";
import { JsonLd } from "@/components/layout/JsonLd";
import { Section } from "@/components/layout/Section";
import { CTA } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { SISTEMI } from "@/content/asortiman";
import { grupeSistema, brojGrupa } from "@/lib/asortiman";
import { prodavnicaLd, websiteLd } from "@/lib/jsonld";
import { kanal, kpHref } from "@/lib/links";
import { RUTE, sistemRuta } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({ ...pocetna.meta, putanja: RUTE.pocetna });

/** Početna (osnova iz K02; K03 pravi hero sa renderom, sve sekcije i pokret). */
export default function PocetnaPage() {
  const kp = kpHref();
  const tel = kanal("telefon");
  return (
    <>
      <JsonLd data={[websiteLd(), prodavnicaLd()]} />
      <header className="px-page pt-12 pb-[var(--space-section)] lg:pt-20">
        <h1 className="max-w-[16ch] type-display-xl text-ink-1">{pocetna.hero.naslov}</h1>
        <p className="mt-6 max-w-[38ch] type-lead">{pocetna.hero.uvod}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {kp ? (
            <ButtonLink href={kp} size="lg">
              {CTA.kp}
            </ButtonLink>
          ) : null}
          <ButtonLink href={RUTE.upit} variant="secondary" size="lg">
            {CTA.upitSasija}
          </ButtonLink>
        </div>
        {tel ? (
          <p className="mt-4 type-body-s text-ink-2">
            {pocetna.hero.iliPozovite}{" "}
            <a href={tel.href} className="link-underline text-ink-1">
              {tel.vrednost}
            </a>
          </p>
        ) : null}
      </header>
      <Section id="sistemi" naslov={pocetna.sistemi.naslov} uvod={pocetna.sistemi.uvod} naslovStil="display" ton="raised">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {SISTEMI.map((s) => (
            <li key={s.slug}>
              <Link href={sistemRuta(s.slug)} className="flex min-h-11 flex-col gap-1 panel card-link p-4">
                <span className="type-h3 text-ink-1">{s.naziv}</span>
                <span className="type-caption text-ink-3">{brojGrupa(grupeSistema(s.slug).length)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="kontakt" naslov={pocetna.kontakt.naslov} uvod={pocetna.kontakt.tekst} naslovStil="display">
        <ContactChannels bezKp className="max-w-3xl" />
      </Section>
    </>
  );
}
