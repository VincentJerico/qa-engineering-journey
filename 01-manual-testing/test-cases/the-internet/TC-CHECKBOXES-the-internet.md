# Test Cases: The Internet — Checkboxes

| Field | Value |
|-------|-------|
| **Module** | Checkboxes (`/checkboxes`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/checkboxes |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/checkboxes` page. Two checkboxes are present.

---

### TC-TI-CHK-001 — Default checkbox states
**Priority:** High · **Technique:** Positive / initial state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Observe the two checkboxes on load | Checkbox 1 is **unchecked**; Checkbox 2 is **checked** |

---

### TC-TI-CHK-002 — Check the first checkbox
**Priority:** High · **Technique:** State transition
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click Checkbox 1 | It becomes **checked** |

---

### TC-TI-CHK-003 — Uncheck the second checkbox
**Priority:** High · **Technique:** State transition
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click Checkbox 2 | It becomes **unchecked** |

---

### TC-TI-CHK-004 — Toggle a checkbox twice returns to original state
**Priority:** Medium · **Technique:** State transition / round-trip
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Note Checkbox 1 state (unchecked) | — |
| 2 | Click it twice | Returns to unchecked (original state) |

---

### TC-TI-CHK-005 — Both checkboxes can be checked simultaneously
**Priority:** Medium · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Ensure Checkbox 1 checked and Checkbox 2 checked | Both are checked at the same time (independent state) |

---

### TC-TI-CHK-006 — Both checkboxes can be unchecked simultaneously
**Priority:** Medium · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Ensure Checkbox 1 unchecked and Checkbox 2 unchecked | Both are unchecked at the same time |

---

## Notes
- Checkbox state is reflected by the `checked` property of the `input`, not by any text.
- Confirm the default states against the live app at execution.
