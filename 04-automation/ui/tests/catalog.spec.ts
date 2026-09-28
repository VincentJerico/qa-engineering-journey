import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { USERS, PASSWORD, PRODUCTS } from '../pages/testData.js';

const NAMES_A_TO_Z = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];
const PRICES_LOW_TO_HIGH = ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'];

/**
 * Catalog suite — automates TC-CAT-001..012.
 * Manual cases: ../../01-manual-testing/test-cases/TC-CATALOG-saucedemo.md
 */
test.describe('SauceDemo — Product Catalog', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    inventory = new InventoryPage(page);
    await login.goto();
    await login.login(USERS.standard, PASSWORD);
    await inventory.expectLoaded();
  });

  test('TC-CAT-001: all six products display', async () => {
    await expect(inventory.items).toHaveCount(6);
    await expect(inventory.itemNames).toHaveCount(6);
    await expect(inventory.itemPrices).toHaveCount(6);
  });

  test('TC-CAT-002: sort Name A to Z', async () => {
    await inventory.sortBy('za');
    await expect(inventory.itemNames).toHaveText([...NAMES_A_TO_Z].reverse());
    await inventory.sortBy('az');
    await expect(inventory.itemNames).toHaveText(NAMES_A_TO_Z);
  });

  test('TC-CAT-003: sort Name Z to A', async () => {
    await inventory.sortBy('za');
    await expect(inventory.itemNames).toHaveText([...NAMES_A_TO_Z].reverse());
  });

  test('TC-CAT-004: sort Price low to high', async () => {
    await inventory.sortBy('lohi');
    await expect(inventory.itemPrices).toHaveText(PRICES_LOW_TO_HIGH);
  });

  test('TC-CAT-005: sort Price high to low', async () => {
    await inventory.sortBy('hilo');
    await expect(inventory.itemPrices).toHaveText([...PRICES_LOW_TO_HIGH].reverse());
  });

  test('TC-CAT-006: sort dropdown reflects the selection', async () => {
    await inventory.sortBy('hilo');
    await expect(inventory.sortSelect).toHaveValue('hilo');
  });

  test('TC-CAT-007: add a single item updates button and badge', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await expect(page.locator(`[data-test="remove-${PRODUCTS.backpack.id}"]`)).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('TC-CAT-008: remove an item from the catalog', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.removeFromCart(PRODUCTS.backpack.id);
    await expect(page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.id}"]`)).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('TC-CAT-009: adding multiple items updates the badge count', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.addToCart(PRODUCTS.boltTShirt.id);
    await expect(inventory.cartBadge).toHaveText('3');
  });

  test('TC-CAT-010: open product detail and return to list', async ({ page }) => {
    await inventory.openProductByName(PRODUCTS.backpack.name);
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(PRODUCTS.backpack.name);
    await page.locator('[data-test="back-to-products"]').click();
    await inventory.expectLoaded();
  });

  test('TC-CAT-011: cart state persists across a product detail view', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.openProductByName(PRODUCTS.backpack.name);
    await expect(page.locator(`[data-test="remove-${PRODUCTS.backpack.id}"]`)).toBeVisible();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(inventory.cartBadge).toHaveText('1');
  });
});

/**
 * TC-CAT-012 — problem_user defect probe (BUG-001).
 * All product images should be distinct (baseline: standard_user shows 6 unique images),
 * but problem_user renders the same image for every product. This test asserts that CURRENT
 * buggy behavior, so it goes red when the bug is fixed and on any unrelated failure.
 * See ../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md
 */
test.describe('SauceDemo — Catalog (known defect)', () => {
  test('TC-CAT-012: problem_user shows one image for every product [BUG-001]', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'BUG-001: problem_user shows identical images for all products',
    });
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.goto();
    await login.login(USERS.problem, PASSWORD);
    await inventory.expectLoaded();
    const images = page.locator('.inventory_item_img img');
    await expect(images).toHaveCount(6); // guard: images actually loaded
    const srcs = await images.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    expect(new Set(srcs).size).toBe(1);
  });
});
