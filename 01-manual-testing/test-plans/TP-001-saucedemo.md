# Test Plan: SauceDemo Web Application

| Field | Value |
|-------|-------|
| **Plan ID** | TP-001 |
| **Application** | SauceDemo (Swag Labs) |
| **URL** | https://www.saucedemo.com |
| **Version / Env** | Production demo, latest |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Status** | Draft |

---

## 1. Introduction
SauceDemo (Swag Labs) is a demo e-commerce application used for QA practice. It provides a
login screen, a product catalog, a shopping cart, and a checkout flow. This plan defines the
scope, approach, and criteria for a manual test effort covering its core user journeys.

## 2. Objectives
- Verify users can authenticate and that invalid/locked accounts are handled correctly.
- Verify the product catalog displays and sorts correctly.
- Verify cart operations (add, remove, badge count) behave as expected.
- Verify the checkout flow completes and validates input.
- Confirm logout and navigation behave correctly.

## 3. Scope

### 3.1 In scope
- Login / authentication (valid, invalid, locked-out user)
- Product listing and sorting (name A–Z / Z–A, price low→high / high→low)
- Add to cart / remove from cart, cart badge count
- Cart page contents and quantities
- Checkout: customer info form, overview totals, order completion
- Logout via the hamburger menu
- Basic UI/layout checks on the above pages

### 3.2 Out of scope
- Performance, load, and stress testing
- Security/penetration testing
- API-level testing (covered separately under `03-api-testing/`)
- Cross-browser matrix beyond the browsers listed below
- Payment gateway integration (SauceDemo does not process real payments)

## 4. Test Approach
Manual, black-box functional testing driven by test cases derived from the requirements above.
Techniques applied: **equivalence partitioning** and **boundary value analysis** for form inputs,
**decision tables** for login combinations, and **exploratory testing** for the checkout flow.
Defects are logged in `01-manual-testing/bug-reports/` using the standard bug-report template.

### 4.1 Test users (provided by SauceDemo)
| Username | Purpose |
|----------|---------|
| `standard_user` | Happy-path baseline |
| `locked_out_user` | Verify locked-account handling |
| `problem_user` | Surface UI/data defects |
| `performance_glitch_user` | Observe slow/degraded behavior |
| Password (all) | `secret_sauce` |

## 5. Test Environment
- **OS:** macOS
- **Browsers:** Chrome (primary), Firefox (secondary)
- **Screen sizes:** Desktop (1440px); spot-check mobile viewport (375px)
- **Tools:** Browser DevTools, bug-report template, this repository for documentation

## 6. Test Deliverables
- This test plan (`TP-001-saucedemo.md`)
- Test cases in `01-manual-testing/test-cases/`
- Bug reports in `01-manual-testing/bug-reports/`
- A checklist in `01-manual-testing/checklists/` for regression passes
- Exploratory testing notes/charters in `01-manual-testing/exploratory-testing/`

## 7. Entry Criteria
- Application URL is reachable.
- Test users and credentials are available.
- Test cases for the in-scope areas are drafted.

## 8. Exit Criteria
- All planned test cases executed.
- No open **Critical** or **High** severity defects in core flows (login, cart, checkout).
- Results and any defects documented in the repository.

## 9. Risks & Assumptions
- **Risk:** SauceDemo is a shared public demo; behavior may change without notice.
  **Mitigation:** re-baseline tests when unexpected changes appear.
- **Risk:** `problem_user` intentionally exhibits defects, which can be confused with real bugs.
  **Mitigation:** always confirm expected behavior against `standard_user` first.
- **Assumption:** No account-specific data persists between sessions.

## 10. Schedule (indicative)
| Activity | Target |
|----------|--------|
| Draft test cases | Day 1 |
| Execute login & catalog cases | Day 1 |
| Execute cart & checkout cases | Day 2 |
| Log defects & regression checklist | Day 2 |

## 11. Follow-up
- Next practice target after SauceDemo: **The Internet** (https://the-internet.herokuapp.com)
  — will get its own plan (`TP-002`) focused on edge-case UI scenarios.
