# Playwright Patterns — Lessons Learned

Practical notes captured while automating SauceDemo, The Internet, and Restful-Booker.

## Use web-first (auto-retrying) assertions
Prefer `await expect(locator).toHaveCount(3)` over `expect(await locator.count()).toBe(3)`.
- The web-first form **retries** until the condition is met or times out; the one-shot form reads
  once and fails on timing races.
- **Real bug I hit:** cart item counts read `0` right after navigation because the page hadn't
  rendered yet. Switching to `toHaveCount` fixed 4 flaky tests. Same idea for visibility:
  `toBeVisible()`, `toBeHidden()`, `toBeAttached()`.

## Page Object Model (POM)
- One class per page/area; expose intent-level methods (`login()`, `addToCart(id)`), keep selectors inside.
- Organize by app when a repo covers several: `pages/`, `pages/the-internet/`.
- Multiple apps in one project → use Playwright **projects** with per-app `baseURL` and `testDir`.

## Documenting known bugs with `test.fail()`
- Assert the *correct* behavior and mark `test.fail()`. While the bug exists the test "passes"
  (fails as expected); when it's fixed Playwright flags an unexpected pass → your signal to close it.
- Used for [BUG-001] (images) and [BUG-002] (empty-cart checkout) in the SauceDemo suite.

## Native dialogs (alert / confirm / prompt)
- They block the page — don't try to click them as DOM. Register a handler first:
  ```ts
  page.once('dialog', d => d.accept('Hello'));   // or d.dismiss()
  await promptButton.click();
  ```

## Waiting for async content
- Never use fixed `sleep`. Wait on the outcome: `await expect(finish).toBeVisible({ timeout: 10_000 })`.
- Distinguish **present-but-hidden** (`toBeHidden`) from **not-in-DOM** (`toHaveCount(0)`) — they need
  different assertions (The Internet's Dynamic Loading examples 1 vs 2).

## API testing with Playwright's `request` fixture
- No browser needed → no `playwright install`, faster CI.
- Chain a lifecycle with `test.describe.serial` (create → read → update → delete → verify).
- Assert **side effects** for negative cases (record unchanged / still present), not just status codes.

## Traceability
- Put the manual case ID in each test title (`TC-LOGIN-001`, `SC-API-011`) so automation maps back
  to the plan.

[BUG-001]: ../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md
[BUG-002]: ../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md
