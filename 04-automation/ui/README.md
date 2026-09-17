# SauceDemo UI Automation (Playwright)

Automated UI tests for [SauceDemo](https://www.saucedemo.com), converted from the manual test cases
in [TP-001](../../01-manual-testing/test-plans/TP-001-saucedemo.md). Each test title carries its
manual case ID (e.g. `TC-LOGIN-001`) for traceability.

## Stack
- [Playwright Test](https://playwright.dev) + TypeScript
- Page Object Model (`pages/`) with shared test data (`pages/testData.ts`)

## Setup
```bash
cd 04-automation/ui
npm install
npm run install:browsers   # downloads Chromium
```

## Run
```bash
npm test                # headless, all specs
npm run test:headed     # watch it run in a browser
npm run test:ui         # Playwright UI mode
npm run report          # open the last HTML report
```

## Structure
```
ui/
├── playwright.config.ts     # baseURL, reporters, browser projects
├── pages/                   # Page Object Model + test data
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── testData.ts
└── tests/
    ├── login.spec.ts        # TC-LOGIN-001..011
    ├── catalog.spec.ts      # TC-CAT-001..012
    ├── cart.spec.ts         # TC-CART-001..011
    └── checkout.spec.ts     # TC-CHK-001..013
```

## Known-defect tests
Two tests document confirmed bugs and are marked `test.fail()` — they assert the *correct* behavior,
so Playwright expects them to fail until the bug is fixed (a green `test.fail()` means "still broken";
if it ever passes, Playwright flags it, telling you the bug was fixed):
- `TC-CAT-012` → [BUG-001](../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md) (problem_user identical images)
- `TC-CART-009` → [BUG-002](../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md) (empty-cart checkout)

## Notes
- Tests run against the live public site, so results depend on it being reachable and unchanged.
- `node_modules/`, `playwright-report/`, and `test-results/` are git-ignored (see repo root `.gitignore`).
