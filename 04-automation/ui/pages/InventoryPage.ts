import { type Page, type Locator, expect } from '@playwright/test';

/** Page object for the SauceDemo inventory / product catalog page. */
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.items = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.sortSelect = page.locator('.product_sort_container');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  addToCart(productId: string) {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  removeFromCart(productId: string) {
    return this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(value);
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  /** Prices as numbers, in current display order. */
  async prices(): Promise<number[]> {
    const raw = await this.itemPrices.allTextContents();
    return raw.map((p) => parseFloat(p.replace('$', '')));
  }

  async badgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return parseInt(await this.cartBadge.innerText(), 10);
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  openProductByName(name: string) {
    return this.page.locator('.inventory_item_name', { hasText: name }).click();
  }
}
