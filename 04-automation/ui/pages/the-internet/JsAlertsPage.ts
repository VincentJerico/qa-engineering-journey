import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — JavaScript Alerts (/javascript_alerts). */
export class JsAlertsPage {
  readonly page: Page;
  readonly alertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertButton = page.getByRole('button', { name: 'Click for JS Alert' });
    this.confirmButton = page.getByRole('button', { name: 'Click for JS Confirm' });
    this.promptButton = page.getByRole('button', { name: 'Click for JS Prompt' });
    this.result = page.locator('#result');
  }

  async goto() {
    await this.page.goto('/javascript_alerts');
  }

  async resultText(): Promise<string> {
    return (await this.result.innerText()).trim();
  }
}
