# Test Cases: SauceDemo — Product Catalog

| Field | Value |
|-------|-------|
| **Module** | Product Catalog / Inventory |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **URL** | https://www.saucedemo.com/inventory.html |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** Logged in as `standard_user` (unless a case states otherwise); inventory page displayed.

---

### TC-CAT-001 — Catalog displays all products
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Observe the inventory page | Six products are listed |
| 2 | Check each product card | Each shows an image, name, description, price, and an **Add to cart** button |

---

### TC-CAT-002 — Sort by Name (A → Z)
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Open the sort dropdown | Options: Name (A–Z), Name (Z–A), Price (low→high), Price (high→low) |
| 2 | Select **Name (A to Z)** | Products reorder alphabetically ascending (e.g. "Sauce Labs Backpack" first) |

---

### TC-CAT-003 — Sort by Name (Z → A)
**Priority:** Medium · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select **Name (Z to A)** from the sort dropdown | Products reorder alphabetically descending (e.g. "Test.allTheThings() T-Shirt (Red)" first) |

---

### TC-CAT-004 — Sort by Price (low → high)
**Priority:** High · **Technique:** Positive / ordering
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select **Price (low to high)** | Products ordered by ascending price; lowest-priced item appears first |
| 2 | Verify the price sequence | Each subsequent price ≥ the previous |

---

### TC-CAT-005 — Sort by Price (high → low)
**Priority:** Medium · **Technique:** Positive / ordering
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select **Price (high to low)** | Products ordered by descending price; highest-priced item first |
| 2 | Verify the price sequence | Each subsequent price ≤ the previous |

---

### TC-CAT-006 — Sort selection persists visually
**Priority:** Low · **Technique:** UI
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select any non-default sort option | List reorders |
| 2 | Observe the dropdown label | It reflects the currently selected sort option |

---

### TC-CAT-007 — Add single item to cart from catalog
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Add to cart** on any product | Button label changes to **Remove** |
| 2 | Observe the cart icon | Cart badge shows **1** |

---

### TC-CAT-008 — Remove item from cart via catalog
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | With an item added (TC-CAT-007), click **Remove** on that product | Button reverts to **Add to cart** |
| 2 | Observe the cart badge | Count decrements; badge disappears when count is 0 |

---

### TC-CAT-009 — Add multiple items updates badge count
**Priority:** High · **Technique:** Positive / boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add three different products to the cart | Each button changes to **Remove** |
| 2 | Observe the cart badge | Badge shows **3** |

---

### TC-CAT-010 — Open product detail page
**Priority:** Medium · **Technique:** Positive / navigation
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click a product's name or image | Product detail page opens with matching name, description, price, and image |
| 2 | Click **Back to products** | Returns to the inventory list |

---

### TC-CAT-011 — Cart state persists after viewing a product
**Priority:** Medium · **Technique:** Positive / state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add a product to the cart from the list | Badge shows 1 |
| 2 | Open that product's detail page, then return | Item remains in cart; button still shows **Remove**; badge still shows 1 |

---

### TC-CAT-012 — Catalog renders for problem_user (defect probe)
**Priority:** Medium · **Technique:** Exploratory / negative
| # | Step | Expected Result (baseline) | Note |
|---|------|-----------------------------|------|
| 1 | Log in as `problem_user` and view the catalog | Compare against `standard_user` | `problem_user` is expected to show intentional defects (e.g. wrong/identical images). Log any deviation as a bug and reference the baseline |

---

## Notes
- Product count (6) and specific product names/prices should be confirmed against the live app at execution time and updated if SauceDemo changes.
- Cart-page and checkout behaviors are covered in separate case files (TC-CART, TC-CHECKOUT) per TP-001.
