# Test Cases: The Internet — JavaScript Alerts

| Field | Value |
|-------|-------|
| **Module** | JavaScript Alerts (`/javascript_alerts`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/javascript_alerts |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/javascript_alerts` page. Three buttons are present:
**Click for JS Alert**, **Click for JS Confirm**, **Click for JS Prompt**. A `#result` element
displays the outcome text.

---

### TC-TI-JS-001 — JS Alert accept
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Click for JS Alert** | A native alert "I am a JS Alert" appears |
| 2 | Accept (OK) | Result text: "You successfully clicked an alert" |

---

### TC-TI-JS-002 — JS Confirm accept (OK)
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Click for JS Confirm** | A native confirm "I am a JS Confirm" appears |
| 2 | Click **OK** | Result text: "You clicked: Ok" |

---

### TC-TI-JS-003 — JS Confirm dismiss (Cancel)
**Priority:** High · **Technique:** Negative
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Click for JS Confirm** | Confirm dialog appears |
| 2 | Click **Cancel** | Result text: "You clicked: Cancel" |

---

### TC-TI-JS-004 — JS Prompt with text entered
**Priority:** High · **Technique:** Positive / data entry
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Click **Click for JS Prompt** | — | A native prompt "I am a JS prompt" appears |
| 2 | Enter text and accept | `Hello QA` | Result text: "You entered: Hello QA" |

---

### TC-TI-JS-005 — JS Prompt cancelled
**Priority:** Medium · **Technique:** Negative
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Click for JS Prompt** | Prompt appears |
| 2 | Cancel the prompt | Result text: "You entered: null" |

---

### TC-TI-JS-006 — JS Prompt accepted with empty input
**Priority:** Low · **Technique:** Boundary
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Click **Click for JS Prompt**, leave input empty, accept | (empty) | Result text: "You entered:" (empty value) — confirm exact behavior at execution |

---

## Notes
- These are **native browser dialogs**, not DOM elements — in automation they are handled via a
  dialog handler (e.g. Playwright's `page.on('dialog', ...)`), not by clicking page elements.
- Confirm exact `#result` wording against the live app at execution.
