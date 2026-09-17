# Test Cases: SauceDemo — Login

| Field | Value |
|-------|-------|
| **Module** | Authentication / Login |
| **Related plan** | [TP-001](../test-plans/TP-001-saucedemo.md) |
| **URL** | https://www.saucedemo.com |
| **Credentials** | Users: `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user` · Password: `secret_sauce` |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** Browser open at the login page; no active session (logged out).

> **Executed 2026-09-17 — all cases passed.** See [TER-001](RESULTS-2026-09-17-login-catalog.md). Error messages below use the exact live wording (each is prefixed with "Epic sadface: ").

---

### TC-LOGIN-001 — Valid login (standard_user)
**Priority:** High · **Technique:** Positive / happy path
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `standard_user` | Value accepted in field |
| 2 | Enter password | `secret_sauce` | Value masked in field |
| 3 | Click **Login** | — | Redirects to `/inventory.html`; product catalog is displayed |

---

### TC-LOGIN-002 — Locked-out user is blocked
**Priority:** High · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `locked_out_user` | Value accepted |
| 2 | Enter password | `secret_sauce` | Value masked |
| 3 | Click **Login** | — | Login rejected; error: "Epic sadface: Sorry, this user has been locked out." User stays on login page |

---

### TC-LOGIN-003 — Invalid password
**Priority:** High · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `standard_user` | Value accepted |
| 2 | Enter password | `wrong_password` | Value masked |
| 3 | Click **Login** | — | Error: "Epic sadface: Username and password do not match any user in this service". No redirect |

---

### TC-LOGIN-004 — Non-existent username
**Priority:** Medium · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `unknown_user` | Value accepted |
| 2 | Enter password | `secret_sauce` | Value masked |
| 3 | Click **Login** | — | Error: "Epic sadface: Username and password do not match any user in this service". No redirect |

---

### TC-LOGIN-005 — Empty username
**Priority:** High · **Technique:** Negative / required-field validation
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Leave username blank | (empty) | — |
| 2 | Enter password | `secret_sauce` | Value masked |
| 3 | Click **Login** | — | Error: "Epic sadface: Username is required". No redirect |

---

### TC-LOGIN-006 — Empty password
**Priority:** High · **Technique:** Negative / required-field validation
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `standard_user` | Value accepted |
| 2 | Leave password blank | (empty) | — |
| 3 | Click **Login** | — | Error: "Epic sadface: Password is required". No redirect |

---

### TC-LOGIN-007 — Both fields empty
**Priority:** Medium · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Leave both fields blank | (empty) | — |
| 2 | Click **Login** | — | Error: "Epic sadface: Username is required" (username validated first) |

---

### TC-LOGIN-008 — Error message can be dismissed
**Priority:** Low · **Technique:** UI
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Trigger any login error | e.g. TC-LOGIN-003 | Error banner appears with an "x" button |
| 2 | Click the **x** on the error banner | — | Error banner is dismissed; fields remain |

---

### TC-LOGIN-009 — Password field masks input
**Priority:** Medium · **Technique:** UI / security-adjacent
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Type into the password field | `secret_sauce` | Characters render as dots/asterisks, not plain text |

---

### TC-LOGIN-010 — Session required to reach inventory directly
**Priority:** Medium · **Technique:** Negative / access control
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | While logged out, navigate directly to `/inventory.html` | URL | Access denied; redirected to login: "Epic sadface: You can only access '/inventory.html' when you are logged in." |

---

### TC-LOGIN-011 — Logout ends session
**Priority:** High · **Technique:** Positive
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Log in as `standard_user` | valid creds | Inventory page shown |
| 2 | Open hamburger menu → **Logout** | — | Returns to login page |
| 3 | Press browser Back | — | Does **not** restore the session; stays on/returns to login |

---

## Notes
- `problem_user` may exhibit intentional defects on downstream pages — login itself should still succeed. Confirm baseline behavior with `standard_user`.
- Exact error-message text should be verified against the live app during execution and updated here if it differs.
