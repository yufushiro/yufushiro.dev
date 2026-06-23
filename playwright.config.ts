import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://localhost:4173",
    timeout: 120_000,
  },
  projects: [
    {
      name: "firefox",
      use: devices["Desktop Firefox"],
    },
  ],
});
