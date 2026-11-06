import { test, expect } from '../fixtures/test.js';
import { USERS, PASSWORD } from '../pages/testData.js';

/**
 * Login suite — automates TC-LOGIN-001..011.
 * Manual cases: ../../01-manual-testing/test-cases/TC-LOGIN-saucedemo.md
 */
// Starts logged out: the project has no saved session, so every test begins at the login page.
test.describe('SauceDemo — Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'TC-LOGIN-001: valid login (standard_user)',
    { tag: '@high' },
    async ({ page, loginPage: login }) => {
      await login.login(USERS.standard, PASSWORD);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.title')).toHaveText('Products');
    },
  );

  test(
    'TC-LOGIN-002: locked-out user is blocked',
    { tag: '@high' },
    async ({ loginPage: login }) => {
      await login.login(USERS.lockedOut, PASSWORD);
      await login.expectError('Epic sadface: Sorry, this user has been locked out.');
    },
  );

  test('TC-LOGIN-003: invalid password', { tag: '@high' }, async ({ loginPage: login }) => {
    await login.login(USERS.standard, 'wrong_password');
    await login.expectError(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test(
    'TC-LOGIN-004: non-existent username (no user enumeration)',
    { tag: '@medium' },
    async ({ loginPage: login }) => {
      await login.login('unknown_user', PASSWORD);
      await login.expectError(
        'Epic sadface: Username and password do not match any user in this service',
      );
    },
  );

  test('TC-LOGIN-005: empty username', { tag: '@high' }, async ({ loginPage: login }) => {
    await login.login('', PASSWORD);
    await login.expectError('Epic sadface: Username is required');
  });

  test('TC-LOGIN-006: empty password', { tag: '@high' }, async ({ loginPage: login }) => {
    await login.login(USERS.standard, '');
    await login.expectError('Epic sadface: Password is required');
  });

  test(
    'TC-LOGIN-007: both fields empty (username validated first)',
    { tag: '@medium' },
    async ({ loginPage: login }) => {
      await login.login('', '');
      await login.expectError('Epic sadface: Username is required');
    },
  );

  test(
    'TC-LOGIN-008: error banner can be dismissed',
    { tag: '@low' },
    async ({ loginPage: login }) => {
      await login.login('', '');
      await expect(login.error).toBeVisible();
      await login.dismissError();
      await expect(login.error).toHaveCount(0);
    },
  );

  test(
    'TC-LOGIN-009: password field masks input',
    { tag: '@medium' },
    async ({ loginPage: login }) => {
      await expect(login.password).toHaveAttribute('type', 'password');
    },
  );

  test(
    'TC-LOGIN-010: direct inventory access is blocked when logged out',
    { tag: '@medium' },
    async ({ page, loginPage: login }) => {
      await page.goto('/inventory.html');
      await expect(page).toHaveURL(/(saucedemo\.com\/?|index\.html)$/);
      await login.expectError(
        "Epic sadface: You can only access '/inventory.html' when you are logged in.",
      );
    },
  );

  test(
    'TC-LOGIN-011: logout ends the session (back button does not restore)',
    { tag: '@high' },
    async ({ page, inventoryPage: inventory, loginPage: login }) => {
      await login.login(USERS.standard, PASSWORD);
      await inventory.expectLoaded();
      await inventory.logout();
      await expect(page).toHaveURL(/(saucedemo\.com\/?|index\.html)$/);
      await page.goBack();
      await login.expectError(
        "Epic sadface: You can only access '/inventory.html' when you are logged in.",
      );
    },
  );
});
