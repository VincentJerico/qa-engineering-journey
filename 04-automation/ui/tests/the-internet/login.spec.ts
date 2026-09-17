import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/the-internet/LoginPage.js';
import { CREDENTIALS, FLASH } from '../../pages/the-internet/testData.js';

/**
 * Form Authentication — automates TC-TI-LOGIN-001..008.
 * Manual cases: ../../../01-manual-testing/test-cases/the-internet/TC-LOGIN-the-internet.md
 */
test.describe('The Internet — Form Authentication', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('TC-TI-LOGIN-001: valid login', async ({ page }) => {
    await login.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await expect(page).toHaveURL(/\/secure/);
    await login.expectFlash(FLASH.loginSuccess);
    await expect(login.logoutButton).toBeVisible();
  });

  test('TC-TI-LOGIN-002: invalid username', async ({ page }) => {
    await login.login('wronguser', CREDENTIALS.valid.password);
    await expect(page).toHaveURL(/\/login/);
    await login.expectFlash(FLASH.invalidUsername);
  });

  test('TC-TI-LOGIN-003: invalid password', async () => {
    await login.login(CREDENTIALS.valid.username, 'wrongpass');
    await login.expectFlash(FLASH.invalidPassword);
  });

  test('TC-TI-LOGIN-004: empty credentials', async () => {
    await login.login('', '');
    await login.expectFlash(FLASH.invalidUsername);
  });

  test('TC-TI-LOGIN-005: flash message can be dismissed', async () => {
    await login.login('wronguser', 'x');
    await expect(login.flash).toBeVisible();
    await login.flash.locator('.close').click();
    await expect(login.flash).toBeHidden();
  });

  test('TC-TI-LOGIN-006: logout ends session', async ({ page }) => {
    await login.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await expect(page).toHaveURL(/\/secure/);
    await login.logout();
    await expect(page).toHaveURL(/\/login/);
    await login.expectFlash(FLASH.logoutSuccess);
  });

  test('TC-TI-LOGIN-007: secure page requires authentication', async ({ page }) => {
    await page.goto('/secure');
    await expect(page).toHaveURL(/\/login/);
    await login.expectFlash(FLASH.mustLogin);
  });

  test('TC-TI-LOGIN-008: password field is masked', async () => {
    await expect(login.password).toHaveAttribute('type', 'password');
  });
});
