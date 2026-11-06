import { test, expect } from '../../fixtures/test.js';
import { CREDENTIALS, FLASH } from '../../pages/the-internet/testData.js';

/**
 * Form Authentication — automates TC-TI-LOGIN-001..008.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-LOGIN-the-internet.md
 */
test.describe('The Internet — Form Authentication', () => {
  test.beforeEach(async ({ formLoginPage }) => {
    await formLoginPage.goto();
  });

  test('TC-TI-LOGIN-001: valid login', { tag: '@high' }, async ({ page, formLoginPage: login }) => {
    await login.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await expect(page).toHaveURL(/\/secure/);
    await login.expectFlash(FLASH.loginSuccess);
    await expect(login.logoutButton).toBeVisible();
  });

  test(
    'TC-TI-LOGIN-002: invalid username',
    { tag: '@high' },
    async ({ page, formLoginPage: login }) => {
      await login.login('wronguser', CREDENTIALS.valid.password);
      await expect(page).toHaveURL(/\/login/);
      await login.expectFlash(FLASH.invalidUsername);
    },
  );

  test('TC-TI-LOGIN-003: invalid password', { tag: '@high' }, async ({ formLoginPage: login }) => {
    await login.login(CREDENTIALS.valid.username, 'wrongpass');
    await login.expectFlash(FLASH.invalidPassword);
  });

  test(
    'TC-TI-LOGIN-004: empty credentials',
    { tag: '@medium' },
    async ({ formLoginPage: login }) => {
      await login.login('', '');
      await login.expectFlash(FLASH.invalidUsername);
    },
  );

  test(
    'TC-TI-LOGIN-005: flash message can be dismissed',
    { tag: '@low' },
    async ({ formLoginPage: login }) => {
      await login.login('wronguser', 'x');
      await expect(login.flash).toBeVisible();
      await login.flash.locator('.close').click();
      await expect(login.flash).toBeHidden();
    },
  );

  test(
    'TC-TI-LOGIN-006: logout ends session',
    { tag: '@high' },
    async ({ page, formLoginPage: login }) => {
      await login.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
      await expect(page).toHaveURL(/\/secure/);
      await login.logout();
      await expect(page).toHaveURL(/\/login/);
      await login.expectFlash(FLASH.logoutSuccess);
    },
  );

  test(
    'TC-TI-LOGIN-007: secure page requires authentication',
    { tag: '@high' },
    async ({ page, formLoginPage: login }) => {
      await page.goto('/secure');
      await expect(page).toHaveURL(/\/login/);
      await login.expectFlash(FLASH.mustLogin);
    },
  );

  test(
    'TC-TI-LOGIN-008: password field is masked',
    { tag: '@medium' },
    async ({ formLoginPage: login }) => {
      await expect(login.password).toHaveAttribute('type', 'password');
    },
  );
});
