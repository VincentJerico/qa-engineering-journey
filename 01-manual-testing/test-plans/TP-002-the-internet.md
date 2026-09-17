# Test Plan: The Internet (Herokuapp)

| Field | Value |
|-------|-------|
| **Plan ID** | TP-002 |
| **Application** | The Internet |
| **URL** | https://the-internet.herokuapp.com |
| **Version / Env** | Public demo, latest |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Status** | Draft |

---

## 1. Introduction
[The Internet](https://the-internet.herokuapp.com) is a collection of ~44 independent example pages,
each demonstrating a specific web behavior or automation challenge. Unlike SauceDemo (one end-to-end
flow), it is a set of focused, isolated features — ideal for practicing **edge-case and
technique-driven testing**. This plan covers a focused starter set of eight modules.

## 2. Objectives
- Exercise a range of UI behaviors: authentication, form state, dynamic DOM, native dialogs, async loading, and input handling.
- Practice the test-design techniques from `02-test-design/` on isolated features.
- Build a reusable, well-organized set of manual cases that can later be automated (parallel to the SauceDemo → Playwright path).

## 3. Scope

### 3.1 In scope (modules)
| # | Module | Path | Focus |
|---|--------|------|-------|
| 1 | Form Authentication | `/login` | Valid/invalid login, flash messages, logout, access control |
| 2 | Checkboxes | `/checkboxes` | Checkbox state toggling and defaults |
| 3 | Dropdown | `/dropdown` | Single-select behavior and default option |
| 4 | Add/Remove Elements | `/add_remove_elements/` | Dynamic DOM add/remove |
| 5 | JavaScript Alerts | `/javascript_alerts` | Native alert / confirm / prompt handling |
| 6 | Dynamic Loading | `/dynamic_loading/1`, `/dynamic_loading/2` | Waiting for async elements |
| 7 | Inputs | `/inputs` | Numeric input edge cases and keyboard behavior |

### 3.2 Out of scope
- The remaining ~37 modules (may be added in later iterations).
- Performance, security, and API testing.
- Basic/Digest auth pages (require credential handling — deferred).
- Cross-browser matrix beyond the browsers listed below.

## 4. Test Approach
Manual, black-box functional testing, one case file per module. Techniques applied:
**equivalence partitioning** and **boundary value analysis** (Inputs), **state transition**
(Checkboxes, Add/Remove), and **exploratory testing** (Dynamic Loading, JS Alerts). Defects are
logged in `01-manual-testing/bug-reports/the-internet/`.

## 5. Test Environment
- **OS:** macOS
- **Browsers:** Chrome (primary), Firefox (secondary)
- **Tools:** Browser DevTools, this repository for documentation
- **Credentials (Form Authentication):** username `tomsmith`, password `SuperSecretPassword!`

## 6. Test Deliverables
- This test plan (`TP-002-the-internet.md`)
- Test cases in `01-manual-testing/test-cases/the-internet/`
- Bug reports in `01-manual-testing/bug-reports/the-internet/`
- A regression checklist in `01-manual-testing/checklists/the-internet/`
- Execution reports (TER-00x) alongside the cases

## 7. Entry Criteria
- Application URL is reachable.
- Test cases for the in-scope modules are drafted.

## 8. Exit Criteria
- All planned test cases executed.
- No open Critical/High defects in the covered modules (or all such defects documented).
- Results and any defects recorded in the repository.

## 9. Risks & Assumptions
- **Risk:** The Internet is a shared public demo; it can be slow or briefly unavailable.
  **Mitigation:** re-run affected cases; note environment issues separately from defects.
- **Risk:** Some pages intentionally demonstrate "broken" or tricky behavior.
  **Mitigation:** define the expected behavior per case before judging pass/fail.
- **Assumption:** Each module is independent; no shared state between modules.

## 10. File Organization
New work is app-scoped to keep it separate from the SauceDemo (TP-001) artifacts:
```
01-manual-testing/
├── test-plans/TP-002-the-internet.md
├── test-cases/the-internet/TC-<MODULE>-the-internet.md
├── bug-reports/the-internet/
└── checklists/the-internet/
```

## 11. Test Case Index
| Module | Case file |
|--------|-----------|
| Form Authentication | [TC-LOGIN-the-internet.md](../test-cases/the-internet/TC-LOGIN-the-internet.md) |
| Checkboxes | [TC-CHECKBOXES-the-internet.md](../test-cases/the-internet/TC-CHECKBOXES-the-internet.md) |
| Dropdown | [TC-DROPDOWN-the-internet.md](../test-cases/the-internet/TC-DROPDOWN-the-internet.md) |
| Add/Remove Elements | [TC-ADDREMOVE-the-internet.md](../test-cases/the-internet/TC-ADDREMOVE-the-internet.md) |
| JavaScript Alerts | [TC-JSALERTS-the-internet.md](../test-cases/the-internet/TC-JSALERTS-the-internet.md) |
| Dynamic Loading | [TC-DYNLOADING-the-internet.md](../test-cases/the-internet/TC-DYNLOADING-the-internet.md) |
| Inputs | [TC-INPUTS-the-internet.md](../test-cases/the-internet/TC-INPUTS-the-internet.md) |
