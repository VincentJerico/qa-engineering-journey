import { test, expect } from '@playwright/test';
import { AddRemovePage } from '../../pages/the-internet/AddRemovePage.js';

/**
 * Add/Remove Elements — automates TC-TI-AR-001..005.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-ADDREMOVE-the-internet.md
 */
test.describe('The Internet — Add/Remove Elements', () => {
  let ar: AddRemovePage;

  test.beforeEach(async ({ page }) => {
    ar = new AddRemovePage(page);
    await ar.goto();
  });

  test('TC-TI-AR-001: add a single element', async () => {
    await ar.add(1);
    await expect(ar.deleteButtons).toHaveCount(1);
  });

  test('TC-TI-AR-002: add multiple elements', async () => {
    await ar.add(5);
    await expect(ar.deleteButtons).toHaveCount(5);
  });

  test('TC-TI-AR-003: remove a single element', async () => {
    await ar.add(3);
    await expect(ar.deleteButtons).toHaveCount(3);
    await ar.deleteFirst();
    await expect(ar.deleteButtons).toHaveCount(2);
  });

  test('TC-TI-AR-004: remove all added elements', async () => {
    await ar.add(3);
    await ar.deleteAll();
    await expect(ar.deleteButtons).toHaveCount(0);
  });

  test('TC-TI-AR-005: no delete buttons initially', async () => {
    await expect(ar.deleteButtons).toHaveCount(0);
    await expect(ar.addButton).toBeVisible();
  });
});
