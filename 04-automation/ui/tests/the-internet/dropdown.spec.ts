import { test, expect } from '../../fixtures/test.js';

/**
 * Dropdown — automates TC-TI-DD-001..006.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-DROPDOWN-the-internet.md
 */
test.describe('The Internet — Dropdown', () => {
  test.beforeEach(async ({ dropdownPage }) => {
    await dropdownPage.goto();
  });

  test(
    'TC-TI-DD-001: default option is the placeholder',
    { tag: '@high' },
    async ({ dropdownPage: dd }) => {
      expect(await dd.selectedLabel()).toBe('Please select an option');
    },
  );

  test(
    'TC-TI-DD-002: lists the available options',
    { tag: '@medium' },
    async ({ dropdownPage: dd }) => {
      await expect(dd.select.locator('option')).toHaveText([
        'Please select an option',
        'Option 1',
        'Option 2',
      ]);
    },
  );

  test('TC-TI-DD-003: select Option 1', { tag: '@high' }, async ({ dropdownPage: dd }) => {
    await dd.selectByLabel('Option 1');
    expect(await dd.selectedLabel()).toBe('Option 1');
  });

  test('TC-TI-DD-004: select Option 2', { tag: '@high' }, async ({ dropdownPage: dd }) => {
    await dd.selectByLabel('Option 2');
    expect(await dd.selectedLabel()).toBe('Option 2');
  });

  test(
    'TC-TI-DD-005: change selection between options',
    { tag: '@medium' },
    async ({ dropdownPage: dd }) => {
      await dd.selectByLabel('Option 1');
      expect(await dd.selectedLabel()).toBe('Option 1');
      await dd.selectByLabel('Option 2');
      expect(await dd.selectedLabel()).toBe('Option 2');
    },
  );

  test(
    'TC-TI-DD-006: placeholder option is disabled',
    { tag: '@low' },
    async ({ dropdownPage: dd }) => {
      await expect(dd.optionByLabel('Please select an option')).toBeDisabled();
    },
  );
});
