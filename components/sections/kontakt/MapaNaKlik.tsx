"use client";

/**
 * Mapa na klik (P3, plan K01 §4.9): dok se ne klikne, nema nijednog zahteva ka Google-u — ni
 * iframe-a, ni slike, ni skripte. Klik ubacuje iframe i prebacuje fokus na njega. Adresa je
 * iznad, u naslovu bloka; ovde ide samo u naslov iframe-a. Link
 * „Otvori u Google mapama“ je uvek pored, kao običan link (server ga crta). Ikonu crta server i
 * šalje kao prop, kao u formi upita (ODLUKA K05: Phosphor ikona u klijentu nosi svih šest težina).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { mapaEmbedSrc } from "@/lib/links";

export function MapaNaKlik({
  upit,
  adresa,
  oznake,
  ikona,
}: {
  /** Upit za Google mape (adresa ili naziv radnje). */
  upit: string;
  adresa: string;
  oznake: { prikazi: string; napomena: string; naslov: string };
  /** Ikona čiode (24 px), sa servera. */
  ikona: ReactNode;
}) {
  const [ucitana, setUcitana] = useState(false);
  const okvir = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (ucitana) okvir.current?.focus();
  }, [ucitana]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-surface-1 sm:aspect-video">
      {ucitana ? (
        <iframe
          ref={okvir}
          src={mapaEmbedSrc(upit)}
          title={`${oznake.naslov}: ${adresa}`}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 size-full rounded-none border-0"
        />
      ) : (
        <>
          {/* Šara ulica: samo CSS, bez slike sa tuđeg domena. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_75%)] opacity-60"
          />
          <div className="relative flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-sm border border-line-strong bg-surface-2 text-ink-1"
            >
              {ikona}
            </span>
            <Button variant="secondary" onClick={() => setUcitana(true)}>
              {oznake.prikazi}
            </Button>
            <p className="max-w-[40ch] type-caption font-normal text-ink-3">{oznake.napomena}</p>
          </div>
        </>
      )}
    </div>
  );
}
