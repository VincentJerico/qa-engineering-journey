# Equivalence Partitioning — Worked Example

## Technique
Divide the input domain into partitions where every value in a partition should be handled the same
way. Test **one representative value per partition** instead of every possible value — same coverage,
far fewer tests.

---

## Example A: "Quantity" field (accepts integers 1–10)
A hypothetical product quantity selector that accepts whole numbers from 1 to 10.

### Partitions
| Partition | Range | Valid? | Representative |
|-----------|-------|--------|----------------|
| Below range | ≤ 0 | Invalid | `0` |
| In range | 1–10 | Valid | `5` |
| Above range | ≥ 11 | Invalid | `15` |
| Non-integer | e.g. `2.5` | Invalid | `2.5` |
| Non-numeric | letters/symbols | Invalid | `abc` |

### Derived test cases
| # | Input | Expected |
|---|-------|----------|
| EP-1 | `5` | Accepted |
| EP-2 | `0` | Rejected (below minimum) |
| EP-3 | `15` | Rejected (above maximum) |
| EP-4 | `2.5` | Rejected (must be whole number) |
| EP-5 | `abc` | Rejected / ignored (not numeric) |

5 cases cover the whole domain instead of testing 1,2,3,…,10 and beyond.

---

## Example B: real — The Internet "Inputs" number field
The number field at `/inputs` (see [TC-INPUTS](../../01-manual-testing/test-cases/the-internet/TC-INPUTS-the-internet.md))
has no explicit min/max, so its partitions are by **type**, not range:

| Partition | Representative | Observed behavior |
|-----------|----------------|-------------------|
| Positive integer | `42` | accepted |
| Negative number | `-15` | accepted |
| Decimal | `3.14` | accepted |
| Non-numeric text | `abc` | rejected (field stays empty) |

This is exactly how TC-TI-IN-001..004 were chosen — one value per equivalence class.

## Takeaway
Identify partitions first, then pick one value each. Combine with **boundary value analysis** to also
probe the edges of the valid partition.
