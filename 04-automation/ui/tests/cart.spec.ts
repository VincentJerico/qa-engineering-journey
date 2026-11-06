import { test, expect, STANDARD_USER_STATE } from '../fixtures/test.js';
import { PRODUCTS, CUSTOMER } from '../pages/testData.js';

// Precondition for every case in this file: logged in as standard_user, on the catalog.
test.use({ storageState: STANDARD_USER_STATE });

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await inventoryPage.expectLoaded();
});

/**
 * Cart suite — automates TC-CART-001..011.
 * Manual cases: ../../01-manual-testing/test-cases/TC-CART-saucedemo.md
 */
test.describe('SauceDemo — Shopping Cart', () => {
  test(
    'TC-CART-001: cart icon opens the cart page',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.openCart();
      await cart.expectLoaded();
    },
  );

  test(
    'TC-CART-002: added item appears in the cart',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.openCart();
      await cart.expectLoaded();
      await expect(cart.itemNames).toHaveText([PRODUCTS.backpack.name]);
      expect(await cart.firstQuantity()).toBe('1');
    },
  );

  test(
    'TC-CART-003: multiple items appear with correct count',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.addToCart(PRODUCTS.bikeLight.id);
      await inventory.addToCart(PRODUCTS.boltTShirt.id);
      await inventory.openCart();
      await expect(cart.itemNames).toHaveText([
        PRODUCTS.backpack.name,
        PRODUCTS.bikeLight.name,
        PRODUCTS.boltTShirt.name,
      ]);
    },
  );

  test(
    'TC-CART-004: quantity is fixed at 1 (no editable control)',
    { tag: '@medium' },
    async ({ page, inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.openCart();
      expect(await cart.firstQuantity()).toBe('1');
      await expect(page.locator('.cart_quantity input')).toHaveCount(0);
    },
  );

  test(
    'TC-CART-005: remove an item from the cart page',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.addToCart(PRODUCTS.bikeLight.id);
      await inventory.openCart();
      await expect(cart.items).toHaveCount(2);
      await cart.removeFirst();
      await expect(cart.itemNames).toHaveText([PRODUCTS.bikeLight.name]);
    },
  );

  test(
    'TC-CART-006: removing all items empties the cart',
    { tag: '@medium' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.addToCart(PRODUCTS.bikeLight.id);
      await inventory.openCart();
      await expect(cart.items).toHaveCount(2);
      await expect(inventory.cartBadge).toHaveText('2');
      await cart.removeAll();
      await expect(cart.items).toHaveCount(0);
      await expect(inventory.cartBadge).toHaveCount(0);
    },
  );

  test(
    'TC-CART-007: Continue Shopping returns to inventory with cart retained',
    { tag: '@medium' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.openCart();
      await cart.continueShopping();
      await inventory.expectLoaded();
      await expect(inventory.cartBadge).toHaveText('1');
    },
  );

  test(
    'TC-CART-008: Checkout proceeds to the information page',
    { tag: '@high' },
    async ({ page, inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.openCart();
      await cart.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    },
  );

  test(
    'TC-CART-010: cart persists across navigation',
    { tag: '@medium' },
    async ({ inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.addToCart(PRODUCTS.bikeLight.id);
      await inventory.openProductByName(PRODUCTS.backpack.name);
      await inventory.page.getByTestId('back-to-products').click();
      await inventory.openCart();
      await expect(cart.items).toHaveCount(2);
    },
  );

  test(
    'TC-CART-011: item name links to the product detail page',
    { tag: '@low' },
    async ({ page, inventoryPage: inventory, cartPage: cart }) => {
      await inventory.addToCart(PRODUCTS.backpack.id);
      await inventory.openCart();
      await page.locator('.cart_item .inventory_item_name').click();
      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(page.locator('.inventory_details_name')).toHaveText(PRODUCTS.backpack.name);
    },
  );
});

/**
 * TC-CART-009 — empty-cart checkout (BUG-002).
 * A real store should block checkout with an empty cart, but SauceDemo completes a $0 order.
 * This asserts that CURRENT buggy behavior, so it goes red when the bug is fixed and on any
 * unrelated failure.
 * See ../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md
 */
test.describe('SauceDemo — Cart (known defect)', () => {
  test(
    'TC-CART-009: empty cart completes an order [BUG-002]',
    { tag: '@medium' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'BUG-002: empty cart can be checked out to a completed $0 order',
      });
      await inventory.openCart();
      await expect(cart.items).toHaveCount(0);

      await cart.checkout();
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await checkout.finish();
      await checkout.expectComplete();
    },
  );
});
