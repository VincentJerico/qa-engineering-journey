import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { USERS, PASSWORD, PRODUCTS, CUSTOMER } from '../pages/testData.js';

/**
 * Cart suite — automates TC-CART-001..011.
 * Manual cases: ../../01-manual-testing/test-cases/TC-CART-saucedemo.md
 */
test.describe('SauceDemo — Shopping Cart', () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await inventory.expectLoaded();
  });

  test('TC-CART-001: cart icon opens the cart page', async () => {
    await inventory.openCart();
    await cart.expectLoaded();
  });

  test('TC-CART-002: added item appears in the cart', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openCart();
    await cart.expectLoaded();
    expect(await cart.itemNames()).toEqual([PRODUCTS.backpack.name]);
    expect(await cart.firstQuantity()).toBe('1');
  });

  test('TC-CART-003: multiple items appear with correct count', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.addToCart(PRODUCTS.boltTShirt.id);
    await inventory.openCart();
    await expect(cart.items).toHaveCount(3);
  });

  test('TC-CART-004: quantity is fixed at 1 (no editable control)', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openCart();
    expect(await cart.firstQuantity()).toBe('1');
    await expect(page.locator('.cart_quantity input')).toHaveCount(0);
  });

  test('TC-CART-005: remove an item from the cart page', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.openCart();
    await expect(cart.items).toHaveCount(2);
    await cart.removeFirst();
    await expect(cart.items).toHaveCount(1);
  });

  test('TC-CART-006: removing all items empties the cart', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.openCart();
    await expect(cart.items).toHaveCount(2);
    await cart.removeAll();
    await expect(cart.items).toHaveCount(0);
    await expect(cart.cartBadge).toHaveCount(0);
  });

  test('TC-CART-007: Continue Shopping returns to inventory with cart retained', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openCart();
    await cart.continueShopping();
    await inventory.expectLoaded();
    expect(await inventory.badgeCount()).toBe(1);
  });

  test('TC-CART-008: Checkout proceeds to the information page', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openCart();
    await cart.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('TC-CART-010: cart persists across navigation', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.openProductByName(PRODUCTS.backpack.name);
    await inventory.page.locator('[data-test="back-to-products"]').click();
    await inventory.openCart();
    await expect(cart.items).toHaveCount(2);
  });

  test('TC-CART-011: item name links to the product detail page', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openCart();
    await page.locator('.cart_item .inventory_item_name').click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(PRODUCTS.backpack.name);
  });
});

/**
 * TC-CART-009 — empty-cart checkout (BUG-002).
 * A real store should block checkout with an empty cart, but SauceDemo completes a $0 order.
 * This asserts the CORRECT behavior (Finish should not be reachable / order should not complete)
 * and is marked as an expected failure to document the defect.
 * See ../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md
 */
test.describe('SauceDemo — Cart (known defect)', () => {
  test('TC-CART-009: empty cart should not complete an order [BUG-002]', async ({ page }) => {
    test.fail(true, 'BUG-002: empty cart can be checked out to a completed $0 order');
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await inventory.expectLoaded();
    await inventory.openCart();

    // Cart is empty here.
    await cart.checkout();
    await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkout.continue();
    await checkout.finish();

    // Expected (correct) behavior: an empty cart should NOT reach the confirmation page.
    await expect(page).not.toHaveURL(/checkout-complete\.html/); // expected to fail
  });
});
