import { type Page, type Locator } from '@playwright/test';

/** Page object for The Internet — Inputs (/inputs). */
export class InputsPage {
  readonly page: Page;
  readonly input: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator('input[type="number"]');
  }

  async goto() {
    await this.page.goto('/inputs');
  }

  /** Clear then type via the keyboard so native number-input filtering applies. */
  async typeValue(text: string) {
    await this.input.click();
    await this.input.clear();
    await this.input.pressSequentially(text);
  }

  async value(): Promise<string> {
    return this.input.inputValue();
  }

  async press(key: string) {
    await this.input.press(key);
  }
}
