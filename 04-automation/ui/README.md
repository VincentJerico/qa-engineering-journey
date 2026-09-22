# UI Automation (Playwright)

Automated UI tests for two practice apps, converted from the manual test cases. Each test title
carries its manual case ID (e.g. `TC-LOGIN-001`, `TC-TI-LOGIN-001`) for traceability.

| App                                                | Manual plan                                                         | Playwright project | baseURL                            |
| -------------------------------------------------- | ------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| [SauceDemo](https://www.saucedemo.com)             | [TP-001](../../01-manual-testing/test-plans/TP-001-saucedemo.md)    | `saucedemo`        | https://www.saucedemo.com          |
| [The Internet](https://the-internet.herokuapp.com) | [TP-002](../../01-manual-testing/test-plans/TP-002-the-internet.md) | `the-internet`     | https://the-internet.herokuapp.com |

## Stack

- [Playwright Test](https://playwright.dev) + TypeScript
- Page Object Model (`pages/`) with per-app subfolders and shared test data
- Two Playwright **projects**, each with its own `baseURL` (see `playwright.config.ts`)

## Setup

```bash
cd 04-automation/ui
npm install
npm run install:browsers   # downloads Chromium
```

## Run

```bash
npm test                              # headless, both apps
npx playwright test --project=saucedemo
npx playwright test --project=the-internet
npm run test:headed                   # watch it run in a browser
npm run test:ui                       # Playwright UI mode
npm run report                        # open the last HTML report
```

## Structure

```
ui/
├── playwright.config.ts          # two projects, each with its own baseURL
├── pages/
│   ├── LoginPage.ts              # SauceDemo (TP-001) page objects
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── testData.ts
│   └── the-internet/            # The Internet (TP-002) page objects
│       ├── LoginPage.ts  CheckboxesPage.ts  DropdownPage.ts
│       ├── AddRemovePage.ts  JsAlertsPage.ts  DynamicLoadingPage.ts
│       ├── InputsPage.ts  testData.ts
└── tests/
    ├── login.spec.ts            # SauceDemo: TC-LOGIN-001..011
    ├── catalog.spec.ts          #           TC-CAT-001..012
    ├── cart.spec.ts             #           TC-CART-001..011
    ├── checkout.spec.ts         #           TC-CHK-001..013
    └── the-internet/            # The Internet: TC-TI-* (44 specs)
        ├── login.spec.ts  checkboxes.spec.ts  dropdown.spec.ts
        ├── add-remove.spec.ts  js-alerts.spec.ts
        ├── dynamic-loading.spec.ts  inputs.spec.ts
```

## Known-defect tests

Two tests document confirmed bugs and are marked `test.fail()` — they assert the _correct_ behavior,
so Playwright expects them to fail until the bug is fixed (a green `test.fail()` means "still broken";
if it ever passes, Playwright flags it, telling you the bug was fixed):

- `TC-CAT-012` → [BUG-001](../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md) (problem_user identical images)
- `TC-CART-009` → [BUG-002](../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md) (empty-cart checkout)

## Notes

- Tests run against the live public site, so results depend on it being reachable and unchanged.
- `node_modules/`, `playwright-report/`, and `test-results/` are git-ignored (see repo root `.gitignore`).
