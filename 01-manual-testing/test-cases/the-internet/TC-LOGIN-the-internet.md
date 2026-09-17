# Test Cases: The Internet — Form Authentication

| Field | Value |
|-------|-------|
| **Module** | Form Authentication (`/login`) |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **URL** | https://the-internet.herokuapp.com/login |
| **Credentials** | `tomsmith` / `SuperSecretPassword!` |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |

**Preconditions (all cases):** On the `/login` page, logged out, unless a case states otherwise.

---

### TC-TI-LOGIN-001 — Valid login
**Priority:** High · **Technique:** Positive
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `tomsmith` | Accepted |
| 2 | Enter password | `SuperSecretPassword!` | Accepted |
| 3 | Click **Login** | — | Redirects to `/secure`; success flash: "You logged into a secure area!" and a **Logout** button is shown |

---

### TC-TI-LOGIN-002 — Invalid username
**Priority:** High · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `wronguser` | Accepted |
| 2 | Enter password | `SuperSecretPassword!` | Accepted |
| 3 | Click **Login** | — | Stays on `/login`; error flash: "Your username is invalid!" |

---

### TC-TI-LOGIN-003 — Invalid password
**Priority:** High · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Enter username | `tomsmith` | Accepted |
| 2 | Enter password | `wrongpass` | Accepted |
| 3 | Click **Login** | — | Stays on `/login`; error flash: "Your password is invalid!" |

---

### TC-TI-LOGIN-004 — Empty credentials
**Priority:** Medium · **Technique:** Negative
| # | Step | Test Data | Expected Result |
|---|------|-----------|-----------------|
| 1 | Leave both fields blank; click **Login** | (empty) | Error flash shown ("Your username is invalid!"); not logged in |

---

### TC-TI-LOGIN-005 — Flash message can be dismissed
**Priority:** Low · **Technique:** UI
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Trigger any flash (e.g. TC-TI-LOGIN-002) | Flash banner appears with an "x" close icon |
| 2 | Click the **x** | Flash banner is dismissed |

---

### TC-TI-LOGIN-006 — Logout ends session
**Priority:** High · **Technique:** Positive
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Log in (TC-TI-LOGIN-001) | `/secure` page shown |
| 2 | Click **Logout** | Redirects to `/login`; flash: "You logged out of the secure area!" |

---

### TC-TI-LOGIN-007 — Secure page requires authentication
**Priority:** High · **Technique:** Negative / access control
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | While logged out, navigate directly to `/secure` | Redirects to `/login`; flash indicates authentication required ("You must login to view the secure area!") |

---

### TC-TI-LOGIN-008 — Password is masked
**Priority:** Medium · **Technique:** UI
| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Type into the password field | Characters render masked (`type="password"`) |

---

## Notes
- Exact flash-message text should be confirmed against the live app at execution and updated if it differs.
- The Internet uses server-side flash messages in a `#flash` element (may include a trailing "×").
