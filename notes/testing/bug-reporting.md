# Bug reporting notes

## What a good bug report contains

1. Title: short and specific. Say what is wrong and where, not "login broken".
2. Environment: app version, browser, OS, and the user or role.
3. Steps to reproduce: numbered, minimal and repeatable.
4. Expected result: what should happen. Cite the requirement if there is one.
5. Actual result: what happened, with evidence such as the response, a screenshot or DOM values.
6. Severity and priority (see below).
7. Evidence: logs, IDs and exact values, for example "1 distinct image src instead of 6".

## Severity vs priority

Severity is the technical impact: how badly the defect breaks things. Priority is the business
urgency: how soon it needs fixing. The two are independent. A typo on the homepage can be low
severity and high priority, while a crash in a rarely used admin export can be high severity and
low priority.

| | High priority | Low priority |
|---|---|---|
| **High severity** | Checkout crash | Rare edge-case data corruption |
| **Low severity** | Misspelled brand on landing page | Minor cosmetic issue deep in the app |

## Lessons from this repo

- Prove the defect with data. [BUG-001](../../01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md)
  compares image `src` counts (1 against a baseline of 6) instead of saying the images look wrong.
- For state or access bugs, show the side effect. [BUG-002](../../01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md)
  follows the empty cart all the way to a completed $0 order, which is the real impact.
- Keep defects and observations apart. On a practice API, odd status codes (200 on bad auth, 201
  on delete) are recorded as observations. On a real API they would be raised as bugs. Say which
  one you're doing.
