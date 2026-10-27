import { defineConfig } from "@playwright/test";

/**
 * E2E (plan K01 §10.2): statički izvoz `out/` na 3241, Chrome sa računara (`channel: "chrome"`,
 * bez preuzimanja pregledača). `npm run e2e` prvo gradi (`npm run build`), a Playwright sam diže
 * server za pregled i gasi ga posle testova. Port 3241 mora da bude slobodan
 * (`reuseExistingServer: false`); tuđi procesi se ne gase.
 */
const PORT = 3241;

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 5_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    locale: "sr-Latn-RS",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "telefon",
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `node scripts/serve-out.mjs --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
