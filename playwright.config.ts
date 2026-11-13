import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 4329);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${port}`, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm preview --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.E2E_PORT,
    env: { ASTRO_PREVIEW_BACKGROUND: "1" },
  },
});
