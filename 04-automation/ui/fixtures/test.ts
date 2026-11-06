import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { AddRemovePage } from '../pages/the-internet/AddRemovePage.js';
import { CheckboxesPage } from '../pages/the-internet/CheckboxesPage.js';
import { DropdownPage } from '../pages/the-internet/DropdownPage.js';
import { DynamicLoadingPage } from '../pages/the-internet/DynamicLoadingPage.js';
import { InputsPage } from '../pages/the-internet/InputsPage.js';
import { JsAlertsPage } from '../pages/the-internet/JsAlertsPage.js';
import { LoginPage as FormLoginPage } from '../pages/the-internet/LoginPage.js';

/**
 * Page objects arrive as fixtures, so a spec asks for what it needs instead of building it.
 * Each one is created per test, on that test's page.
 */
type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  addRemovePage: AddRemovePage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  dynamicLoadingPage: DynamicLoadingPage;
  inputsPage: InputsPage;
  jsAlertsPage: JsAlertsPage;
  formLoginPage: FormLoginPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  addRemovePage: async ({ page }, use) => use(new AddRemovePage(page)),
  checkboxesPage: async ({ page }, use) => use(new CheckboxesPage(page)),
  dropdownPage: async ({ page }, use) => use(new DropdownPage(page)),
  dynamicLoadingPage: async ({ page }, use) => use(new DynamicLoadingPage(page)),
  inputsPage: async ({ page }, use) => use(new InputsPage(page)),
  jsAlertsPage: async ({ page }, use) => use(new JsAlertsPage(page)),
  formLoginPage: async ({ page }, use) => use(new FormLoginPage(page)),
});

export { expect } from '@playwright/test';

/**
 * SauceDemo session for standard_user, saved once per run by tests/saucedemo.setup.ts.
 * Specs that start logged in use it; login specs and other users start from a clean context.
 */
export const STANDARD_USER_STATE = '.auth/standard-user.json';
