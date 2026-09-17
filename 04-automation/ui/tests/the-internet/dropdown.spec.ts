import { test, expect } from '@playwright/test';
import { DropdownPage } from '../../pages/the-internet/DropdownPage.js';

/**
 * Dropdown — automates TC-TI-DD-001..006.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-DROPDOWN-the-internet.md
 */
test.describe('The Internet — Dropdown', () => {
  let dd: DropdownPage;

  test.beforeEach(async ({ page }) => {
    dd = new DropdownPage(page);
    await dd.goto();
  });

  test('TC-TI-DD-001: default option is the placeholder', async () => {
    expect(await dd.selectedLabel()).toBe('Please select an option');
  });

  test('TC-TI-DD-002: lists the available options', async () => {
    await expect(dd.select.locator('option')).toHaveText([
      'Please select an option',
      'Option 1',
      'Option 2',
    ]);
  });

  test('TC-TI-DD-003: select Option 1', async () => {
    await dd.selectByLabel('Option 1');
    expect(await dd.selectedLabel()).toBe('Option 1');
  });

  test('TC-TI-DD-004: select Option 2', async () => {
    await dd.selectByLabel('Option 2');
    expect(await dd.selectedLabel()).toBe('Option 2');
  });

  test('TC-TI-DD-005: change selection between options', async () => {
    await dd.selectByLabel('Option 1');
    expect(await dd.selectedLabel()).toBe('Option 1');
    await dd.selectByLabel('Option 2');
    expect(await dd.selectedLabel()).toBe('Option 2');
  });

  test('TC-TI-DD-006: placeholder option is disabled', async () => {
    await expect(dd.optionByLabel('Please select an option')).toBeDisabled();
  });
});
