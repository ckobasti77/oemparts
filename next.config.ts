import type { NextConfig } from "next";

/**
 * Statički izvoz (P1): `next build` piše gotov sajt u `out/`.
 * Bez cacheComponents i partialPrefetching: ne rade sa output: "export"
 * ("PPR cannot be enabled in export mode"; partialPrefetching traži cacheComponents).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    agentFeedback: true, // utiče samo na `next dev`; zatečeno, ostaje
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
