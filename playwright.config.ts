import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'e2e',
  // The tests share one server, so they run one at a time.
  workers: 1,
  timeout: 60_000,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    // Locally, use the installed Chrome. CI installs Playwright's Chromium.
    channel: CI ? undefined : 'chrome',
  },
  webServer: {
    command: 'npm run build && npm start',
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/hello`,
    timeout: 240_000,
    reuseExistingServer: !CI,
  },
});
