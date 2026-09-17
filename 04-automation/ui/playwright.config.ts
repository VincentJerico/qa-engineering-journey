import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo UI suite.
 * See the manual test plan: ../../01-manual-testing/test-plans/TP-001-saucedemo.md
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers when needed:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
