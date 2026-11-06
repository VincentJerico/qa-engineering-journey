import { test, expect, STANDARD_USER_STATE } from '../fixtures/test.js';
import type { CartPage } from '../pages/CartPage.js';
import type { InventoryPage } from '../pages/InventoryPage.js';
import { PRODUCTS, CUSTOMER, TAX_RATE } from '../pages/testData.js';

/**
 * Checkout suite — automates TC-CHK-001..013.
 * Manual cases: ../../01-manual-testing/test-cases/TC-CHECKOUT-saucedemo.md
 */
test.describe('SauceDemo — Checkout', () => {
  // Precondition for every case: logged in as standard_user (saved session).
  test.use({ storageState: STANDARD_USER_STATE });

  /** From the catalog, add the given products and reach the checkout information page. */
  async function startCheckout(inventory: InventoryPage, cart: CartPage, productIds: string[]) {
    await inventory.goto();
    await inventory.expectLoaded();
    for (const id of productIds) await inventory.addToCart(id);
    await inventory.openCart();
    await cart.checkout();
    await expect(inventory.page).toHaveURL(/checkout-step-one\.html/);
  }

  test(
    'TC-CHK-001: complete checkout happy path',
    { tag: '@high' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await expect(page).toHaveURL(/checkout-step-two\.html/);
      await checkout.finish();
      await checkout.expectComplete();
    },
  );

  test(
    'TC-CHK-002: first name required',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation('', CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await expect(checkout.error).toHaveText('Error: First Name is required');
    },
  );

  test(
    'TC-CHK-003: last name required',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, '', CUSTOMER.postalCode);
      await checkout.continue();
      await expect(checkout.error).toHaveText('Error: Last Name is required');
    },
  );

  test(
    'TC-CHK-004: postal code required',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, '');
      await checkout.continue();
      await expect(checkout.error).toHaveText('Error: Postal Code is required');
    },
  );

  test(
    'TC-CHK-005: cancel from the information page returns to cart',
    { tag: '@medium' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.cancel();
      await cart.expectLoaded();
      await expect(cart.items).toHaveCount(1);
    },
  );

  test(
    'TC-CHK-006: overview shows correct line items and item total',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await expect(checkout.itemNames).toHaveText([
        PRODUCTS.backpack.name,
        PRODUCTS.bikeLight.name,
      ]);
      const expectedItemTotal = PRODUCTS.backpack.price + PRODUCTS.bikeLight.price;
      expect(await checkout.itemTotalValue()).toBeCloseTo(expectedItemTotal, 2);
    },
  );

  test(
    'TC-CHK-007: tax and total are calculated correctly (8%)',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      const itemTotal = await checkout.itemTotalValue();
      const tax = await checkout.taxValue();
      const total = await checkout.totalValue();
      expect(tax).toBeCloseTo(Math.round(itemTotal * TAX_RATE * 100) / 100, 2);
      expect(total).toBeCloseTo(itemTotal + tax, 2);
    },
  );

  test(
    'TC-CHK-008: payment and shipping info displayed',
    { tag: '@low' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await expect(page.getByTestId('payment-info-label')).toBeVisible();
      await expect(page.getByTestId('shipping-info-label')).toBeVisible();
    },
  );

  test(
    'TC-CHK-009: cancel from the overview page returns to inventory',
    { tag: '@medium' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await checkout.cancel();
      await expect(page).toHaveURL(/inventory\.html/);
    },
  );

  test(
    'TC-CHK-010: order completion clears the cart',
    { tag: '@high' },
    async ({ inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await checkout.finish();
      await checkout.expectComplete();
      await expect(inventory.cartBadge).toHaveCount(0);
    },
  );

  test(
    'TC-CHK-011: Back Home after completion returns to inventory',
    { tag: '@medium' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await checkout.continue();
      await checkout.finish();
      await checkout.backHomeButton.click();
      await expect(page).toHaveURL(/inventory\.html/);
    },
  );

  // TC-CHK-012 & TC-CHK-013 document permissive input handling (observations, not defects for
  // this demo). They assert SauceDemo's ACTUAL behavior: whitespace-only and wrong-typed values
  // are accepted and the flow proceeds to the overview.
  test(
    'TC-CHK-012: whitespace-only inputs are accepted (documented behavior)',
    { tag: '@medium' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation(' ', ' ', ' ');
      await checkout.continue();
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    },
  );

  test(
    'TC-CHK-013: no data-type validation on name/zip (documented behavior)',
    { tag: '@low' },
    async ({ page, inventoryPage: inventory, cartPage: cart, checkoutPage: checkout }) => {
      await startCheckout(inventory, cart, [PRODUCTS.backpack.id]);
      await checkout.fillInformation('123', '456', 'abcde');
      await checkout.continue();
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    },
  );
});
