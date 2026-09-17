# Test Cases: The Internet — Add/Remove Elements

| Field | Value |
|-------|-------|
| **Module** | Add/Remove Elements (`/add_remove_elements/`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/add_remove_elements/ |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/add_remove_elements/` page. An **Add Element** button is
present; no **Delete** buttons exist initially.

---

### TC-TI-AR-001 — Add a single element
**Priority:** High · **Technique:** Positive / state transition
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Add Element** | One **Delete** button appears |

---

### TC-TI-AR-002 — Add multiple elements
**Priority:** High · **Technique:** Positive / boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Add Element** 5 times | Exactly 5 **Delete** buttons are present |

---

### TC-TI-AR-003 — Remove a single element
**Priority:** High · **Technique:** State transition
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add 3 elements | 3 Delete buttons present |
| 2 | Click one **Delete** | 2 Delete buttons remain |

---

### TC-TI-AR-004 — Remove all added elements
**Priority:** Medium · **Technique:** Boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Add 3 elements, then click **Delete** until none remain | 0 Delete buttons; page returns to initial state |

---

### TC-TI-AR-005 — Delete count never goes negative
**Priority:** Low · **Technique:** Boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | With no elements added, confirm there is no Delete button to click | Only **Add Element** is present; nothing to remove |

---

## Notes
- Delete buttons are `button.added-manually`; count them to verify state.
- Each **Add Element** click appends exactly one Delete button.
