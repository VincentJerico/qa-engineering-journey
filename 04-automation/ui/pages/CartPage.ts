import { type Page, type Locator, expect } from '@playwright/test';

/** Page object for the SauceDemo cart page. */
export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.items = page.locator('.cart_item');
    this.itemNames = page.locator('.cart_item .inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  /** Quantity text for the first row (SauceDemo has no editable qty control). */
  async firstQuantity(): Promise<string> {
    return this.page.locator('.cart_quantity').first().innerText();
  }

  removeFirst() {
    return this.items.first().locator('button').click();
  }

  async removeAll() {
    const buttons = this.page.locator('.cart_item button');
    for (let count = await buttons.count(); count > 0; count = await buttons.count()) {
      await buttons.first().click();
      await expect(this.items).toHaveCount(count - 1);
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
