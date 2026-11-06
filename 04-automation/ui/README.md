# UI Automation (Playwright)

Automated UI tests for two practice apps, converted from the manual test cases. Each test title
carries its manual case ID (e.g. `TC-LOGIN-001`, `TC-TI-LOGIN-001`) and a tag with that case's
priority (`@high`, `@medium`, `@low`). The [traceability gate](../../09-ci-cd/traceability/) checks
both in CI.

| App                                                | Manual plan                                                         | Playwright project | baseURL                            |
| -------------------------------------------------- | ------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| [SauceDemo](https://www.saucedemo.com)             | [TP-001](../../01-manual-testing/test-plans/TP-001-saucedemo.md)    | `saucedemo`        | https://www.saucedemo.com          |
| [The Internet](https://the-internet.herokuapp.com) | [TP-002](../../01-manual-testing/test-plans/TP-002-the-internet.md) | `the-internet`     | https://the-internet.herokuapp.com |

## Stack

- [Playwright Test](https://playwright.dev) + TypeScript
- Page Object Model (`pages/`) with per-app subfolders and shared test data
- Page objects injected as **fixtures** ([`fixtures/test.ts`](fixtures/test.ts)), so a test asks for
  `{ cartPage, checkoutPage }` instead of building them
- **Saved login**: the `saucedemo-setup` project logs in `standard_user` once per run and saves the
  session; catalog, cart and checkout specs start from it (`test.use({ storageState })`). Login specs
  and other users start from a clean context
- Locators use `getByTestId()` with `testIdAttribute: 'data-test'`, SauceDemo's own test hooks
- **Priority tags** from the manual cases, for risk-based runs (`npm run test:high`)
- **Flaky policy**: CI retries twice, and `failOnFlakyTests` fails the run if a test only passes on a
  retry
- Two app **projects**, each with its own `baseURL`, plus the setup project (see
  `playwright.config.ts`)

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
npm run test:high                     # only High-priority cases (also test:medium, test:low)
npm run test:headed                   # watch it run in a browser
npm run test:ui                       # Playwright UI mode
npm run report                        # open the last HTML report
```

## Structure

```
ui/
├── playwright.config.ts          # setup + two app projects, tags, flaky policy
├── fixtures/test.ts              # page-object fixtures, saved-session path
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
    ├── saucedemo.setup.ts       # logs in once, saves .auth/standard-user.json (git-ignored)
    ├── login.spec.ts            # SauceDemo: TC-LOGIN-001..011
    ├── catalog.spec.ts          #           TC-CAT-001..012
    ├── cart.spec.ts             #           TC-CART-001..011
    ├── checkout.spec.ts         #           TC-CHK-001..013
    └── the-internet/            # The Internet: TC-TI-* (44 tests)
        ├── login.spec.ts  checkboxes.spec.ts  dropdown.spec.ts
        ├── add-remove.spec.ts  js-alerts.spec.ts
        ├── dynamic-loading.spec.ts  inputs.spec.ts
```

## Known-defect tests

Two tests document confirmed bugs. Each asserts the _current_ buggy behavior and carries an `issue`
annotation naming the bug. Green means "still broken". The test goes red when the bug is fixed, and
also on any unrelated failure (a `test.fail()` would have absorbed that as an expected failure):

- `TC-CAT-012` → [BUG-001](../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md) (problem_user identical images)
- `TC-CART-009` → [BUG-002](../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md) (empty-cart checkout)

## Notes

- Tests run against the live public site, so results depend on it being reachable and unchanged.
- `node_modules/`, `playwright-report/`, and `test-results/` are git-ignored (see repo root `.gitignore`).
