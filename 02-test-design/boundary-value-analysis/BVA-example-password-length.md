# Boundary Value Analysis — Worked Example

## Technique
Defects cluster at the **edges** of a partition. For each boundary, test the value on the boundary
and the values immediately on either side. (Often combined with equivalence partitioning: EP finds
the partitions, BVA tests their edges.)

For a valid range `[min, max]`, test: `min-1`, `min`, `min+1`, `max-1`, `max`, `max+1`.

---

## Example A: Password length (valid: 8–20 characters)
A registration password field accepting 8 to 20 characters.

### Boundary values
| Value (length) | Partition | Expected |
|----------------|-----------|----------|
| 7 | below min | Rejected — "too short" |
| 8 | min (valid edge) | Accepted |
| 9 | just inside | Accepted |
| 19 | just inside | Accepted |
| 20 | max (valid edge) | Accepted |
| 21 | above max | Rejected — "too long" |

### Derived test cases
| # | Length | Expected |
|---|--------|----------|
| BVA-1 | 7 | Rejected |
| BVA-2 | 8 | Accepted |
| BVA-3 | 20 | Accepted |
| BVA-4 | 21 | Rejected |
(9 and 19 optional — the risk is concentrated at 7/8 and 20/21.)

---

## Example B: real — SauceDemo cart badge count
The cart badge is a count with a natural lower boundary of **0**.

| Boundary | Action | Expected | Real case |
|----------|--------|----------|-----------|
| 0 (empty) | no items | badge hidden | verified in TC-CART-006 |
| 1 (first item) | add one | badge shows 1 | TC-CART-002 |
| n → n-1 | remove one | badge decrements | TC-CART-005 |
| back to 0 | remove all | badge disappears | TC-CART-006 |

The "remove all → 0" boundary is exactly where an off-by-one bug (badge showing "0" instead of
hiding, or going negative) would appear — which is why it's an explicit case.

## Takeaway
After partitioning, always ask "what are the edges?" and test each edge plus one step outside it.
