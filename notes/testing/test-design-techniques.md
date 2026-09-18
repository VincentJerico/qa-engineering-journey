# Test Design Techniques — Quick Reference

Notes on the core black-box techniques, with examples drawn from this repo's own test cases.

## Equivalence Partitioning (EP)
Divide inputs into groups ("partitions") that should be treated the same, then test one value per
partition instead of every value.
- **Example (Inputs, TP-002):** for a number field — valid integers, negatives, decimals, and
  non-numeric text are separate partitions. One representative each (`42`, `-15`, `3.14`, `abc`).

## Boundary Value Analysis (BVA)
Bugs cluster at the edges of a partition. Test the boundaries and just inside/outside them.
- **Example:** cart badge count at 0 (empty), 1 (first add), and n; "remove all → 0" is a boundary.
- Classic pattern: for a range 1–10, test 0, 1, 2, 9, 10, 11.

## Decision Tables
For logic with multiple conditions, enumerate combinations of conditions → expected actions.
- **Example (SauceDemo login):**

| Username | Password | Expected |
|----------|----------|----------|
| valid | valid | login succeeds |
| valid | wrong | "do not match" error |
| empty | any | "Username is required" |
| any | empty | "Password is required" |
| locked user | valid | "locked out" error |

## State Transition
Model the system as states and the events that move between them; test valid and invalid transitions.
- **Example (Checkboxes, TP-002):** unchecked ⇄ checked; toggling twice returns to the original state.
- **Example (Add/Remove):** 0 → add → 1 → delete → 0; deleting at 0 is not possible (no button).

## When to use which
| Situation | Technique |
|-----------|-----------|
| A field accepts a range/category of values | EP |
| Edges/limits matter (min/max, first/last) | BVA |
| Output depends on several conditions | Decision table |
| Behavior depends on current state + events | State transition |

## Related
- Applied in [TP-001](../../01-manual-testing/test-plans/TP-001-saucedemo.md) and
  [TP-002](../../01-manual-testing/test-plans/TP-002-the-internet.md).
- Worked examples will live in `../../02-test-design/`.
