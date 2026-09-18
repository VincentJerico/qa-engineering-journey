# Bug Reporting — Notes

## Anatomy of a good bug report
1. **Title** — concise, specific: *what* is wrong and *where* (not "login broken").
2. **Environment** — app/version, browser, OS, user/role.
3. **Steps to reproduce** — numbered, minimal, deterministic.
4. **Expected result** — what should happen (cite the requirement if there is one).
5. **Actual result** — what happened, with evidence (response, screenshot, DOM values).
6. **Severity / Priority** — see below.
7. **Evidence** — logs, IDs, exact values (e.g. "1 distinct image src instead of 6").

## Severity vs Priority
- **Severity** = technical impact of the defect (how badly it breaks things).
- **Priority** = business urgency to fix it (how soon).
- They're independent: a typo on the homepage can be low severity / high priority; a crash in a
  rarely-used admin export can be high severity / low priority.

| | High priority | Low priority |
|---|---|---|
| **High severity** | Checkout crash | Rare edge-case data corruption |
| **Low severity** | Misspelled brand on landing page | Minor cosmetic issue deep in the app |

## Lessons from this repo
- **Prove the defect with data, not vibes.** [BUG-001](../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md)
  compares image `src` counts (1 vs a 6-image baseline) rather than "images look wrong".
- **Show the side effect for access-control/state bugs.** [BUG-002](../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md)
  follows the empty cart all the way to a completed $0 order — the impact, not just a wrong screen.
- **Separate defects from observations.** On a practice API, odd status codes (auth 200, delete 201)
  are documented as *observations*; on a real API they'd be raised as bugs. Be explicit about which.
