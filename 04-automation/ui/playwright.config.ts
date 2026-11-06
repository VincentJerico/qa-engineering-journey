import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the UI automation suites.
 * Organized by application via Playwright "projects", each with its own baseURL:
 *   - saucedemo    → tests/*.spec.ts        (TP-001)  https://www.saucedemo.com
 *   - the-internet → tests/the-internet/**  (TP-002)  https://the-internet.herokuapp.com
 * saucedemo depends on saucedemo-setup, which logs in standard_user once and saves the session
 * (fixtures/test.ts, STANDARD_USER_STATE) for the specs that start logged in.
 *
 * Every test is tagged with its manual case's priority (@high, @medium, @low); the traceability
 * gate checks the tags match. Run one app:  npx playwright test --project=the-internet
 * Run by priority:  npx playwright test --grep @high
 * Plans: ../../01-manual-testing/test-plans/
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // A test that only passes on retry fails the run in CI: flakiness is a defect to fix, not hide.
  // Retries still run, so the trace of the failed attempt is kept.
  failOnFlakyTests: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test', // SauceDemo's test hooks; page objects use getByTestId()
  },

  projects: [
    {
      name: 'saucedemo-setup',
      testMatch: /saucedemo\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'saucedemo',
      testIgnore: ['**/the-internet/**', '**/*.setup.ts'],
      dependencies: ['saucedemo-setup'],
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
