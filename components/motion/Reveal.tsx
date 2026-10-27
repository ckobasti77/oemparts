/**
 * Reveal primitiv (plan K01 §5.3): server komponente koje samo pišu atribute. Posao radi
 * jedan motor u app/layout.tsx (RevealEngine).
 *
 *   <Reveal>…naslov sekcije, panel, slika…</Reveal>
 *   <RevealGroup as="ul" className="grid …">       // stavke ulaze kao paket sa stagger-om
 *     {stavke.map((s) => <RevealItem as="li" key={s.id}>…</RevealItem>)}
 *   </RevealGroup>
 *
 * Pravila:
 * - Server HTML je uvek vidljiv; motor sakriva samo ono što je ceo ispod ekrana.
 * - Ne ugnježdavati (važi najspoljniji). Ne stavljati na header, meni, donju traku, footer,
 *   forme ni na element koji GSAP već transformiše. Hover transform ide na unutrašnji element.
 */
import type { HTMLAttributes, ReactNode } from "react";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "figure"
  | "p";

type Osnova = Omit<HTMLAttributes<HTMLElement>, "children"> & { as?: RevealTag; children?: ReactNode };

/** Jedan blok koji ulazi kad mu sredina pređe liniju 18 % iznad dna ekrana. */
export function Reveal({ as = "div", variant = "rise", children, ...rest }: Osnova & { variant?: "rise" | "fade" }) {
  const Tag = as as "div";
  return (
    <Tag {...rest} data-reveal="block" {...(variant === "fade" ? { "data-reveal-variant": "fade" } : {})}>
      {children}
    </Tag>
  );
}

/** Kontejner čiji direktni potomci `RevealItem` ulaze kao jedan paket (red po red). */
export function RevealGroup({ as = "div", children, ...rest }: Osnova) {
  const Tag = as as "div";
  return (
    <Tag {...rest} data-reveal-group="">
      {children}
    </Tag>
  );
}

/** Direktni potomak `RevealGroup`. */
export function RevealItem({ as = "div", children, ...rest }: Osnova) {
  const Tag = as as "div";
  return (
    <Tag {...rest} data-reveal="item">
      {children}
    </Tag>
  );
}
