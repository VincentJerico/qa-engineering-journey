import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — Checkboxes (/checkboxes). */
export class CheckboxesPage {
  readonly page: Page;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkboxes = page.locator('#checkboxes input[type="checkbox"]');
  }

  async goto() {
    await this.page.goto('/checkboxes');
  }

  nth(i: number): Locator {
    return this.checkboxes.nth(i);
  }
}
