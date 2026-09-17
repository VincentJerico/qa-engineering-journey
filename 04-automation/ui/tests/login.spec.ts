import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { USERS, PASSWORD } from '../pages/testData.js';

/**
 * Login suite — automates TC-LOGIN-001..011.
 * Manual cases: ../../01-manual-testing/test-cases/TC-LOGIN-saucedemo.md
 */
test.describe('SauceDemo — Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('TC-LOGIN-001: valid login (standard_user)', async ({ page }) => {
    await login.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-LOGIN-002: locked-out user is blocked', async () => {
    await login.login(USERS.lockedOut, PASSWORD);
    await login.expectError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('TC-LOGIN-003: invalid password', async () => {
    await login.login(USERS.standard, 'wrong_password');
    await login.expectError('Epic sadface: Username and password do not match any user in this service');
  });

  test('TC-LOGIN-004: non-existent username (no user enumeration)', async () => {
    await login.login('unknown_user', PASSWORD);
    await login.expectError('Epic sadface: Username and password do not match any user in this service');
  });

  test('TC-LOGIN-005: empty username', async () => {
    await login.login('', PASSWORD);
    await login.expectError('Epic sadface: Username is required');
  });

  test('TC-LOGIN-006: empty password', async () => {
    await login.login(USERS.standard, '');
    await login.expectError('Epic sadface: Password is required');
  });

  test('TC-LOGIN-007: both fields empty (username validated first)', async () => {
    await login.login('', '');
    await login.expectError('Epic sadface: Username is required');
  });

  test('TC-LOGIN-008: error banner can be dismissed', async () => {
    await login.login('', '');
    await expect(login.error).toBeVisible();
    await login.dismissError();
    await expect(login.error).toHaveCount(0);
  });

  test('TC-LOGIN-009: password field masks input', async () => {
    await expect(login.password).toHaveAttribute('type', 'password');
  });

  test('TC-LOGIN-010: direct inventory access is blocked when logged out', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/(saucedemo\.com\/?|index\.html)$/);
    await login.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });

  test('TC-LOGIN-011: logout ends the session (back button does not restore)', async ({ page }) => {
    const inventory = new (await import('../pages/InventoryPage.js')).InventoryPage(page);
    await login.login(USERS.standard, PASSWORD);
    await inventory.expectLoaded();
    await inventory.logout();
    await expect(page).toHaveURL(/(saucedemo\.com\/?|index\.html)$/);
    await page.goBack();
    await login.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });
});
