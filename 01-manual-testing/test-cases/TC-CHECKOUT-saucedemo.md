# Test Cases: SauceDemo — Checkout

| Field | Value |
|-------|-------|
| **Module** | Checkout (Information → Overview → Complete) |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **URLs** | `/checkout-step-one.html`, `/checkout-step-two.html`, `/checkout-complete.html` |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** Logged in as `standard_user` with at least one item in the cart, on
the **Checkout: Your Information** page (`/checkout-step-one.html`) unless a case states otherwise.

---

### TC-CHK-001 — Complete checkout happy path
**Priority:** High · **Technique:** Positive / end-to-end
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter First Name | `Vincent` | Accepted |
| 2 | Enter Last Name | `Jerico` | Accepted |
| 3 | Enter Zip/Postal Code | `1000` | Accepted |
| 4 | Click **Continue** | — | Navigates to `/checkout-step-two.html` (overview) |
| 5 | Review the overview | — | Item(s), item total, tax, and total are shown |
| 6 | Click **Finish** | — | Navigates to `/checkout-complete.html`; "Thank you for your order!" message shown |

---

### TC-CHK-002 — First name required
**Priority:** High · **Technique:** Negative / required-field
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Leave First Name blank; fill Last Name and Zip | Last=`Jerico`, Zip=`1000` | — |
| 2 | Click **Continue** | — | Error: "Error: First Name is required" — stays on step one |

---

### TC-CHK-003 — Last name required
**Priority:** High · **Technique:** Negative / required-field
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Fill First Name and Zip; leave Last Name blank | First=`Vincent`, Zip=`1000` | — |
| 2 | Click **Continue** | — | Error: "Error: Last Name is required" — stays on step one |

---

### TC-CHK-004 — Postal code required
**Priority:** High · **Technique:** Negative / required-field
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Fill First and Last Name; leave Zip blank | First=`Vincent`, Last=`Jerico` | — |
| 2 | Click **Continue** | — | Error: "Error: Postal Code is required" — stays on step one |

---

### TC-CHK-005 — Cancel from information page
**Priority:** Medium · **Technique:** Navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the information page, click **Cancel** | Returns to the cart page (`/cart.html`) |
| 2 | Observe the cart | Items are retained |

---

### TC-CHK-006 — Overview shows correct line items
**Priority:** High · **Technique:** Positive / data validation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add known items (e.g. Backpack $29.99, Bike Light $9.99), proceed to overview | Both items listed with correct names and prices |
| 2 | Check "Item total" | Equals the sum of item prices ($39.98) |

---

### TC-CHK-007 — Tax and total are calculated correctly
**Priority:** High · **Technique:** Positive / calculation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the overview page, note Item total, Tax, and Total | Total = Item total + Tax |
| 2 | Verify tax rate | Tax ≈ 8% of item total (e.g. item total $39.98 → tax $3.20 → total $43.18). Confirm against live values |

---

### TC-CHK-008 — Payment and shipping info displayed
**Priority:** Low · **Technique:** UI
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the overview page, review the info panel | Payment Information, Shipping Information, and Price Total sections are displayed |

---

### TC-CHK-009 — Cancel from overview page
**Priority:** Medium · **Technique:** Navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the overview page, click **Cancel** | Returns to the inventory page (`/inventory.html`) |

---

### TC-CHK-010 — Order completion clears the cart
**Priority:** High · **Technique:** Positive / state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Complete an order (through Finish) | Confirmation page shown |
| 2 | Observe the cart badge | Badge is cleared (count 0) — the order emptied the cart |

---

### TC-CHK-011 — Back Home after completion
**Priority:** Medium · **Technique:** Navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the completion page, click **Back Home** | Returns to `/inventory.html` |

---

### TC-CHK-012 — Whitespace-only inputs (input validation)
**Priority:** Medium · **Technique:** Negative / boundary
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter a single space in each required field | First=`" "`, Last=`" "`, Zip=`" "` | Document behavior: SauceDemo may accept whitespace as non-empty and proceed. Flag as a defect if a real store should reject it |

---

### TC-CHK-013 — Numeric name / non-numeric zip (data-type handling)
**Priority:** Low · **Technique:** Exploratory / equivalence
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter numbers in name fields and letters in Zip | First=`123`, Last=`456`, Zip=`abcde` | Document behavior — SauceDemo does not enforce data-type validation; note this as an observation for a real application |

---

> **Executed 2026-09-17 — 11 passed, 2 documented observations.** See [TER-002](RESULTS-2026-09-17-cart-checkout.md). Field errors use the exact live wording (prefixed "Error: ", no trailing period).

## Notes
- Exact error-message text, tax rate, and totals should be confirmed against the live app at
  execution time and updated here if they differ.
- TC-CHK-012 and TC-CHK-013 are behavior-documentation / exploratory cases — record actual behavior
  and raise a bug only where it would matter for a real production store.
