# Test Execution Report — The Internet (TP-002)

| Field | Value |
|-------|-------|
| **Report ID** | TER-003 |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **Application** | The Internet — https://the-internet.herokuapp.com |
| **Tester** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Environment** | Chrome (built-in browser pane), desktop viewport |

## Summary
| Metric | Count |
|--------|------:|
| Total cases | 44 |
| Passed | 44 |
| Failed | 0 |
| Defects found | 0 |
| Observations (behavior documented) | 2 (TC-TI-IN-007, TC-TI-IN-008) |

All seven modules executed cleanly. The Internet is a correctly-behaving demo (no seeded defects
like SauceDemo's), so no bugs were raised — coverage and technique practice were the goal here.

## Results by module

### Form Authentication (`/login`) — 8/8
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-LOGIN-001 | Valid login | ✅ Pass | → `/secure`, "You logged into a secure area!", Logout shown |
| TC-TI-LOGIN-002 | Invalid username | ✅ Pass | "Your username is invalid!" |
| TC-TI-LOGIN-003 | Invalid password | ✅ Pass | "Your password is invalid!" |
| TC-TI-LOGIN-004 | Empty credentials | ✅ Pass | "Your username is invalid!" |
| TC-TI-LOGIN-005 | Dismiss flash | ✅ Pass | "×" close removes the flash |
| TC-TI-LOGIN-006 | Logout | ✅ Pass | → `/login`, "You logged out of the secure area!" |
| TC-TI-LOGIN-007 | Secure page requires auth | ✅ Pass | → `/login`, "You must login to view the secure area!" |
| TC-TI-LOGIN-008 | Password masked | ✅ Pass | `type="password"` |

### Checkboxes (`/checkboxes`) — 6/6
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-CHK-001 | Default states | ✅ Pass | [unchecked, checked] |
| TC-TI-CHK-002 | Check the first | ✅ Pass | becomes checked |
| TC-TI-CHK-003 | Uncheck the second | ✅ Pass | becomes unchecked |
| TC-TI-CHK-004 | Toggle twice round-trip | ✅ Pass | returns to original |
| TC-TI-CHK-005 | Both checked | ✅ Pass | independent state |
| TC-TI-CHK-006 | Both unchecked | ✅ Pass | independent state |

### Dropdown (`/dropdown`) — 6/6
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-DD-001 | Default option | ✅ Pass | "Please select an option" |
| TC-TI-DD-002 | Options listed | ✅ Pass | placeholder (disabled), Option 1, Option 2 |
| TC-TI-DD-003 | Select Option 1 | ✅ Pass | |
| TC-TI-DD-004 | Select Option 2 | ✅ Pass | |
| TC-TI-DD-005 | Change selection | ✅ Pass | single-select |
| TC-TI-DD-006 | Placeholder not selectable | ✅ Pass | option is `disabled` |

### Add/Remove Elements (`/add_remove_elements/`) — 5/5
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-AR-001 | Add one | ✅ Pass | 1 Delete button |
| TC-TI-AR-002 | Add five | ✅ Pass | 5 Delete buttons |
| TC-TI-AR-003 | Remove one | ✅ Pass | 3 → 2 |
| TC-TI-AR-004 | Remove all | ✅ Pass | back to 0 |
| TC-TI-AR-005 | None to delete initially | ✅ Pass | only Add button present |

### JavaScript Alerts (`/javascript_alerts`) — 6/6
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-JS-001 | Alert accept | ✅ Pass | "You successfully clicked an alert" |
| TC-TI-JS-002 | Confirm OK | ✅ Pass | "You clicked: Ok" |
| TC-TI-JS-003 | Confirm Cancel | ✅ Pass | "You clicked: Cancel" |
| TC-TI-JS-004 | Prompt with text | ✅ Pass | "You entered: Hello QA" |
| TC-TI-JS-005 | Prompt cancelled | ✅ Pass | "You entered: null" |
| TC-TI-JS-006 | Prompt empty accept | ✅ Pass | "You entered:" (empty) |

### Dynamic Loading (`/dynamic_loading`) — 5/5
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-DL-001 | Ex.1 hidden → revealed | ✅ Pass | "Hello World!" shown after load |
| TC-TI-DL-002 | Ex.1 hidden before Start | ✅ Pass | in DOM, not visible |
| TC-TI-DL-003 | Ex.2 rendered after load | ✅ Pass | added to DOM (~5s) |
| TC-TI-DL-004 | Ex.2 not in DOM before Start | ✅ Pass | element absent |
| TC-TI-DL-005 | Loading indicator | ✅ Pass | visible during load |

### Inputs (`/inputs`) — 8/8
| Case | Description | Result | Notes |
|------|-------------|--------|-------|
| TC-TI-IN-001 | Positive integer | ✅ Pass | `42` |
| TC-TI-IN-002 | Negative number | ✅ Pass | `-15` |
| TC-TI-IN-003 | Decimal | ✅ Pass | `3.14` |
| TC-TI-IN-004 | Non-numeric rejected | ✅ Pass | letters ignored; field stays empty |
| TC-TI-IN-005 | ArrowUp increments | ✅ Pass | `5` → `6` |
| TC-TI-IN-006 | ArrowDown decrements | ✅ Pass | `5` → `4` |
| TC-TI-IN-007 | Large number | ⚠️ Observation | `999999999999` accepted (no max) |
| TC-TI-IN-008 | Special numeric forms | ⚠️ Observation | `1e3` kept as-is; `+7` normalized to `7` |

## Observations (not defects)
- **TC-TI-IN-007 / TC-TI-IN-008** — the number input has no max and accepts scientific/`+`-prefixed
  forms; `+7` is normalized to `7`. Standard HTML `<input type="number">` behavior; recorded for reference.

## Execution notes
- Verified via the DOM (`checked` state, `value`, `#result` text, element visibility/existence).
- **JavaScript Alerts** are native dialogs that block the page, so they were driven by stubbing
  `window.alert/confirm/prompt` to simulate each user choice, then reading `#result` — the standard
  way to automate native dialogs (in Playwright this maps to `page.on('dialog', ...)`).
- **Dynamic Loading** used a poll-until-visible wait (no fixed sleeps), matching how it should be automated.
- Hit the same tooling quirk as TP-001 where `cmd+a` didn't clear the number field (caused an early
  false empty on `-15`); re-ran with a JS clear between keyboard entries and confirmed the real values.
