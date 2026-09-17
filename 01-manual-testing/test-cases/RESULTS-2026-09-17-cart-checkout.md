# Test Execution Report — Cart & Checkout

| Field | Value |
|-------|-------|
| **Report ID** | TER-002 |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **Suites executed** | [Cart](TC-CART-saucedemo.md), [Checkout](TC-CHECKOUT-saucedemo.md) |
| **Application** | SauceDemo — https://www.saucedemo.com |
| **Tester** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Environment** | Chrome (built-in browser pane), desktop viewport, `standard_user` |

## Summary
| Metric | Count |
|--------|------:|
| Total cases | 24 |
| Passed | 21 |
| Failed | 0 |
| Defects found | 1 ([BUG-002](../bug-reports/BUG-002-empty-cart-checkout.md)) |
| Observations (behavior documented) | 2 (TC-CHK-012, TC-CHK-013) |

All planned cart and checkout cases executed. Core purchase flow works end-to-end with correct
line items, tax (8%), and totals. One functional defect and two input-validation observations noted.

## Cart results
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-CART-001 | Cart icon opens cart page | ✅ Pass | `/cart.html`, "Your Cart", QTY/Description labels |
| TC-CART-002 | Added item appears | ✅ Pass | Backpack $29.99, QTY 1, badge 1 |
| TC-CART-003 | Multiple items, correct count | ✅ Pass | 3 items, each QTY 1, badge 3 |
| TC-CART-004 | Quantity fixed at 1 | ✅ Pass | QTY is static text; no editable control |
| TC-CART-005 | Remove one item | ✅ Pass | Badge 3 → 2 |
| TC-CART-006 | Remove all empties cart | ✅ Pass | Badge disappears at 0 |
| TC-CART-007 | Continue Shopping | ✅ Pass | Returns to inventory, cart retained |
| TC-CART-008 | Checkout button proceeds | ✅ Pass | → `/checkout-step-one.html` |
| TC-CART-009 | Checkout with empty cart | ⚠️ Defect | Proceeds and completes a **$0 order** → [BUG-002](../bug-reports/BUG-002-empty-cart-checkout.md) |
| TC-CART-010 | Cart persists across navigation | ✅ Pass | Retained through detail view + Continue Shopping |
| TC-CART-011 | Item name links to detail | ✅ Pass | Opens matching product detail |

## Checkout results
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-CHK-001 | Complete checkout happy path | ✅ Pass | "Thank you for your order!" |
| TC-CHK-002 | First name required | ✅ Pass | "Error: First Name is required" |
| TC-CHK-003 | Last name required | ✅ Pass | "Error: Last Name is required" |
| TC-CHK-004 | Postal code required | ✅ Pass | "Error: Postal Code is required" |
| TC-CHK-005 | Cancel from information page | ✅ Pass | Returns to `/cart.html`, item retained |
| TC-CHK-006 | Overview line items | ✅ Pass | Backpack $29.99 + Bike Light $9.99 = item total $39.98 |
| TC-CHK-007 | Tax and total calculation | ✅ Pass | Tax $3.20 (8%), Total $43.18 = $39.98 + $3.20 |
| TC-CHK-008 | Payment/shipping info shown | ✅ Pass | Both panels present |
| TC-CHK-009 | Cancel from overview page | ✅ Pass | Returns to `/inventory.html` |
| TC-CHK-010 | Completion clears the cart | ✅ Pass | Badge cleared after Finish |
| TC-CHK-011 | Back Home after completion | ✅ Pass | Returns to inventory |
| TC-CHK-012 | Whitespace-only inputs | ⚠️ Observation | Single-space values accepted; proceeds to overview (a real store should trim/reject) |
| TC-CHK-013 | Numeric name / non-numeric zip | ⚠️ Observation | Accepted; no data-type validation (expected for this demo) |

**Note on wording:** checkout field errors are prefixed with **"Error: "** (no trailing period).
The checkout cases were updated to match the exact live wording.

## Defects raised
- [BUG-002](../bug-reports/BUG-002-empty-cart-checkout.md) — Empty cart can be checked out to a completed $0 order.

## Observations (not defects for this demo, but relevant for a real store)
- **TC-CHK-012** — whitespace-only names/zip pass required-field validation. In production, inputs
  should be trimmed before the "required" check.
- **TC-CHK-013** — no data-type validation on name or postal code. Acceptable for SauceDemo; worth a
  rule in a real application.

## Verified calculation
```
Item total : $39.98  (29.99 + 9.99)
Tax        : $3.20   (8% of 39.98 = 3.1984 → $3.20)
Total      : $43.18  (39.98 + 3.20)   ✓
```
