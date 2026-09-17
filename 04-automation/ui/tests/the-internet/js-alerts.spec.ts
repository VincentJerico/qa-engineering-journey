import { test, expect } from '@playwright/test';
import { JsAlertsPage } from '../../pages/the-internet/JsAlertsPage.js';

/**
 * JavaScript Alerts — automates TC-TI-JS-001..006.
 * Native dialogs are handled with page.once('dialog', ...) — accept()/dismiss()/accept(text).
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-JSALERTS-the-internet.md
 */
test.describe('The Internet — JavaScript Alerts', () => {
  let js: JsAlertsPage;

  test.beforeEach(async ({ page }) => {
    js = new JsAlertsPage(page);
    await js.goto();
  });

  test('TC-TI-JS-001: alert accept', async ({ page }) => {
    page.once('dialog', (d) => d.accept());
    await js.alertButton.click();
    expect(await js.resultText()).toBe('You successfully clicked an alert');
  });

  test('TC-TI-JS-002: confirm OK', async ({ page }) => {
    page.once('dialog', (d) => d.accept());
    await js.confirmButton.click();
    expect(await js.resultText()).toBe('You clicked: Ok');
  });

  test('TC-TI-JS-003: confirm Cancel', async ({ page }) => {
    page.once('dialog', (d) => d.dismiss());
    await js.confirmButton.click();
    expect(await js.resultText()).toBe('You clicked: Cancel');
  });

  test('TC-TI-JS-004: prompt with text entered', async ({ page }) => {
    page.once('dialog', (d) => d.accept('Hello QA'));
    await js.promptButton.click();
    expect(await js.resultText()).toBe('You entered: Hello QA');
  });

  test('TC-TI-JS-005: prompt cancelled', async ({ page }) => {
    page.once('dialog', (d) => d.dismiss());
    await js.promptButton.click();
    expect(await js.resultText()).toBe('You entered: null');
  });

  test('TC-TI-JS-006: prompt accepted with empty input', async ({ page }) => {
    page.once('dialog', (d) => d.accept(''));
    await js.promptButton.click();
    expect(await js.resultText()).toBe('You entered:');
  });
});
