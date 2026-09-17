# Test Cases: SauceDemo — Shopping Cart

| Field | Value |
|-------|-------|
| **Module** | Shopping Cart |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **URL** | https://www.saucedemo.com/cart.html |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** Logged in as `standard_user`; on the inventory page unless a case states otherwise.

---

### TC-CART-001 — Cart icon opens the cart page
**Priority:** High · **Technique:** Positive / navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click the cart icon (top right) | Navigates to `/cart.html`; "Your Cart" heading is shown |
| 2 | Observe column headers | "QTY" and "Description" labels are present |

---

### TC-CART-002 — Added item appears in the cart
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | From inventory, add "Sauce Labs Backpack" to cart | Badge shows 1 |
| 2 | Open the cart | Backpack is listed with its name, description, and price ($29.99) |
| 3 | Check quantity | QTY shows 1 |

---

### TC-CART-003 — Multiple items appear with correct count
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add three different products from inventory | Badge shows 3 |
| 2 | Open the cart | All three items are listed, each with QTY 1 |

---

### TC-CART-004 — Quantity is fixed at 1 per item
**Priority:** Medium · **Technique:** Boundary / known-behavior
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add any item and open the cart | QTY shows 1 |
| 2 | Attempt to change the quantity | No editable quantity control exists; SauceDemo does not support quantity > 1 from the UI |

---

### TC-CART-005 — Remove an item from the cart page
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | With 2 items in the cart, open the cart | Both items listed; badge shows 2 |
| 2 | Click **Remove** on one item | Item disappears from the list; badge decrements to 1 |

---

### TC-CART-006 — Remove all items empties the cart
**Priority:** Medium · **Technique:** Positive / boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Remove every item from the cart | Cart list is empty |
| 2 | Observe the cart badge | Badge is no longer displayed (count 0) |

---

### TC-CART-007 — Continue Shopping returns to inventory
**Priority:** Medium · **Technique:** Navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the cart page, click **Continue Shopping** | Navigates back to `/inventory.html` |
| 2 | Observe the cart | Previously added items and badge count are retained |

---

### TC-CART-008 — Checkout button proceeds to checkout
**Priority:** High · **Technique:** Positive / navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | With at least 1 item in the cart, click **Checkout** | Navigates to `/checkout-step-one.html` (customer information form) |

---

### TC-CART-009 — Checkout with an empty cart
**Priority:** Medium · **Technique:** Negative / exploratory
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Ensure the cart is empty | Badge not shown |
| 2 | Click **Checkout** | Document actual behavior — SauceDemo allows proceeding to the info form even with an empty cart. Note whether this is acceptable; a real store would typically block it |

---

### TC-CART-010 — Cart contents persist across navigation
**Priority:** Medium · **Technique:** State
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add 2 items; go to a product detail page and back | Badge remains 2 |
| 2 | Open the cart | Both items still present with correct details |

---

### TC-CART-011 — Item name links to product detail from cart
**Priority:** Low · **Technique:** Navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On the cart page, click an item's name | Opens that product's detail page with matching details |

---

## Notes
- SauceDemo does not support quantities greater than 1 via the UI (see TC-CART-004).
- TC-CART-009 is a behavior-documentation case — record actual behavior and flag if it differs from a sensible real-world expectation.
