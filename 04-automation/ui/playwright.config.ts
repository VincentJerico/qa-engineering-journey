import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the UI automation suites.
 * Organized by application via Playwright "projects", each with its own baseURL:
 *   - saucedemo    → tests/*.spec.ts        (TP-001)  https://www.saucedemo.com
 *   - the-internet → tests/the-internet/**  (TP-002)  https://the-internet.herokuapp.com
 *
 * Run one app:  npx playwright test --project=the-internet
 * Plans: ../../01-manual-testing/test-plans/
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'saucedemo',
      testIgnore: '**/the-internet/**',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'the-internet',
      testDir: './tests/the-internet',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://the-internet.herokuapp.com' },
    },
    // Add more browsers per project when needed, e.g. devices['Desktop Firefox'].
  ],
});
