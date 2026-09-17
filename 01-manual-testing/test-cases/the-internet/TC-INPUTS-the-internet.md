# Test Cases: The Internet — Inputs

| Field | Value |
|-------|-------|
| **Module** | Inputs (`/inputs`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/inputs |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/inputs` page. A single number input (`<input type="number">`)
is present.

---

### TC-TI-IN-001 — Accepts a positive integer
**Priority:** High · **Technique:** Positive / equivalence
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Type into the input | `42` | Value `42` accepted |

---

### TC-TI-IN-002 — Accepts a negative number
**Priority:** Medium · **Technique:** Equivalence / boundary
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Type into the input | `-15` | Value `-15` accepted |

---

### TC-TI-IN-003 — Accepts a decimal value
**Priority:** Medium · **Technique:** Equivalence
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Type into the input | `3.14` | Value `3.14` accepted |

---

### TC-TI-IN-004 — Rejects / ignores non-numeric characters
**Priority:** High · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Type letters into the input | `abc` | Letters are not entered; field remains empty (number input ignores non-numeric text) |

---

### TC-TI-IN-005 — Up arrow increments the value
**Priority:** Medium · **Technique:** Boundary / keyboard
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter `5`, then press **ArrowUp** | `5` → | Value increments to `6` |

---

### TC-TI-IN-006 — Down arrow decrements the value
**Priority:** Medium · **Technique:** Boundary / keyboard
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter `5`, then press **ArrowDown** | `5` → | Value decrements to `4` |

---

### TC-TI-IN-007 — Large number handling
**Priority:** Low · **Technique:** Boundary
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter a very large number | `999999999999` | Document behavior — value accepted without error (no explicit max on this input) |

---

### TC-TI-IN-008 — Scientific / special numeric input
**Priority:** Low · **Technique:** Exploratory
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter values like `1e3` or `+7` | `1e3`, `+7` | Document behavior — HTML number inputs accept some special numeric forms; confirm at execution |

---

## Notes
- `<input type="number">` behavior is browser-enforced; results may differ slightly across browsers.
- TC-TI-IN-007 and TC-TI-IN-008 are behavior-documentation cases — record actual behavior at execution.
