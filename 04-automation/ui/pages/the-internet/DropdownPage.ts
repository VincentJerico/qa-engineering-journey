import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — Dropdown (/dropdown). */
export class DropdownPage {
  readonly page: Page;
  readonly select: Locator;

  constructor(page: Page) {
    this.page = page;
    this.select = page.locator('#dropdown');
  }

  async goto() {
    await this.page.goto('/dropdown');
  }

  async selectByLabel(label: string) {
    await this.select.selectOption({ label });
  }

  async selectedLabel(): Promise<string> {
    return this.select.locator('option:checked').innerText();
  }

  optionByLabel(label: string): Locator {
    return this.select.locator('option', { hasText: label });
  }
}
