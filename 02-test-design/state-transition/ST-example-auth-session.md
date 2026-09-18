# State Transition — Worked Example

## Technique
Model the system as a set of **states** and the **events** that move between them. Test valid
transitions (does the right event move to the right state?) and invalid ones (does the system reject
or ignore events that shouldn't apply in the current state?).

---

## Example A: Authentication session (SauceDemo / The Internet)

### States & transitions
| Current state | Event | Next state |
|---------------|-------|------------|
| Logged out | valid login | Logged in |
| Logged out | invalid login | Logged out (error shown) |
| Logged out | visit protected URL directly | Logged out (redirected + error) |
| Logged in | logout | Logged out |
| Logged in | browser Back after logout | Logged out (session **not** restored) |

### Diagram (text)
```
        valid login
Logged out ─────────────▶ Logged in
   ▲   │                     │
   │   │ invalid login       │ logout
   │   └────(stays)          │
   └─────────────────────────┘
     (Back button must NOT restore the session)
```

### Derived cases (mapped to executed tests)
| # | From → event → to | Real case |
|---|-------------------|-----------|
| ST-1 | out → valid login → in | TC-LOGIN-001 / TC-TI-LOGIN-001 |
| ST-2 | out → invalid login → out | TC-LOGIN-003 / TC-TI-LOGIN-002 |
| ST-3 | out → direct protected URL → out | TC-LOGIN-010 / TC-TI-LOGIN-007 |
| ST-4 | in → logout → out | TC-LOGIN-011 / TC-TI-LOGIN-006 |
| ST-5 | in → logout → Back → **still out** | TC-LOGIN-011 (step 3) |

ST-5 is the interesting invalid transition: after logout, a Back navigation must **not** resurrect
the logged-in state — a common real-world session bug.

---

## Example B: Checkbox toggle (The Internet)
A simple two-state machine, tested in [TC-CHECKBOXES](../../01-manual-testing/test-cases/the-internet/TC-CHECKBOXES-the-internet.md).

```
unchecked ──click──▶ checked ──click──▶ unchecked
```
| # | From → event → to | Real case |
|---|-------------------|-----------|
| ST-6 | unchecked → click → checked | TC-TI-CHK-002 |
| ST-7 | checked → click → unchecked | TC-TI-CHK-003 |
| ST-8 | unchecked → click ×2 → unchecked (round-trip) | TC-TI-CHK-004 |

## Takeaway
Draw the states and events first; the test cases fall out of the arrows. Don't forget the *negative*
transitions (events that should be rejected in the current state) — that's where session and workflow
bugs hide.
