"use client";

/**
 * Meni za telefon i tablet (< 1280 px), plan K01 §4.0 i ODLUKA K01-05: native `<dialog>` sa
 * `showModal()`. Pozadina je inertna, pa fokus ostaje u meniju; Tab i Shift+Tab kruže unutar
 * panela; Escape zatvara (`cancel` → izlazna animacija → `close()`); fokus se vraća na „Meni“.
 * Dok je meni otvoren, skrol strane je zaključan (`html.menu-open`).
 *
 * Sadržaj (logo, linkovi, kanali) dolazi sa servera kao `children`/props (ODLUKA K01-24), pa
 * putanje logoa i ikone ne ulaze u klijentski JS. Klik na link, promena strane i širina od
 * 1280 px zatvaraju meni odmah. Pokret: components/motion/useSheetMotion.
 */
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";

import { useSheetMotion } from "@/components/motion/useSheetMotion";

const FOKUSABILNI =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Od ove širine navigacija je u header-u i meni se ne koristi. */
const SIROKO = "(min-width: 80rem)";

const dugme =
  "inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-sm border border-line-strong px-3 " +
  "type-button text-ink-1 transition-control press hover:bg-surface-2";

export function MobileMenu({
  oznaka,
  oznakaZatvori,
  ariaZatvori,
  ariaMeni,
  ikonaMeni,
  ikonaZatvori,
  logo,
  children,
}: {
  oznaka: string;
  oznakaZatvori: string;
  ariaZatvori: string;
  ariaMeni: string;
  ikonaMeni: ReactNode;
  ikonaZatvori: ReactNode;
  logo: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const zatvoriRef = useRef<HTMLButtonElement>(null);
  const zatvaranje = useRef(false);
  const [otvoren, setOtvoren] = useState(false);
  const pathname = usePathname();
  const { enter, exit, reset } = useSheetMotion(panelRef);

  const otvori = () => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    document.documentElement.classList.add("menu-open");
    d.showModal();
    zatvoriRef.current?.focus();
    setOtvoren(true);
    enter();
  };

  /** Bez animacije (navigacija, link, širok ekran). Stanje sređuje `close` događaj. */
  const zatvoriOdmah = useCallback(() => {
    const d = dialogRef.current;
    if (d?.open) d.close();
  }, []);

  /** Sa izlaznom animacijom (dugme „Zatvori“, Escape, klik van panela). */
  const zatvori = useCallback(async () => {
    const d = dialogRef.current;
    if (!d?.open || zatvaranje.current) return;
    zatvaranje.current = true;
    d.dataset.closing = "";
    await exit();
    if (d.open && zatvaranje.current) d.close();
  }, [exit]);

  const naClose = () => {
    const d = dialogRef.current;
    zatvaranje.current = false;
    if (d) delete d.dataset.closing;
    reset();
    document.documentElement.classList.remove("menu-open");
    setOtvoren(false);
    triggerRef.current?.focus();
  };

  const naCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    void zatvori();
  };

  const naKlik = (e: MouseEvent<HTMLDialogElement>) => {
    // Klik na sam <dialog> (van panela) je klik na zatamnjenu pozadinu.
    if (e.target === e.currentTarget) {
      void zatvori();
      return;
    }
    if ((e.target as Element).closest("a[href]")) zatvoriOdmah();
  };

  const naTaster = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const lista = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOKUSABILNI) ?? []).filter(
      (el) => el.getClientRects().length > 0,
    );
    if (lista.length === 0) return;
    const prvi = lista[0];
    const poslednji = lista[lista.length - 1];
    const aktivan = document.activeElement;
    if (e.shiftKey && (aktivan === prvi || !panelRef.current?.contains(aktivan))) {
      e.preventDefault();
      poslednji.focus();
    } else if (!e.shiftKey && aktivan === poslednji) {
      e.preventDefault();
      prvi.focus();
    }
  };

  // Promena strane zatvara meni.
  useEffect(() => {
    zatvoriOdmah();
  }, [pathname, zatvoriOdmah]);

  // Od 1280 px dugmeta „Meni“ nema: otvoren meni se zatvara.
  useEffect(() => {
    const mq = window.matchMedia(SIROKO);
    const naPromenu = () => {
      if (mq.matches) zatvoriOdmah();
    };
    mq.addEventListener("change", naPromenu);
    return () => mq.removeEventListener("change", naPromenu);
  }, [zatvoriOdmah]);

  // Skrol nikad ne ostaje zaključan posle unmount-a.
  useEffect(() => () => document.documentElement.classList.remove("menu-open"), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={otvoren}
        aria-controls={id}
        onClick={otvori}
        className={dugme}
      >
        <span aria-hidden="true" className="inline-flex">
          {ikonaMeni}
        </span>
        <span>{oznaka}</span>
      </button>
      <dialog
        ref={dialogRef}
        id={id}
        aria-label={ariaMeni}
        className="menu-dialog"
        onCancel={naCancel}
        onClose={naClose}
        onClick={naKlik}
        onKeyDown={naTaster}
      >
        <div
          ref={panelRef}
          data-menu-panel=""
          className="flex h-full flex-col overflow-y-auto overscroll-contain bg-bg-raised md:my-2 md:mr-2 md:ml-auto md:h-[calc(100%-1rem)] md:w-[25rem] md:rounded-lg md:border md:border-line-strong md:bg-surface-1 md:shadow-[var(--shadow-overlay)]"
        >
          <div className="flex h-header shrink-0 items-center justify-between gap-3 px-page md:px-5">
            {logo}
            <button
              ref={zatvoriRef}
              type="button"
              aria-label={ariaZatvori}
              onClick={() => void zatvori()}
              className={`${dugme} ml-auto`}
            >
              <span aria-hidden="true" className="inline-flex">
                {ikonaZatvori}
              </span>
              <span>{oznakaZatvori}</span>
            </button>
          </div>
          <div className="flex flex-1 flex-col px-page pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-5">
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
