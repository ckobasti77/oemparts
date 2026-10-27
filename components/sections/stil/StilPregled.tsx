/**
 * Dev-only pregled dizajn sistema (/stil/). U produkcionom izvozu se ne prikazuje.
 * Oznake na ovoj strani su interne (ne idu u izvoz), pa nisu u content/.
 */
import {
  ArrowRightIcon,
  ChatCircleTextIcon,
  CheckIcon,
  EnvelopeIcon,
  HandshakeIcon,
  IdentificationCardIcon,
  InfoIcon,
  ListIcon,
  MapPinIcon,
  PhoneIcon,
  SealCheckIcon,
  StorefrontIcon,
  WhatsappLogoIcon,
  WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

import { LogoHorizontal, LogoMark, LogoStacked } from "@/components/brand/Logo";
import { ContactChannels } from "@/components/layout/ContactChannels";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChipLink, Tag } from "@/components/ui/Chip";
import { Disclosure } from "@/components/ui/Disclosure";
import { Field, Fieldset, Input, Select, Textarea } from "@/components/ui/Field";
import { Note } from "@/components/ui/Note";
import { PartImage } from "@/components/ui/PartImage";
import { TextLink } from "@/components/ui/TextLink";
import { GRUPE } from "@/content/asortiman";
import { MARKE } from "@/content/vozila";
import { kpHref } from "@/lib/links";
import { RUTE } from "@/lib/routes";

const BOJE: [string, string, string][] = [
  ["bg", "#0d0f11", "podloga"],
  ["bg-raised", "#121518", "trake, footer"],
  ["surface-1", "#16191d", "kartice"],
  ["surface-2", "#1c2025", "polja, čipovi"],
  ["surface-3", "#23282e", "tiho dugme"],
  ["surface-4", "#2b3138", "hover tihog"],
  ["line", "#2c3238", "ivice"],
  ["line-strong", "#434a52", "jače ivice"],
  ["control", "#6e767f", "ivica polja 4,17:1"],
  ["ink-1", "#f1ece3", "tekst 16,32:1"],
  ["ink-2", "#c4beb4", "sekundarni 10,40:1"],
  ["ink-3", "#a39d94", "meta 7,14:1"],
  ["ink-4", "#6b6760", "onemogućeno"],
  ["accent", "#ff6b1a", "signal 6,74:1"],
  ["accent-hover", "#ff8a4a", "hover"],
  ["accent-active", "#e95e0e", "pritisak"],
  ["danger", "#ff6166", "greška 6,54:1"],
  ["success", "#4fd18b", "uspeh 9,90:1"],
];

const SWATCH: Record<string, string> = {
  bg: "bg-bg",
  "bg-raised": "bg-bg-raised",
  "surface-1": "bg-surface-1",
  "surface-2": "bg-surface-2",
  "surface-3": "bg-surface-3",
  "surface-4": "bg-surface-4",
  line: "bg-line",
  "line-strong": "bg-line-strong",
  control: "bg-control",
  "ink-1": "bg-ink-1",
  "ink-2": "bg-ink-2",
  "ink-3": "bg-ink-3",
  "ink-4": "bg-ink-4",
  accent: "bg-accent",
  "accent-hover": "bg-accent-hover",
  "accent-active": "bg-accent-active",
  danger: "bg-danger",
  success: "bg-success",
};

function Blok({ naslov, children }: { naslov: string; children: ReactNode }) {
  return (
    <section className="border-t border-line px-page py-12">
      <h2 className="mb-6 type-h2 text-ink-1">{naslov}</h2>
      {children}
    </section>
  );
}

export function StilPregled() {
  const kp = kpHref() ?? "https://www.kupujemprodajem.com/";
  return (
    <div>
      <header className="px-page pt-12 pb-10">
        <Breadcrumbs
          items={[
            { naziv: "Početna", putanja: RUTE.pocetna },
            { naziv: "Stil", putanja: RUTE.stil },
          ]}
        />
        <h1 className="mt-4 type-display-l text-ink-1">Stil</h1>
        <p className="mt-4 max-w-[60ch] type-lead">
          Pregled tokena i primitiva. Strana postoji samo u razvoju; u izvozu je prazna i ima noindex.
        </p>
      </header>

      <Blok naslov="Boje">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {BOJE.map(([ime, hex, uloga]) => (
            <li key={ime} className="panel overflow-hidden">
              <div className={`h-16 rounded-t-[13px] border-b border-line ${SWATCH[ime]}`} />
              <div className="p-3">
                <p className="type-body-s font-semibold text-ink-1">{ime}</p>
                <p className="type-caption text-ink-3">
                  {hex} · {uloga}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Blok>

      <Blok naslov="Tipografija">
        <div className="flex flex-col gap-6">
          <p className="type-display-xl text-ink-1">Originalni i OEM delovi</p>
          <p className="type-display-l text-ink-1">Kočnice i vešanje</p>
          <p className="type-display-m text-ink-1">Volkswagen · Škoda · SEAT</p>
          <p className="type-h2 text-ink-1">Naslov h2 — Šta vam treba?</p>
          <p className="type-h3 text-ink-1">Naslov h3 — Kada se menja</p>
          <p className="max-w-[60ch] type-lead">Uvod: veleprodaja delova za servise, auto-mehaničare i firme.</p>
          <p className="max-w-[68ch] text-ink-1">
            Tekst 16/1,6: ČĆŠŽĐ čćšžđ — Đurđevdan, ćevapčići, šećer, žaba, džep. Broj šasije ima 17 znakova.
          </p>
          <p className="type-body-s text-ink-2">Manji tekst 14 px, sekundarna boja.</p>
          <p className="type-caption text-ink-3">Meta 13 px, ink-3.</p>
          <p className="type-label text-ink-3">Oznaka kolone 12 px</p>
        </div>
      </Blok>

      <Blok naslov="Dugmad">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primarno</Button>
            <Button variant="secondary">Sekundarno</Button>
            <Button variant="quiet" icon={<PhoneIcon size={20} />}>
              Tiho sa ikonom
            </Button>
            <ButtonLink href={kp}>Spoljni link</ButtonLink>
            <Button disabled>Onemogućeno</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Primarno lg</Button>
            <Button size="lg" variant="secondary">
              Sekundarno lg
            </Button>
            <ButtonLink href={RUTE.upit} size="lg" variant="quiet" icon={<ArrowRightIcon size={20} />}>
              Interni link
            </ButtonLink>
          </div>
        </div>
      </Blok>

      <Blok naslov="Linkovi, čipovi i oznake">
        <div className="flex flex-col gap-4">
          <p className="text-ink-2">
            Tekst sa linkom <TextLink href={RUTE.asortiman}>na asortiman</TextLink> i spoljnim{" "}
            <TextLink href={kp}>KupujemProdajem</TextLink>.
          </p>
          <TextLink href={RUTE.kakoKupiti} arrow>
            Koraci i česta pitanja
          </TextLink>
          <ul className="flex flex-wrap gap-2">
            <li>
              <ChipLink href={RUTE.asortiman}>Motor i usis</ChipLink>
            </li>
            <li>
              <ChipLink href={RUTE.stil} current>
                Trenutni čip
              </ChipLink>
            </li>
            {MARKE[0].modeli.slice(0, 4).map((m) => (
              <li key={m}>
                <Tag>{m}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </Blok>

      <Blok naslov="Polja">
        <div className="grid max-w-4xl gap-10 md:grid-cols-2">
          <Fieldset legend="Vozilo">
            <Field id="stil-vin" label="Broj šasije (VIN)" hint="17 znakova, bez slova I, O i Q." counter="0 / 17">
              {(v) => <Input {...v} autoComplete="off" spellCheck={false} />}
            </Field>
            <Field id="stil-marka" label="Marka">
              {(v) => (
                <Select {...v} defaultValue="">
                  <option value="">Izaberite marku</option>
                  {MARKE.map((m) => (
                    <option key={m.slug}>{m.naziv}</option>
                  ))}
                </Select>
              )}
            </Field>
          </Fieldset>
          <Fieldset legend="Stanja">
            <Field id="stil-greska" label="Telefon" error="Broj telefona nije ispravan. Upišite ga sa pozivnim brojem.">
              {(v) => <Input {...v} defaultValue="06" inputMode="tel" />}
            </Field>
            <Field id="stil-napomena" label="Napomena" optional>
              {(v) => <Textarea {...v} />}
            </Field>
            <Field id="stil-onemoguceno" label="Onemogućeno">
              {(v) => <Input {...v} disabled defaultValue="Ne može se menjati" />}
            </Field>
          </Fieldset>
        </div>
      </Blok>

      <Blok naslov="Paneli, napomena, disclosure">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="panel p-6">
            <p className="type-h3 text-ink-1">panel</p>
            <p className="mt-2 type-body-s text-ink-2">surface-1, ivica, radijus 14, osvetljena gornja ivica.</p>
          </div>
          <div className="panel-raised p-6">
            <p className="type-h3 text-ink-1">panel-raised</p>
            <p className="mt-2 type-body-s text-ink-2">Radijus 20, kontaktna senka.</p>
          </div>
          <div className="panel-inset p-6">
            <p className="type-h3 text-ink-1">panel-inset</p>
            <p className="mt-2 type-body-s text-ink-2">Udubljenje, radijus 10.</p>
          </div>
        </div>
        <Note className="mt-6 max-w-2xl">Sajt ništa ne šalje i ne čuva. Poruka ide samo preko aplikacije koju izaberete.</Note>
        <div className="mt-6 max-w-2xl border-t border-line">
          <Disclosure summary="Gde se nalazi broj šasije?">
            <p>U saobraćajnoj dozvoli, u polju E.</p>
          </Disclosure>
          <Disclosure summary="Da li šaljete delove?">
            <p>Način i cenu slanja dogovaramo pri potvrdi dela.</p>
          </Disclosure>
        </div>
      </Blok>

      <Blok naslov="Kanali za kontakt">
        <ContactChannels className="max-w-3xl" />
      </Blok>

      <Blok naslov="Kartice delova (reveal grupa)">
        <RevealGroup as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {GRUPE.slice(0, 10).map((g, i) => (
            <RevealItem as="li" key={g.slug}>
              <a href={`${RUTE.asortiman}#${g.sistem}`} className="block overflow-hidden panel card-link">
                <div className="overflow-hidden rounded-t-[13px] tile-render">
                  <div data-card-media="">
                    <PartImage slug={g.slug} alt="" eager={i < 2} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="type-h3 text-ink-1">{g.naziv}</p>
                  <p className="mt-1 line-clamp-2 type-body-s text-ink-2">{g.kratko}</p>
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </Blok>

      <Blok naslov="Logo i ikone">
        <div className="flex flex-wrap items-end gap-10 text-ink-1">
          <LogoStacked className="h-32 w-auto" />
          <LogoHorizontal className="h-11 w-auto" />
          <LogoMark className="h-8 w-auto" />
        </div>
        <ul className="mt-8 flex flex-wrap gap-4 text-ink-2">
          {[PhoneIcon, ChatCircleTextIcon, WhatsappLogoIcon, EnvelopeIcon, StorefrontIcon, MapPinIcon, InfoIcon, CheckIcon, ListIcon, SealCheckIcon, IdentificationCardIcon, WrenchIcon, HandshakeIcon].map(
            (Ikona, i) => (
              <li key={i} className="flex size-12 items-center justify-center rounded-sm bg-surface-2">
                <Ikona size={24} aria-hidden="true" />
              </li>
            ),
          )}
        </ul>
      </Blok>

      <Blok naslov="Radijusi i senke">
        <Reveal className="flex flex-wrap gap-4">
          {[
            ["xs 6", "rounded-xs"],
            ["sm 10", "rounded-sm"],
            ["md 14", "rounded-md"],
            ["lg 20", "rounded-lg"],
          ].map(([o, k]) => (
            <div key={o} className={`flex size-28 items-center justify-center border border-line-strong bg-surface-2 type-body-s text-ink-2 ${k}`}>
              {o}
            </div>
          ))}
          <div className="flex size-28 items-center justify-center rounded-md bg-surface-1 type-body-s text-ink-2 shadow-[var(--shadow-raised)]">
            raised
          </div>
          <div className="flex size-28 items-center justify-center rounded-md bg-surface-3 type-body-s text-ink-2 shadow-[var(--shadow-overlay)]">
            overlay
          </div>
        </Reveal>
      </Blok>
    </div>
  );
}
