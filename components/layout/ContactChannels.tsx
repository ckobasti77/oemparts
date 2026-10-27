import {
  ChatCircleTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  StorefrontIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { ButtonLink } from "@/components/ui/Button";
import { kanali, type VrstaKanala } from "@/lib/links";
import { cn } from "@/lib/cn";

/** Ikone kanala (ODLUKA K01-22): bez logotipa marki i KP-a; WhatsApp u boji teksta. */
export const IKONA_KANALA: Record<VrstaKanala, Icon> = {
  telefon: PhoneIcon,
  viber: ChatCircleTextIcon,
  whatsapp: WhatsappLogoIcon,
  email: EnvelopeIcon,
  kp: StorefrontIcon,
};

/**
 * Kanali za kontakt kao tiha dugmad. Prikazuju se samo kanali sa ispravnom vrednošću (P4).
 * `bezKp` izostavlja KP kad ga sekcija ima posebno.
 */
export function ContactChannels({ bezKp = false, className }: { bezKp?: boolean; className?: string }) {
  const lista = kanali().filter((k) => !(bezKp && k.kanal === "kp"));
  if (lista.length === 0) return null;
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {lista.map((k) => {
        const Ikona = IKONA_KANALA[k.kanal];
        return (
          <li key={k.kanal}>
            <ButtonLink
              href={k.href}
              external={k.spoljni}
              variant="quiet"
              fullWidth
              icon={<Ikona size={20} />}
              className="justify-start"
            >
              {k.oznaka}
              {k.vrednost ? <span className="ml-2 font-normal text-ink-2">{k.vrednost}</span> : null}
            </ButtonLink>
          </li>
        );
      })}
    </ul>
  );
}
