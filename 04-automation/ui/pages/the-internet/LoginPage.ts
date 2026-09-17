import { type Page, type Locator, expect } from '@playwright/test';

/** Page object for The Internet — Form Authentication (/login, /secure). */
export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly flash: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.submit = page.locator('button[type="submit"]');
    this.flash = page.locator('#flash');
    this.logoutButton = page.locator('a[href="/logout"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    if (username) await this.username.fill(username);
    if (password) await this.password.fill(password);
    await this.submit.click();
  }

  /** Flash text without the trailing "×" close glyph. */
  async flashText(): Promise<string> {
    const raw = (await this.flash.innerText()).trim();
    return raw.replace(/\s*×\s*$/, '').trim();
  }

  async expectFlash(message: string) {
    await expect(this.flash).toContainText(message);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
