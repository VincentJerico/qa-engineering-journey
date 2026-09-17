# Regression Checklist — The Internet (Covered Modules)

| Field | Value |
|-------|-------|
| **Checklist ID** | CHK-002 |
| **Related plan** | [TP-002](../../test-plans/TP-002-the-internet.md) |
| **Purpose** | Fast smoke pass over the seven modules covered in TP-002 |
| **Est. time** | ~8 minutes |
| **Author** | Vincent Jerico |

Copy this file per run and tick the boxes. Full detail: `../../test-cases/the-internet/`.

**Run info:** Date: `__________` · Tester: `__________` · Result: ☐ Pass ☐ Fail

## Form Authentication (`/login`)
- [ ] Valid login (`tomsmith` / `SuperSecretPassword!`) → `/secure`, success flash
- [ ] Invalid username / password show the correct flash messages
- [ ] Logout returns to `/login` with the logout flash
- [ ] Direct `/secure` access when logged out is blocked

## Checkboxes (`/checkboxes`)
- [ ] Defaults: checkbox 1 unchecked, checkbox 2 checked
- [ ] Toggling each works independently

## Dropdown (`/dropdown`)
- [ ] Default is "Please select an option" (disabled)
- [ ] Option 1 and Option 2 can be selected

## Add/Remove Elements (`/add_remove_elements/`)
- [ ] Add creates Delete buttons; count matches clicks
- [ ] Delete removes them back to zero

## JavaScript Alerts (`/javascript_alerts`)
- [ ] Alert → "You successfully clicked an alert"
- [ ] Confirm OK / Cancel → "You clicked: Ok" / "Cancel"
- [ ] Prompt text / cancel → "You entered: <text>" / "null"

## Dynamic Loading (`/dynamic_loading`)
- [ ] Example 1: hidden element revealed after Start
- [ ] Example 2: element added to DOM after Start

## Inputs (`/inputs`)
- [ ] Accepts integers, negatives, decimals
- [ ] Rejects non-numeric text
- [ ] Arrow keys increment / decrement
