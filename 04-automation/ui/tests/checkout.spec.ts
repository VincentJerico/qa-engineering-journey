import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { USERS, PASSWORD, PRODUCTS, CUSTOMER, TAX_RATE } from '../pages/testData.js';

/**
 * Checkout suite — automates TC-CHK-001..013.
 * Manual cases: ../../01-manual-testing/test-cases/TC-CHECKOUT-saucedemo.md
 */
test.describe('SauceDemo — Checkout', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  /** Log in and reach the checkout information page with the given products. */
  async function startCheckout(page: import('@playwright/test').Page, productIds: string[]) {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await inventory.expectLoaded();
    for (const id of productIds) await inventory.addToCart(id);
    await inventory.openCart();
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  }

  test('TC-CHK-001: complete checkout happy path', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkout.finish();
    await checkout.expectComplete();
  });

  test('TC-CHK-002: first name required', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation('', CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: First Name is required');
  });

  test('TC-CHK-003: last name required', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, '', CUSTOMER.postalCode);
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: Last Name is required');
  });

  test('TC-CHK-004: postal code required', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, '');
    await checkout.continue();
    await expect(checkout.error).toHaveText('Error: Postal Code is required');
  });

  test('TC-CHK-005: cancel from the information page returns to cart', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.cancel();
    await cart.expectLoaded();
    expect(await cart.itemCount()).toBe(1);
  });

  test('TC-CHK-006: overview shows correct line items and item total', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    const expectedItemTotal = PRODUCTS.backpack.price + PRODUCTS.bikeLight.price;
    expect(await checkout.itemTotalValue()).toBeCloseTo(expectedItemTotal, 2);
  });

  test('TC-CHK-007: tax and total are calculated correctly (8%)', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    const itemTotal = await checkout.itemTotalValue();
    const tax = await checkout.taxValue();
    const total = await checkout.totalValue();
    expect(tax).toBeCloseTo(Math.round(itemTotal * TAX_RATE * 100) / 100, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('TC-CHK-008: payment and shipping info displayed', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await expect(page.locator('[data-test="payment-info-label"]')).toBeVisible();
    await expect(page.locator('[data-test="shipping-info-label"]')).toBeVisible();
  });

  test('TC-CHK-009: cancel from the overview page returns to inventory', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await checkout.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-CHK-010: order completion clears the cart', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await checkout.finish();
    await checkout.expectComplete();
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('TC-CHK-011: Back Home after completion returns to inventory', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await checkout.finish();
    await checkout.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // TC-CHK-012 & TC-CHK-013 document permissive input handling (observations, not defects for
  // this demo). They assert SauceDemo's ACTUAL behavior: whitespace-only and wrong-typed values
  // are accepted and the flow proceeds to the overview.
  test('TC-CHK-012: whitespace-only inputs are accepted (documented behavior)', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation(' ', ' ', ' ');
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('TC-CHK-013: no data-type validation on name/zip (documented behavior)', async ({ page }) => {
    await startCheckout(page, [PRODUCTS.backpack.id]);
    await checkout.fillInformation('123', '456', 'abcde');
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
