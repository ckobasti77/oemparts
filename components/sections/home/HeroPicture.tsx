import { cn } from "@/lib/cn";

/**
 * Render auta za hero (P9), sa ručnim izvorima po širini (ODLUKA K01-09):
 * - ≥ 1024 px: 16:9 (1080/1440/1920), preko cele širine hero-a;
 * - 768–1023 px: 1:1 (768/1080/1536) u okviru 4:3;
 * - < 768 px: 4:5 (640/828/1080) u kvadratnom okviru, poravnat dole (gornji deo rendera je prazan).
 * AVIF pa WebP. Sklopljen auto je LCP: `eager` i `fetchpriority="high"`. Rasklopljen je lenj i
 * dekorativan (isti prikaz, opisan na sklopljenom).
 */
type Stanje = "assembled" | "exploded";

const IZVORI = [
  {
    media: "(min-width: 64rem)",
    sizes: "100vw",
    w: 1920,
    h: 1080,
    sufiksi: [
      ["1080", 1080],
      ["1440", 1440],
      ["1920", 1920],
    ],
  },
  {
    media: "(min-width: 48rem)",
    sizes: "calc(100vw - 6rem)",
    w: 1536,
    h: 1536,
    sufiksi: [
      ["t-768", 768],
      ["t-1080", 1080],
      ["t-1536", 1536],
    ],
  },
  {
    media: undefined,
    sizes: "calc(100vw - 2rem)",
    w: 1080,
    h: 1350,
    sufiksi: [
      ["m-640", 640],
      ["m-828", 828],
      ["m-1080", 1080],
    ],
  },
] as const;

function srcset(stanje: Stanje, sufiksi: readonly (readonly [string, number])[], ext: "avif" | "webp"): string {
  return sufiksi.map(([s, w]) => `/images/hero/car-${stanje}-${s}.${ext} ${w}w`).join(", ");
}

export function HeroPicture({
  stanje,
  alt,
  lenja = false,
  className,
}: {
  stanje: Stanje;
  alt: string;
  lenja?: boolean;
  className?: string;
}) {
  return (
    <picture>
      {IZVORI.flatMap((izvor) =>
        (["avif", "webp"] as const).map((ext) => (
          <source
            key={`${izvor.media ?? "osnova"}-${ext}`}
            type={`image/${ext}`}
            media={izvor.media}
            srcSet={srcset(stanje, izvor.sufiksi, ext)}
            sizes={izvor.sizes}
            width={izvor.w}
            height={izvor.h}
          />
        )),
      )}
      <img
        src={`/images/hero/car-${stanje}-m-828.webp`}
        width={828}
        height={1035}
        alt={alt}
        loading={lenja ? "lazy" : "eager"}
        fetchPriority={lenja ? "low" : "high"}
        decoding={lenja ? "async" : "auto"}
        className={cn("block size-full rounded-none object-cover", className)}
      />
    </picture>
  );
}
