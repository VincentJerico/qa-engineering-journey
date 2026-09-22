import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { USERS, PASSWORD, PRODUCTS } from '../pages/testData.js';

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
    await inventory.sortBy('az');
    const names = await inventory.names();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(names[0]).toBe(PRODUCTS.backpack.name);
  });

  test('TC-CAT-003: sort Name Z to A', async () => {
    await inventory.sortBy('za');
    const names = await inventory.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('TC-CAT-004: sort Price low to high', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-CAT-005: sort Price high to low', async () => {
    await inventory.sortBy('hilo');
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('TC-CAT-006: sort dropdown reflects the selection', async () => {
    await inventory.sortBy('hilo');
    await expect(inventory.sortSelect).toHaveValue('hilo');
  });

  test('TC-CAT-007: add a single item updates button and badge', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await expect(page.locator(`[data-test="remove-${PRODUCTS.backpack.id}"]`)).toBeVisible();
    expect(await inventory.badgeCount()).toBe(1);
  });

  test('TC-CAT-008: remove an item from the catalog', async ({ page }) => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    expect(await inventory.badgeCount()).toBe(1);
    await inventory.removeFromCart(PRODUCTS.backpack.id);
    await expect(page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.id}"]`)).toBeVisible();
    expect(await inventory.badgeCount()).toBe(0);
  });

  test('TC-CAT-009: adding multiple items updates the badge count', async () => {
    await inventory.addToCart(PRODUCTS.backpack.id);
    await inventory.addToCart(PRODUCTS.bikeLight.id);
    await inventory.addToCart(PRODUCTS.boltTShirt.id);
    expect(await inventory.badgeCount()).toBe(3);
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
    expect(await inventory.badgeCount()).toBe(1);
  });
});

/**
 * TC-CAT-012 — problem_user defect probe (BUG-001).
 * All product images should be distinct (baseline: standard_user shows 6 unique images),
 * but problem_user renders the same image for every product. This test asserts the CORRECT
 * behavior and is marked as an expected failure to document the known defect.
 * See ../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md
 */
test.describe('SauceDemo — Catalog (known defect)', () => {
  test('TC-CAT-012: problem_user product images should be distinct [BUG-001]', async ({ page }) => {
    test.fail(true, 'BUG-001: problem_user shows identical images for all products');
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    await login.goto();
    await login.login(USERS.problem, PASSWORD);
    await inventory.expectLoaded();
    const images = page.locator('.inventory_item_img img');
    await expect(images).toHaveCount(6); // guard: images actually loaded
    const srcs = await images.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    const distinct = new Set(srcs);
    expect(distinct.size).toBe(srcs.length); // expected to fail: 1 !== 6
  });
});
