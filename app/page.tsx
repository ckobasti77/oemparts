import { JsonLd } from "@/components/layout/JsonLd";
import { Hero } from "@/components/sections/home/Hero";
import { KakoKupiti } from "@/components/sections/home/KakoKupiti";
import { Kontakt } from "@/components/sections/home/Kontakt";
import { Marke } from "@/components/sections/home/Marke";
import { Prodavnica } from "@/components/sections/home/Prodavnica";
import { Saradnja } from "@/components/sections/home/Saradnja";
import { Sistemi } from "@/components/sections/home/Sistemi";
import { Upit } from "@/components/sections/home/Upit";
import { Zasto } from "@/components/sections/home/Zasto";
import { pocetna } from "@/content/pocetna";
import { prodavnicaLd, websiteLd } from "@/lib/jsonld";
import { RUTE } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...pocetna.meta, putanja: RUTE.pocetna });

/**
 * Početna (plan K01 §4.1): hero → marke → sistemi → zašto → kako kupiti → saradnja → upit →
 * KupujemProdajem → kontakt. Pozadine se smenjuju (bg / bg-raised) radi ritma sekcija.
 */
export default function PocetnaPage() {
  return (
    <>
      <JsonLd data={[websiteLd(), prodavnicaLd()]} />
      <Hero />
      <Marke />
      <Sistemi />
      <Zasto />
      <KakoKupiti />
      <Saradnja />
      <Upit />
      <Prodavnica />
      <Kontakt />
    </>
  );
}
