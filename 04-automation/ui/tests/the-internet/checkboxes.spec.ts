import { test, expect } from '../../fixtures/test.js';

/**
 * Checkboxes — automates TC-TI-CHK-001..006.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-CHECKBOXES-the-internet.md
 */
test.describe('The Internet — Checkboxes', () => {
  test.beforeEach(async ({ checkboxesPage }) => {
    await checkboxesPage.goto();
  });

  test(
    'TC-TI-CHK-001: default states are [unchecked, checked]',
    { tag: '@high' },
    async ({ checkboxesPage: cb }) => {
      await expect(cb.checkboxes).toHaveCount(2);
      await expect(cb.nth(0)).not.toBeChecked();
      await expect(cb.nth(1)).toBeChecked();
    },
  );

  test(
    'TC-TI-CHK-002: check the first checkbox',
    { tag: '@high' },
    async ({ checkboxesPage: cb }) => {
      await cb.nth(0).check();
      await expect(cb.nth(0)).toBeChecked();
    },
  );

  test(
    'TC-TI-CHK-003: uncheck the second checkbox',
    { tag: '@high' },
    async ({ checkboxesPage: cb }) => {
      await cb.nth(1).uncheck();
      await expect(cb.nth(1)).not.toBeChecked();
    },
  );

  test(
    'TC-TI-CHK-004: toggle first twice returns to original state',
    { tag: '@medium' },
    async ({ checkboxesPage: cb }) => {
      await expect(cb.nth(0)).not.toBeChecked();
      await cb.nth(0).click();
      await expect(cb.nth(0)).toBeChecked();
      await cb.nth(0).click();
      await expect(cb.nth(0)).not.toBeChecked();
    },
  );

  test(
    'TC-TI-CHK-005: both can be checked simultaneously',
    { tag: '@medium' },
    async ({ checkboxesPage: cb }) => {
      await cb.nth(0).check();
      await cb.nth(1).check();
      await expect(cb.nth(0)).toBeChecked();
      await expect(cb.nth(1)).toBeChecked();
    },
  );

  test(
    'TC-TI-CHK-006: both can be unchecked simultaneously',
    { tag: '@medium' },
    async ({ checkboxesPage: cb }) => {
      await cb.nth(0).uncheck();
      await cb.nth(1).uncheck();
      await expect(cb.nth(0)).not.toBeChecked();
      await expect(cb.nth(1)).not.toBeChecked();
    },
  );
});
