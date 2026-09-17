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

  async states(): Promise<boolean[]> {
    const count = await this.checkboxes.count();
    const result: boolean[] = [];
    for (let i = 0; i < count; i++) result.push(await this.checkboxes.nth(i).isChecked());
    return result;
  }
}
