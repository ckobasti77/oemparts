import localFont from "next/font/local";

/*
 * Fontovi (P7), lokalni: build ne zavisi od mreže.
 * - Archivo Expanded 125 (naslovi): statični woff2 iz _izvor/autodelovi/assets/fonts → app/fonts/.
 * - Public Sans (tekst): varijabilni wght 100–900 iz @fontsource-variable/public-sans, kao dve
 *   familije sa unicode-range (latin + latin-ext). Latin je prva i bez prilagođenog rezervnog
 *   fonta, inače bi č ć š ž đ pali na Arial pre latin-ext familije (ODLUKA K01-07).
 */

export const archivo700 = localFont({
  src: "./fonts/archivo-expanded-700.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-archivo-700",
  fallback: ["Arial", "sans-serif"],
});

export const archivo600 = localFont({
  src: "./fonts/archivo-expanded-600.woff2",
  weight: "600",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-archivo-600",
  fallback: ["Arial", "sans-serif"],
});

export const publicSansLatin = localFont({
  src: "../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-ps-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const publicSansExt = localFont({
  src: "../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-ext-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-ps-ext",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
    },
  ],
});

/** Klase za `<html>`: definišu CSS promenljive fontova. */
export const fontVariables = [archivo700, archivo600, publicSansLatin, publicSansExt]
  .map((f) => f.variable)
  .join(" ");
