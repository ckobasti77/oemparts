import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent tooling, the night-run kit and reference copies from the old site (not project source).
    ".claude/**",
    ".nocni-run/**",
    "_izvor/**",
  ]),
  // GSAP samo kroz zajednički primitiv u components/motion/ (pravila runa OEMPARTS).
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["components/motion/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["gsap", "gsap/*", "@gsap/*"],
              message: "GSAP samo kroz components/motion/ (pravila runa).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
