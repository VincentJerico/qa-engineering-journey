import { defineConfig } from '@playwright/test';

/**
 * Playwright API test configuration for Restful-Booker.
 * Uses the `request` fixture only — no browser is launched, so no `playwright install` is needed.
 * Scenarios: ../../03-api-testing/test-scenarios/  ·  Plan: ../../03-api-testing/documentation/TP-003-restful-booker.md
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
});
