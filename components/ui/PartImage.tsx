import { slikaDela } from "@/lib/asortiman";
import { cn } from "@/lib/cn";

/**
 * Render dela (768 × 768, providna pozadina) sa varijantom 384 px. Sa images.unoptimized Next
 * ne pravi srcset, pa ga pišemo ručno (ODLUKA K01-09). U linku koji već nosi naziv: alt="".
 */
export function PartImage({
  slug,
  alt,
  sizes = "(min-width: 80rem) 240px, (min-width: 48rem) 30vw, 46vw",
  eager = false,
  className,
}: {
  slug: string;
  alt: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
}) {
  const { src, src384 } = slikaDela(slug);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized; ručni srcset
    <img
      src={src384}
      srcSet={`${src384} 384w, ${src} 768w`}
      sizes={sizes}
      width={768}
      height={768}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-auto w-full", className)}
    />
  );
}
