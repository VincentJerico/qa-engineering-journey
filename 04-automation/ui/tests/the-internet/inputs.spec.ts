import { test, expect } from '@playwright/test';
import { InputsPage } from '../../pages/the-internet/InputsPage.js';

/**
 * Inputs — automates TC-TI-IN-001..008.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-INPUTS-the-internet.md
 */
test.describe('The Internet — Inputs', () => {
  let inputs: InputsPage;

  test.beforeEach(async ({ page }) => {
    inputs = new InputsPage(page);
    await inputs.goto();
  });

  test('TC-TI-IN-001: accepts a positive integer', async () => {
    await inputs.typeValue('42');
    expect(await inputs.value()).toBe('42');
  });

  test('TC-TI-IN-002: accepts a negative number', async () => {
    await inputs.typeValue('-15');
    expect(await inputs.value()).toBe('-15');
  });

  test('TC-TI-IN-003: accepts a decimal value', async () => {
    await inputs.typeValue('3.14');
    expect(await inputs.value()).toBe('3.14');
  });

  test('TC-TI-IN-004: ignores non-numeric characters', async () => {
    await inputs.typeValue('abc');
    expect(await inputs.value()).toBe('');
  });

  test('TC-TI-IN-005: ArrowUp increments the value', async () => {
    await inputs.typeValue('5');
    await inputs.press('ArrowUp');
    expect(await inputs.value()).toBe('6');
  });

  test('TC-TI-IN-006: ArrowDown decrements the value', async () => {
    await inputs.typeValue('5');
    await inputs.press('ArrowDown');
    expect(await inputs.value()).toBe('4');
  });

  test('TC-TI-IN-007: accepts a large number (documented behavior)', async () => {
    await inputs.typeValue('999999999999');
    expect(await inputs.value()).toBe('999999999999');
  });

  test('TC-TI-IN-008: accepts special numeric forms (documented behavior)', async () => {
    await inputs.typeValue('1e3');
    expect(await inputs.value()).toBe('1e3');
  });
});
