import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — Dynamic Loading (/dynamic_loading/{1,2}). */
export class DynamicLoadingPage {
  readonly page: Page;
  readonly startButton: Locator;
  readonly loading: Locator;
  readonly finish: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startButton = page.locator('#start button');
    this.loading = page.locator('#loading');
    this.finish = page.locator('#finish');
  }

  async goto(example: 1 | 2) {
    await this.page.goto(`/dynamic_loading/${example}`);
  }

  async start() {
    await this.startButton.click();
  }
}
