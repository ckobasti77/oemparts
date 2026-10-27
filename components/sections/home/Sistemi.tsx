import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SystemCard } from "@/components/sections/SystemCard";
import { ButtonLink } from "@/components/ui/Button";
import { SISTEMI } from "@/content/asortiman";
import { CTA } from "@/content/navigacija";
import { pocetna } from "@/content/pocetna";
import { RUTE } from "@/lib/routes";

/** Sistemi delova (sekcija 3): 10 kartica sa renderima → /asortiman/<sistem>/. */
export function Sistemi() {
  const t = pocetna.sistemi;
  const sistemi = [...SISTEMI].sort((a, b) => a.redosled - b.redosled);
  return (
    <section aria-labelledby="sistemi-naslov" className="bg-bg-raised px-page py-section">
      <Reveal className="mb-[var(--space-block)] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[60ch]">
          <h2 id="sistemi-naslov" className="type-display-l text-ink-1">
            {t.naslov}
          </h2>
          <p className="mt-4 type-lead">{t.uvod}</p>
        </div>
        <div className="hidden shrink-0 md:block">
          <ButtonLink href={RUTE.asortiman} variant="secondary">
            {CTA.asortiman}
          </ButtonLink>
        </div>
      </Reveal>
      <RevealGroup as="ul" className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-5">
        {sistemi.map((s) => (
          <RevealItem as="li" key={s.slug}>
            <SystemCard sistem={s} />
          </RevealItem>
        ))}
      </RevealGroup>
      <div className="mt-6 md:hidden">
        <ButtonLink href={RUTE.asortiman} variant="secondary" size="lg" fullWidth>
          {CTA.asortiman}
        </ButtonLink>
      </div>
    </section>
  );
}
