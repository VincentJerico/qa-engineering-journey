# Traceability gate

Every automated test in this repo exists because a manual test case asked for it. This gate keeps
that true. It reads the manual case documents and the test list Playwright reports, writes the
[traceability matrix](../../TRACEABILITY.md), and fails CI when the link between the two breaks.

## Rules

| Rule | Fails when |
| --- | --- |
| Every automated test title starts with a case ID (`TC-CHK-001: ...`) | a test has no case ID |
| Every ID a test uses is defined in a manual document | a test points at a case that doesn't exist |
| Every manual case has a test, unless [`manual-only.json`](manual-only.json) lists it with a reason | a case loses its test |
| Case IDs are unique across the manual documents | two cases share an ID |
| `manual-only.json` lists only real, unautomated cases, each with a reason | an entry is stale or has no reason |
| Every test carries exactly one priority tag, matching its case's `**Priority:**` (`@high` for High) | a tag is missing, wrong, or doubled |
| `TRACEABILITY.md` matches what the generator produces | the committed matrix is stale |

Cases come from `### <ID> — <title>` headings in
[`01-manual-testing/test-cases`](../../01-manual-testing/test-cases/) and
[`03-api-testing/test-scenarios`](../../03-api-testing/test-scenarios/) (execution reports are
skipped). Tests come from `npx playwright test --list --reporter=json` in each suite, so the gate sees
the same tests Playwright runs, including titles that span lines in the source, and their tags.
Setup steps (`*.setup.ts`, such as saving a login session) are fixtures, not cases, so the gate skips
them.

## Run it

Needs `npm ci` in [`04-automation/ui`](../../04-automation/ui/) and
[`04-automation/api`](../../04-automation/api/). No browsers: `--list` doesn't launch one.

```bash
node 09-ci-cd/traceability/selftest.mjs        # proves the gate can fail
node 09-ci-cd/traceability/trace.mjs           # check: exit 1 on any problem or a stale matrix
node 09-ci-cd/traceability/trace.mjs --update  # regenerate TRACEABILITY.md after adding cases or tests
```

## Self-test

A gate that can't fail isn't a gate. [`selftest.mjs`](selftest.mjs) runs the rules on a clean
fixture, which must pass, and on one planted defect per rule, each of which must be reported. CI runs
it before the real check.

## Files

| File | What it does |
| --- | --- |
| [`lib.mjs`](lib.mjs) | Parsing, the rules and the matrix renderer, as pure functions |
| [`trace.mjs`](trace.mjs) | Reads the documents, asks Playwright for the test list, checks or updates |
| [`selftest.mjs`](selftest.mjs) | Planted-defect self-test |
| [`manual-only.json`](manual-only.json) | Cases that stay manual on purpose, `{ "ID": "reason" }`. Empty today: all 108 cases are automated |
