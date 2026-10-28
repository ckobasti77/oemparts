import { slikaDela } from "@/lib/asortiman";
import { cn } from "@/lib/cn";

/**
 * Render dela (768 × 768, providna pozadina) sa varijantom 384 px. Sa images.unoptimized Next
 * ne pravi srcset, pa ga pišemo ručno (ODLUKA K01-09). U linku koji već nosi naziv: alt="".
 *
 * `prioritet` (K07) je za render koji je LCP (prvi red na /asortiman/): `eager` i
 * `fetchpriority="high"`, u `<picture>` omotaču. React ne pravi preload nagoveštaj za sliku u
 * `<picture>`, pa prefetch strane sa drugih strana ne preuzima render (razlog ODLUKE K04).
 *
 * Renderi imaju ugrađenu senku do donje ivice slike; maska je gasi u donjih 15 %, da se na pločici
 * ne vidi oštra linija (K08).
 */
export function PartImage({
  slug,
  alt,
  sizes = "(min-width: 80rem) 240px, (min-width: 48rem) 30vw, 46vw",
  eager = false,
  prioritet = false,
  className,
}: {
  slug: string;
  alt: string;
  sizes?: string;
  eager?: boolean;
  prioritet?: boolean;
  className?: string;
}) {
  const { src, src384 } = slikaDela(slug);
  const slika = (
    // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized; ručni srcset
    <img
      src={src384}
      srcSet={`${src384} 384w, ${src} 768w`}
      sizes={sizes}
      width={768}
      height={768}
      alt={alt}
      loading={eager || prioritet ? "eager" : "lazy"}
      decoding="async"
      {...(prioritet ? { fetchPriority: "high" as const } : {})}
      className={cn("h-auto w-full [mask-image:linear-gradient(to_bottom,black_85%,transparent)]", className)}
    />
  );
  return prioritet ? <picture className="block">{slika}</picture> : slika;
}
