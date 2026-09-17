# Test Cases: The Internet — Dropdown

| Field | Value |
|-------|-------|
| **Module** | Dropdown (`/dropdown`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/dropdown |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/dropdown` page. A single `<select>` is present.

---

### TC-TI-DD-001 — Default selected option
**Priority:** High · **Technique:** Positive / initial state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Observe the dropdown on load | "Please select an option" is shown as the default (placeholder) |

---

### TC-TI-DD-002 — Dropdown lists the available options
**Priority:** Medium · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Open the dropdown | Options present: "Please select an option" (disabled placeholder), "Option 1", "Option 2" |

---

### TC-TI-DD-003 — Select Option 1
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select "Option 1" | "Option 1" becomes the selected value |

---

### TC-TI-DD-004 — Select Option 2
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select "Option 2" | "Option 2" becomes the selected value |

---

### TC-TI-DD-005 — Change selection between options
**Priority:** Medium · **Technique:** State transition
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Select "Option 1", then "Option 2" | Selection updates each time; only one option selected at a time |

---

### TC-TI-DD-006 — Placeholder option is not selectable
**Priority:** Low · **Technique:** Negative / boundary
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Attempt to re-select "Please select an option" after choosing a real option | The placeholder is disabled; it cannot be chosen as a value |

---

## Notes
- Selection is reflected by the `<select>` element's value / the option's `selected` state.
- Confirm the placeholder is `disabled` against the live app at execution.
