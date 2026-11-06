# Contributing

This is a personal portfolio, but it's run like a team repo: every change goes through a branch and a
pull request, and CI has to be green (the **All gates** check) before it merges.

## Adding a test

Cases come first, then automation. The [traceability gate](09-ci-cd/traceability/) fails CI if the
two drift apart.

1. **Write the case** in the right document under
   [`01-manual-testing/test-cases`](01-manual-testing/test-cases/) or
   [`03-api-testing/test-scenarios`](03-api-testing/test-scenarios/):

   ```markdown
   ### TC-CHK-014 — Postal code rejects letters
   **Priority:** Medium · **Technique:** Negative
   ```

   The ID must be unique. The `**Priority:**` line is required: it becomes the test's tag.

2. **Automate it** in [`04-automation/ui`](04-automation/ui/) or
   [`04-automation/api`](04-automation/api/). The title starts with the case ID, and the tag matches
   the priority:

   ```ts
   test('TC-CHK-014: postal code rejects letters', { tag: '@medium' }, async ({ checkoutPage }) => {
     // ...
   });
   ```

   Page objects come from [`fixtures/test.ts`](04-automation/ui/fixtures/test.ts). Specs that start
   logged in to SauceDemo use `test.use({ storageState: STANDARD_USER_STATE })`.

3. **Regenerate the matrix**: `node 09-ci-cd/traceability/trace.mjs --update`, then commit
   [`TRACEABILITY.md`](TRACEABILITY.md) with your change.

A case that should stay manual goes in
[`09-ci-cd/traceability/manual-only.json`](09-ci-cd/traceability/manual-only.json) with a reason.

## Before opening a PR

Run what CI runs for the parts you touched:

```bash
# in 04-automation/ui and/or 04-automation/api
npm run lint && npm run format:check && npm run typecheck && npm test

# from the repo root
node 09-ci-cd/traceability/selftest.mjs && node 09-ci-cd/traceability/trace.mjs
05-sql-testing/selftest.sh && 05-sql-testing/check.sh       # if you touched SQL
node 08-ai-testing/eval/run-evals.mjs                       # if you touched the evals
```

To check another browser locally: `BROWSER=firefox npx playwright test` (or `webkit`).

## Conventions

- **Commits**: conventional prefixes (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`).
- **Results are real**: every number in a doc comes from an actual run and says when it ran. If a
  run wasn't done, the doc says so.
- **Known defects** are asserted as they are today and carry an `issue` annotation naming the bug
  report, so the test goes red when the bug is fixed (see `TC-CART-009`, `TC-CAT-012`).
- **Gates prove they can fail**: the custom gates (traceability, SQL check, k6 compile, AI evals)
  each run a self-test with planted defects before the real check.
- **Flaky is failing**: in CI, a test that passes only on retry fails the run. Fix the cause; don't
  add retries or waits to hide it.
- **Only test what you're allowed to**: the targets here are public practice apps built for testing.

## Reporting a bug

Use the **Bug report** issue form. It has the same fields as the reports in
[`01-manual-testing/bug-reports`](01-manual-testing/bug-reports/).
