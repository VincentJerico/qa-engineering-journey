# Test Cases: The Internet — Dynamic Loading

| Field | Value |
|-------|-------|
| **Module** | Dynamic Loading (`/dynamic_loading`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URLs** | `/dynamic_loading/1` (hidden element), `/dynamic_loading/2` (element rendered after) |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions:** On the relevant Dynamic Loading example page. Each has a **Start** button and a
loading indicator that appears while content loads.

---

### TC-TI-DL-001 — Example 1: element hidden then revealed
**Priority:** High · **Technique:** Async / positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On `/dynamic_loading/1`, click **Start** | A loading bar appears |
| 2 | Wait for loading to finish | Loading bar disappears; text "Hello World!" is displayed |

---

### TC-TI-DL-002 — Example 1: text is hidden before Start
**Priority:** Medium · **Technique:** Initial state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On `/dynamic_loading/1`, before clicking Start | The "Hello World!" element exists in the DOM but is **not visible** (hidden) |

---

### TC-TI-DL-003 — Example 2: element rendered after loading
**Priority:** High · **Technique:** Async / positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On `/dynamic_loading/2`, click **Start** | Loading bar appears |
| 2 | Wait for loading to finish | Text "Hello World!" is **added to the DOM** and displayed |

---

### TC-TI-DL-004 — Example 2: text not in DOM before Start
**Priority:** Medium · **Technique:** Initial state
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | On `/dynamic_loading/2`, before clicking Start | The "Hello World!" element does **not exist** in the DOM yet |

---

### TC-TI-DL-005 — Loading indicator shown during load
**Priority:** Low · **Technique:** UI / timing
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Click **Start** and observe | A loading indicator (`#loading`) is visible while content loads, then hidden |

---

## Notes
- The key distinction: Example 1 = element **present but hidden**; Example 2 = element **not present
  until loaded**. This matters for how each is verified (visibility vs. existence).
- In automation, wait for the result element rather than using fixed sleeps.
