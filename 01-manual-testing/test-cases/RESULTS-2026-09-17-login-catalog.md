# Test Execution Report — Login & Catalog

| Field | Value |
|-------|-------|
| **Report ID** | TER-001 |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **Suites executed** | [Login](TC-LOGIN-saucedemo.md), [Catalog](TC-CATALOG-saucedemo.md) |
| **Application** | SauceDemo — https://www.saucedemo.com |
| **Tester** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Environment** | Chrome (built-in browser pane), desktop viewport |

## Summary
| Metric | Count |
|--------|------:|
| Total cases | 23 |
| Passed | 22 |
| Failed | 0 |
| Defects found | 1 (via TC-CAT-012 — behaving as designed) |

All planned login and catalog cases executed. No functional failures in core flows.
One intentional defect surfaced under `problem_user` (see [BUG-001](../bug-reports/BUG-001-problem-user-identical-images.md)).

## Login results
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-LOGIN-001 | Valid login (standard_user) | ✅ Pass | Redirects to `/inventory.html`, "Products" title, 6 items |
| TC-LOGIN-002 | Locked-out user blocked | ✅ Pass | "Epic sadface: Sorry, this user has been locked out." |
| TC-LOGIN-003 | Invalid password | ✅ Pass | "Epic sadface: Username and password do not match..." |
| TC-LOGIN-004 | Non-existent username | ✅ Pass | Same generic mismatch message (good — no user enumeration) |
| TC-LOGIN-005 | Empty username | ✅ Pass | "Epic sadface: Username is required" |
| TC-LOGIN-006 | Empty password | ✅ Pass | "Epic sadface: Password is required" |
| TC-LOGIN-007 | Both fields empty | ✅ Pass | Username validated first |
| TC-LOGIN-008 | Dismiss error banner | ✅ Pass | "x" clears the banner |
| TC-LOGIN-009 | Password masked | ✅ Pass | Field is `type="password"` |
| TC-LOGIN-010 | Direct URL access when logged out | ✅ Pass | Redirects to login: "...only access '/inventory.html' when you are logged in." |
| TC-LOGIN-011 | Logout ends session | ✅ Pass | Back button does not restore session; shows access error |

**Observation:** every error message is prefixed with **"Epic sadface: "**. The test cases have been
updated to reflect the exact live wording.

**Positive security note (TC-LOGIN-004):** a non-existent username returns the *same* generic
message as a wrong password — no user enumeration. Good behavior, worth keeping in mind for the
security-testing section.

## Catalog results
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-CAT-001 | All products display | ✅ Pass | 6 products; each has image, name, desc, price, Add-to-cart |
| TC-CAT-002 | Sort Name A→Z | ✅ Pass | Default order; Backpack first |
| TC-CAT-003 | Sort Name Z→A | ✅ Pass | "Test.allTheThings()..." first, Backpack last |
| TC-CAT-004 | Sort Price low→high | ✅ Pass | $7.99 → $49.99 ascending |
| TC-CAT-005 | Sort Price high→low | ✅ Pass | $49.99 → $7.99 descending |
| TC-CAT-006 | Sort label reflects selection | ✅ Pass | Dropdown shows active option |
| TC-CAT-007 | Add single item | ✅ Pass | Button → "Remove", badge = 1 |
| TC-CAT-008 | Remove item from catalog | ✅ Pass | Badge decrements, button reverts |
| TC-CAT-009 | Add multiple items | ✅ Pass | Badge = 3 for three items |
| TC-CAT-010 | Open product detail | ✅ Pass | Matching name/price/image; "Back to products" returns to list |
| TC-CAT-011 | Cart persists across detail view | ✅ Pass | Badge and "Remove" state retained |
| TC-CAT-012 | problem_user defect probe | ⚠️ Defect found | All 6 images identical (`sl-404.jpg`); baseline `standard_user` shows 6 distinct images → [BUG-001](../bug-reports/BUG-001-problem-user-identical-images.md) |

## Defects raised
- [BUG-001](../bug-reports/BUG-001-problem-user-identical-images.md) — Product images identical under `problem_user`.

## Baseline data captured (standard_user)
| Product | Price |
|---------|------:|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |
