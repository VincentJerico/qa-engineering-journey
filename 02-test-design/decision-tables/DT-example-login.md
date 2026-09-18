# Decision Tables — Worked Example

## Technique
When an outcome depends on a **combination of conditions**, list the conditions as rows, enumerate the
relevant combinations as columns ("rules"), and record the expected action for each. It guarantees you
cover the meaningful combinations rather than guessing.

---

## Example A: SauceDemo login
Conditions: username state, password state, and whether the account is locked.
(Grounded in [TC-LOGIN](../../01-manual-testing/test-cases/TC-LOGIN-saucedemo.md).)

| Rule | Username | Password | Account | → Expected outcome |
|------|----------|----------|---------|--------------------|
| R1 | valid | valid | active | ✅ Login → inventory |
| R2 | valid | valid | locked | ❌ "Sorry, this user has been locked out." |
| R3 | valid | wrong | active | ❌ "Username and password do not match…" |
| R4 | invalid/unknown | any | – | ❌ "Username and password do not match…" |
| R5 | empty | any | – | ❌ "Username is required" |
| R6 | valid | empty | active | ❌ "Password is required" |
| R7 | empty | empty | – | ❌ "Username is required" (username checked first) |

### Notes on the analysis
- **R4 vs R3** intentionally return the *same* message — good security (no user enumeration).
- **R5/R7** show precedence: username is validated before password, so empty-both behaves like empty-username.
- Each rule maps 1:1 to an executed case (TC-LOGIN-001..007), which is why login coverage is complete
  yet minimal.

---

## Example B: checkout "Continue" button (information form)
Conditions: first name, last name, postal code present or empty.

| Rule | First | Last | Zip | → Expected |
|------|-------|------|-----|------------|
| R1 | ✓ | ✓ | ✓ | Proceed to overview |
| R2 | ✗ | ✓ | ✓ | "First Name is required" |
| R3 | ✓ | ✗ | ✓ | "Last Name is required" |
| R4 | ✓ | ✓ | ✗ | "Postal Code is required" |

Matches TC-CHK-001..004. With 3 boolean conditions there are 2³=8 combinations, but only these 4
rules are meaningful for the "first missing field wins" behavior — the table makes that reasoning explicit.

## Takeaway
Decision tables turn tangled "if/else" requirements into a checklist of rules, each becoming one test.
Collapse combinations that produce the same outcome to keep the table minimal.
