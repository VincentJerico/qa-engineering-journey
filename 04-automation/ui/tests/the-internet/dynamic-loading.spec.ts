import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../../pages/the-internet/DynamicLoadingPage.js';

/**
 * Dynamic Loading — automates TC-TI-DL-001..005.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-DYNLOADING-the-internet.md
 */
test.describe('The Internet — Dynamic Loading', () => {
  let dl: DynamicLoadingPage;

  test('TC-TI-DL-002: Example 1 — element in DOM but hidden before Start', async ({ page }) => {
    dl = new DynamicLoadingPage(page);
    await dl.goto(1);
    await expect(dl.finish).toBeAttached();
    await expect(dl.finish).toBeHidden();
  });

  test('TC-TI-DL-001: Example 1 — hidden element revealed after Start', async ({ page }) => {
    dl = new DynamicLoadingPage(page);
    await dl.goto(1);
    await dl.start();
    await expect(dl.finish).toBeVisible({ timeout: 10_000 });
    await expect(dl.finish).toHaveText('Hello World!');
  });

  test('TC-TI-DL-004: Example 2 — element not in DOM before Start', async ({ page }) => {
    dl = new DynamicLoadingPage(page);
    await dl.goto(2);
    await expect(dl.finish).toHaveCount(0);
  });

  test('TC-TI-DL-003: Example 2 — element rendered after Start', async ({ page }) => {
    dl = new DynamicLoadingPage(page);
    await dl.goto(2);
    await dl.start();
    await expect(dl.finish).toBeVisible({ timeout: 10_000 });
    await expect(dl.finish).toHaveText('Hello World!');
  });

  test('TC-TI-DL-005: loading indicator shows during load', async ({ page }) => {
    dl = new DynamicLoadingPage(page);
    await dl.goto(1);
    await dl.start();
    await expect(dl.loading).toBeVisible();
    await expect(dl.finish).toBeVisible({ timeout: 10_000 });
    await expect(dl.loading).toBeHidden();
  });
});
