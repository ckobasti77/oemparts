"use client";

/**
 * Forma upita po broju šasije (P2, plan K01 §4.5 i §7). Sastavlja poruku u pregledaču i nudi
 * linkove za Viber, WhatsApp i mejl i kopiranje. Nema servera, ništa se ne šalje ni ne čuva.
 *
 * - Provera: na izlazu iz popunjenog polja i na „Sastavi poruku“. Posle toga greška polja se
 *   menja odmah, dok se kuca. Polja dobijaju `aria-invalid` i `aria-describedby` (Field).
 * - Neuspeh: fokus na sažetak sa linkovima ka poljima. Uspeh: fokus na „Vaša poruka“.
 * - Izmena posle sastavljanja odmah osvežava pregled i linkove; ako polje postane neispravno,
 *   pregled se skriva dok se poruka ponovo ne sastavi.
 * - Bez JS-a dugme je onemogućeno (forma nikad ne šalje podatke u URL); kanale nudi <noscript>.
 * - Ikone (i crtež za broj šasije) crta server i šalje kao props: Phosphor ikona nosi svih šest
 *   težina, pa bi u klijentskom paketu bila višestruko veća (budžet početnog JS-a, ODLUKA K05).
 */
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Fieldset, Input, Select, Textarea } from "@/components/ui/Field";
import { UPIT_GRESKE, UPIT_LIMITI, UPIT_POLJA, UPIT_SLANJE, VIN_POMOC } from "@/content/upit";
import { MARKE } from "@/content/vozila";
import { cn } from "@/lib/cn";
import {
  PRAZAN_UPIT,
  deoIzUpita,
  linkoviPoruke,
  proveriUpit,
  sastaviPoruku,
  tekst,
  type UpitPolja,
} from "@/lib/upit";
import { VIN_DUZINA, normalizeVin, validateVin } from "@/lib/vin";

type Kljuc = keyof UpitPolja;

/** Redosled polja u formi (i u sažetku grešaka). */
const REDOSLED: readonly Kljuc[] = ["vin", "marka", "model", "deo", "napomena", "ime", "telefon"];

const id = (k: Kljuc) => `upit-${k}`;

function brojac(n: number, max: number): string {
  return UPIT_POLJA.brojac.replace("{n}", String(n)).replace("{max}", String(max));
}

/** Kopira tekst: Clipboard API, a rezerva je skriveni textarea (stariji pregledači, http). */
async function kopirajTekst(t: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(t);
      return true;
    }
  } catch {
    // probaj rezervu
  }
  const fokus = document.activeElement as HTMLElement | null;
  try {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  } finally {
    fokus?.focus({ preventScroll: true });
  }
}

const bezPretplate = () => () => {};

export type IkoneUpita = Record<
  "viber" | "whatsapp" | "mejl" | "kopiraj" | "kopirano" | "pomoc" | "strelica" | "upozorenje",
  ReactNode
>;

export function UpitForma({
  delovi,
  pomocVin,
  ikone,
}: {
  /** slug grupe → naziv, za `/upit/?deo=<grupa>`. */
  delovi: Readonly<Record<string, string>>;
  /** „Gde je broj šasije?“ za telefon (do 1024 px), ispod polja; od 1024 px je u bočnoj koloni. */
  pomocVin: ReactNode;
  ikone: IkoneUpita;
}) {
  const hidratisano = useSyncExternalStore(bezPretplate, () => true, () => false);
  const [polja, setPolja] = useState<UpitPolja>(PRAZAN_UPIT);
  const [dodirnuta, setDodirnuta] = useState<ReadonlySet<Kljuc>>(new Set());
  const [pokusano, setPokusano] = useState(false);
  const [sastavljeno, setSastavljeno] = useState(false);
  const [fokus, setFokus] = useState<{ cilj: "sazetak" | "poruka"; n: number } | null>(null);
  const [status, setStatus] = useState<{ tekst: string; ok: boolean } | null>(null);
  const [kopirano, setKopirano] = useState(false);
  const sazetak = useRef<HTMLDivElement>(null);
  const porukaNaslov = useRef<HTMLHeadingElement>(null);

  // `/upit/?deo=<grupa>` (link „Pitajte za ovaj deo“) popunjava „Deo“ nazivom grupe. Adresa se
  // čita posle hidratacije, da server i klijent počnu od iste prazne forme.
  useEffect(() => {
    const pocetak = deoIzUpita(window.location.search, delovi);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- jednom, posle hidratacije, iz adrese strane
    if (pocetak) setPolja((p) => (p.deo ? p : { ...p, deo: pocetak }));
  }, [delovi]);

  useEffect(() => {
    if (!fokus) return;
    const el = fokus.cilj === "sazetak" ? sazetak.current : porukaNaslov.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: fokus.cilj === "sazetak" ? "center" : "start" });
  }, [fokus]);

  useEffect(() => {
    if (!kopirano) return;
    const t = window.setTimeout(() => setKopirano(false), 1600);
    return () => window.clearTimeout(t);
  }, [kopirano]);

  const sveGreske = proveriUpit(polja);
  const ispravno = Object.keys(sveGreske).length === 0;
  const greska = (k: Kljuc) => (pokusano || dodirnuta.has(k) ? sveGreske[k] : undefined);
  const listaGresaka = REDOSLED.filter((k) => greska(k)).map((k) => ({ k, poruka: greska(k)! }));
  const prikaziPoruku = sastavljeno && ispravno;
  const poruka = prikaziPoruku ? sastaviPoruku(polja) : "";
  const linkovi = prikaziPoruku ? linkoviPoruke(polja) : null;

  const marka = MARKE.find((m) => m.naziv === polja.marka);
  const vinDuzina = [...normalizeVin(polja.vin)].length;
  /** Ispravljen broj šasije (O i Q → 0, I → 1), kad je greška vidljiva i predlog postoji. */
  const vinPredlog = greska("vin") ? validateVin(polja.vin).predlog : undefined;

  function primeniPredlog(predlog: string) {
    setPolja((p) => ({ ...p, vin: predlog }));
    document.getElementById(id("vin"))?.focus();
  }

  function promeni(k: Kljuc) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const nova = { ...polja, [k]: e.target.value };
      setPolja(nova);
      setStatus(null);
      // Neispravna izmena skriva pregled dok se poruka ponovo ne sastavi (plan K01 §7.5).
      if (sastavljeno && Object.keys(proveriUpit(nova)).length > 0) setSastavljeno(false);
    };
  }

  /** Izlaz iz polja: greška se prikazuje tek kad je polje popunjeno (prazno javlja „Sastavi“). */
  function izadji(k: Kljuc) {
    return (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!e.target.value.trim() || dodirnuta.has(k)) return;
      setDodirnuta((d) => new Set(d).add(k));
    };
  }

  function sastavi(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPokusano(true);
    setStatus(null);
    setSastavljeno(ispravno);
    setFokus((f) => ({ cilj: ispravno ? "poruka" : "sazetak", n: (f?.n ?? 0) + 1 }));
  }

  function idiNaPolje(k: Kljuc) {
    const polje = document.getElementById(id(k));
    if (!polje) return;
    polje.focus({ preventScroll: true });
    (document.querySelector(`label[for="${id(k)}"]`) ?? polje).scrollIntoView({ block: "center" });
  }

  async function kopiraj(zaViber = false) {
    const ok = await kopirajTekst(poruka);
    setKopirano(ok);
    setStatus({
      ok,
      tekst: ok ? (zaViber ? UPIT_SLANJE.viberNapomena : UPIT_SLANJE.kopirano) : UPIT_SLANJE.nijeKopirano,
    });
  }

  const veze = (k: Kljuc) => ({ value: polja[k], onChange: promeni(k), onBlur: izadji(k) });

  return (
    <div className="flex flex-col gap-6">
      <form
        method="post"
        noValidate
        onSubmit={sastavi}
        className="flex flex-col gap-6"
      >
        {pokusano && listaGresaka.length > 0 ? (
          <div
            ref={sazetak}
            role="group"
            tabIndex={-1}
            aria-labelledby="upit-sazetak-naslov"
            className="rounded-md border border-danger bg-danger-subtle p-4 md:p-5"
          >
            <h2 id="upit-sazetak-naslov" className="flex items-center gap-2 type-h3 text-ink-1">
              <span aria-hidden="true" className="inline-flex shrink-0 text-danger">
                {ikone.upozorenje}
              </span>
              {UPIT_GRESKE.sazetak}
            </h2>
            <p className="mt-1 type-body-s text-ink-2">{UPIT_GRESKE.sazetakTekst}</p>
            <ul className="mt-2 flex flex-col type-body-s">
              {listaGresaka.map(({ k, poruka: p }) => (
                <li key={k}>
                  <a
                    href={`#${id(k)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      idiNaPolje(k);
                    }}
                    className="inline-flex min-h-11 items-center link-underline text-ink-1"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="panel flex flex-col gap-8 p-5 md:p-8">
          <Fieldset legend={UPIT_POLJA.vozilo}>
            <Field
              id={id("vin")}
              label={UPIT_POLJA.vin}
              hint={UPIT_POLJA.vinPomoc}
              counter={brojac(vinDuzina, VIN_DUZINA)}
              error={greska("vin")}
            >
              {(v) => (
                <Input
                  {...v}
                  {...veze("vin")}
                  name="vin"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  maxLength={20}
                  className="uppercase tracking-[0.06em] tabular-nums"
                />
              )}
            </Field>
            {vinPredlog ? (
              <div className="-mt-2">
                <Button variant="secondary" onClick={() => primeniPredlog(vinPredlog)} className="tabular-nums">
                  {UPIT_GRESKE.vinPrimeni.replace("{predlog}", vinPredlog)}
                </Button>
              </div>
            ) : null}
            <details className="group -mt-1 lg:hidden">
              <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 type-body-s font-semibold text-ink-1">
                <span aria-hidden="true" className="inline-flex shrink-0 text-ink-3">
                  {ikone.pomoc}
                </span>
                <span className="link-underline">{VIN_POMOC.naslov}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex shrink-0 text-ink-3 transition-transform duration-[var(--dur-base)] ease-snap group-open:rotate-180"
                >
                  {ikone.strelica}
                </span>
              </summary>
              <div data-disclosure-content="" className="mt-2 panel-inset p-4">
                {pomocVin}
              </div>
            </details>
            <div className="mt-2 flex flex-col gap-3">
              <p className="type-body-s text-ink-2">{UPIT_POLJA.vozilo_ili}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={id("marka")} label={UPIT_POLJA.marka} error={greska("marka")}>
                  {(v) => (
                    <Select {...v} {...veze("marka")} name="marka">
                      <option value="">{UPIT_POLJA.markaIzaberite}</option>
                      {MARKE.map((m) => (
                        <option key={m.slug} value={m.naziv}>
                          {m.naziv}
                        </option>
                      ))}
                      <option value={UPIT_POLJA.markaDruga}>{UPIT_POLJA.markaDruga}</option>
                    </Select>
                  )}
                </Field>
                <Field id={id("model")} label={UPIT_POLJA.model} error={greska("model")}>
                  {(v) => (
                    <Input
                      {...v}
                      {...veze("model")}
                      name="model"
                      autoComplete="off"
                      list={marka ? "upit-modeli" : undefined}
                    />
                  )}
                </Field>
                {marka ? (
                  <datalist id="upit-modeli">
                    {marka.modeli.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                ) : null}
              </div>
            </div>
          </Fieldset>

          {/* Linija je na omotaču: na samom <fieldset> legenda bi sela na ivicu. */}
          <div className="border-t border-line pt-8">
            <Fieldset legend={UPIT_POLJA.potreba}>
              <Field
                id={id("deo")}
                label={UPIT_POLJA.deo}
                hint={UPIT_POLJA.deoPomoc}
                counter={brojac(tekst(polja.deo).length, UPIT_LIMITI.deo)}
                error={greska("deo")}
              >
                {(v) => <Textarea {...v} {...veze("deo")} name="deo" rows={4} />}
              </Field>
              <Field
                id={id("napomena")}
                label={UPIT_POLJA.napomena}
                optional
                hint={UPIT_POLJA.napomenaPomoc}
                counter={brojac(tekst(polja.napomena).length, UPIT_LIMITI.napomena)}
                error={greska("napomena")}
              >
                {(v) => <Textarea {...v} {...veze("napomena")} name="napomena" rows={3} />}
              </Field>
            </Fieldset>
          </div>

          <div className="border-t border-line pt-8">
            <Fieldset legend={UPIT_POLJA.kontakt}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id={id("ime")} label={UPIT_POLJA.ime} error={greska("ime")}>
                  {(v) => <Input {...v} {...veze("ime")} name="ime" autoComplete="name" />}
                </Field>
                <Field id={id("telefon")} label={UPIT_POLJA.telefon} hint={UPIT_POLJA.telefonPomoc} error={greska("telefon")}>
                  {(v) => (
                    <Input {...v} {...veze("telefon")} name="telefon" type="tel" inputMode="tel" autoComplete="tel" />
                  )}
                </Field>
              </div>
            </Fieldset>
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-5">
            {/* Pritisak ne uzima fokus (K07): inače izlaz iz polja prikaže grešku iznad dugmeta,
                dugme se pomeri pre puštanja i klik promaši. Provera ide na „Sastavi“. */}
            <Button
              type="submit"
              size="lg"
              disabled={!hidratisano}
              aria-describedby="upit-sastavi-pomoc"
              onMouseDown={(e) => e.preventDefault()}
              className="w-full sm:w-auto"
            >
              {UPIT_POLJA.sastavi}
            </Button>
            <p id="upit-sastavi-pomoc" className="type-caption font-normal text-ink-3">
              {UPIT_POLJA.sastaviPomoc}
            </p>
          </div>
        </div>
      </form>

      {prikaziPoruku && linkovi ? (
        <section aria-labelledby="upit-poruka-naslov" className="animate-rise-in panel-raised p-5 md:p-8">
          <h2 id="upit-poruka-naslov" ref={porukaNaslov} tabIndex={-1} className="type-h2 text-ink-1">
            {UPIT_SLANJE.naslov}
          </h2>
          <p className="mt-2 max-w-[60ch] type-body-s text-ink-2">{UPIT_SLANJE.objasnjenje}</p>
          <pre
            className="mt-5 max-h-[24rem] overflow-auto panel-inset p-4 font-sans type-body-s whitespace-pre-wrap break-words text-ink-1"
          >
            {poruka}
          </pre>
          <p className="mt-2 type-caption font-normal text-ink-3">{UPIT_SLANJE.izmena}</p>
          <h3 className="mt-6 type-label text-ink-3">{UPIT_SLANJE.posaljite}</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {linkovi.viber ? (
              <li>
                <ButtonLink
                  href={linkovi.viber}
                  variant="quiet"
                  fullWidth
                  icon={ikone.viber}
                  onClick={() => void kopiraj(true)}
                >
                  {UPIT_SLANJE.viber}
                </ButtonLink>
              </li>
            ) : null}
            {linkovi.whatsapp ? (
              <li>
                <ButtonLink href={linkovi.whatsapp} variant="quiet" fullWidth icon={ikone.whatsapp}>
                  {UPIT_SLANJE.whatsapp}
                </ButtonLink>
              </li>
            ) : null}
            {linkovi.email ? (
              <li>
                <ButtonLink href={linkovi.email} variant="quiet" fullWidth icon={ikone.mejl}>
                  {UPIT_SLANJE.mejl}
                </ButtonLink>
              </li>
            ) : null}
            <li>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => void kopiraj()}
                icon={kopirano ? <span className="inline-flex text-success">{ikone.kopirano}</span> : ikone.kopiraj}
              >
                {UPIT_SLANJE.kopiraj}
              </Button>
            </li>
          </ul>
          <p
            role="status"
            className={cn(
              "mt-3 min-h-6 type-body-s",
              status ? (status.ok ? "text-ink-1" : "text-danger") : "text-ink-3",
            )}
          >
            {status && !status.ok ? (
              <span aria-hidden="true" className="mr-2 inline-flex align-[-0.2em]">
                {ikone.upozorenje}
              </span>
            ) : null}
            {status?.tekst ?? ""}
          </p>
        </section>
      ) : null}
    </div>
  );
}
