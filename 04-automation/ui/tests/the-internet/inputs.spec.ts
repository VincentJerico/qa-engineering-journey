import { test, expect } from '../../fixtures/test.js';

/**
 * Inputs — automates TC-TI-IN-001..008.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-INPUTS-the-internet.md
 */
test.describe('The Internet — Inputs', () => {
  test.beforeEach(async ({ inputsPage }) => {
    await inputsPage.goto();
  });

  test(
    'TC-TI-IN-001: accepts a positive integer',
    { tag: '@high' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('42');
      expect(await inputs.value()).toBe('42');
    },
  );

  test(
    'TC-TI-IN-002: accepts a negative number',
    { tag: '@medium' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('-15');
      expect(await inputs.value()).toBe('-15');
    },
  );

  test(
    'TC-TI-IN-003: accepts a decimal value',
    { tag: '@medium' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('3.14');
      expect(await inputs.value()).toBe('3.14');
    },
  );

  test(
    'TC-TI-IN-004: ignores non-numeric characters',
    { tag: '@high' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('abc');
      expect(await inputs.value()).toBe('');
    },
  );

  test(
    'TC-TI-IN-005: ArrowUp increments the value',
    { tag: '@medium' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('5');
      await inputs.press('ArrowUp');
      expect(await inputs.value()).toBe('6');
    },
  );

  test(
    'TC-TI-IN-006: ArrowDown decrements the value',
    { tag: '@medium' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('5');
      await inputs.press('ArrowDown');
      expect(await inputs.value()).toBe('4');
    },
  );

  test(
    'TC-TI-IN-007: accepts a large number (documented behavior)',
    { tag: '@low' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('999999999999');
      expect(await inputs.value()).toBe('999999999999');
    },
  );

  test(
    'TC-TI-IN-008: accepts special numeric forms (documented behavior)',
    { tag: '@low' },
    async ({ inputsPage: inputs }) => {
      await inputs.typeValue('1e3');
      expect(await inputs.value()).toBe('1e3');
    },
  );
});
