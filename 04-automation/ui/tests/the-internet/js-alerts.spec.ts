import { test, expect } from '../../fixtures/test.js';

/**
 * JavaScript Alerts — automates TC-TI-JS-001..006.
 * Native dialogs are handled with page.once('dialog', ...) — accept()/dismiss()/accept(text).
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-JSALERTS-the-internet.md
 */
test.describe('The Internet — JavaScript Alerts', () => {
  test.beforeEach(async ({ jsAlertsPage }) => {
    await jsAlertsPage.goto();
  });

  test('TC-TI-JS-001: alert accept', { tag: '@high' }, async ({ page, jsAlertsPage: js }) => {
    page.once('dialog', (d) => d.accept());
    await js.alertButton.click();
    await expect(js.result).toHaveText('You successfully clicked an alert');
  });

  test('TC-TI-JS-002: confirm OK', { tag: '@high' }, async ({ page, jsAlertsPage: js }) => {
    page.once('dialog', (d) => d.accept());
    await js.confirmButton.click();
    await expect(js.result).toHaveText('You clicked: Ok');
  });

  test('TC-TI-JS-003: confirm Cancel', { tag: '@high' }, async ({ page, jsAlertsPage: js }) => {
    page.once('dialog', (d) => d.dismiss());
    await js.confirmButton.click();
    await expect(js.result).toHaveText('You clicked: Cancel');
  });

  test(
    'TC-TI-JS-004: prompt with text entered',
    { tag: '@high' },
    async ({ page, jsAlertsPage: js }) => {
      page.once('dialog', (d) => d.accept('Hello QA'));
      await js.promptButton.click();
      await expect(js.result).toHaveText('You entered: Hello QA');
    },
  );

  test('TC-TI-JS-005: prompt cancelled', { tag: '@medium' }, async ({ page, jsAlertsPage: js }) => {
    page.once('dialog', (d) => d.dismiss());
    await js.promptButton.click();
    await expect(js.result).toHaveText('You entered: null');
  });

  test(
    'TC-TI-JS-006: prompt accepted with empty input',
    { tag: '@low' },
    async ({ page, jsAlertsPage: js }) => {
      page.once('dialog', (d) => d.accept(''));
      await js.promptButton.click();
      await expect(js.result).toHaveText('You entered:');
    },
  );
});
