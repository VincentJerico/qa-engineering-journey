import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — Add/Remove Elements (/add_remove_elements/). */
export class AddRemovePage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button[onclick="addElement()"]');
    this.deleteButtons = page.locator('.added-manually');
  }

  async goto() {
    await this.page.goto('/add_remove_elements/');
  }

  async add(times = 1) {
    for (let i = 0; i < times; i++) await this.addButton.click();
  }

  async deleteFirst() {
    await this.deleteButtons.first().click();
  }

  async deleteAll() {
    for (let n = await this.deleteButtons.count(); n > 0; n = await this.deleteButtons.count()) {
      await this.deleteButtons.first().click();
    }
  }
}
