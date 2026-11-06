# CI/CD

The pipeline lives in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| Trigger | UI suite runs on | Why |
|---------|------------------|-----|
| Push to `main`, pull request to `main` | Chromium | Fast feedback on every change |
| Nightly, 04:00 Philippine time | Chromium, Firefox, WebKit | Cross-browser coverage, and the apps under test are live public sites that can change while this code doesn't |
| Manual (Actions tab) | Chromium, or all three with **cross_browser** ticked | Re-run on demand |

By convention a pull request merges only after **All gates** is green. Branch protection does not
enforce this yet; **All gates** is the single check to require when it does.

## Policies

- **Least privilege**: the workflow's token can only read the repository (`permissions: contents: read`).
- **No wasted runs**: a new push to a branch or PR cancels the run it supersedes. Nightly runs never cancel each other.
- **Timeouts** on every job, so a hung live site fails fast instead of holding a runner for 6 hours.
- **Flakiness fails the build**: Playwright retries twice in CI (keeping traces), but a test that only passes on a retry fails the run (`failOnFlakyTests`).
- **One engine failing doesn't hide the others**: the browser matrix doesn't stop at the first failure.
- **Gates prove they can fail**: the traceability gate, the SQL check, the k6 compile check and the AI
  evals (negative controls in [`08-ai-testing/eval/controls.mjs`](../08-ai-testing/eval/controls.mjs))
  each run a self-test with planted defects before the real check, so a broken gate can't pass vacuously.

## Jobs

| Job | What it proves | Fails when |
|-----|----------------|------------|
| Repository sanity check | `README.md`, `LICENSE` and `.gitignore` exist | a required file is missing |
| Playwright UI tests (per browser) | 91 UI tests pass against SauceDemo and The Internet, after lint, format and typecheck gates | any gate or test fails, or a test is flaky |
| Playwright API tests | 17 API tests pass against Restful-Booker, after the same gates | any gate or test fails, or a test is flaky |
| Traceability gate | every automated test maps to a manual case, carries that case's priority tag, and every case has a test; [`TRACEABILITY.md`](../TRACEABILITY.md) is current. Its self-test runs first | a test has no case ID or an unknown one, a priority tag is wrong, a case loses its test, or the matrix is stale |
| AI eval harness | every eval in [`08-ai-testing`](../08-ai-testing/) passes against the mock model | any eval fails |
| SQL data-validation checks | [`05-sql-testing/check.sh`](../05-sql-testing/check.sh) output matches `expected/`. Its [self-test](../05-sql-testing/selftest.sh) runs first | a query or the seed drifts, or a query errors |
| k6 scripts compile | each script in [`06-performance-testing/scripts`](../06-performance-testing/scripts/) passes `k6 inspect`. A [broken fixture](../06-performance-testing/selftest/broken-script.js) must fail first | a script does not compile |
| All gates | every job above passed; writes one table of results | any job above failed or was cancelled |

The k6 job generates no load. Load and stress runs against the public demo API stay manual, so
their thresholds apply only to those runs.

The UI and API jobs upload their Playwright HTML reports as artifacts for 14 days (one per browser
for the UI suite), and write a pass/fail/flaky table with the names of any failing tests to the run's
job summary ([`summary/playwright-summary.mjs`](summary/playwright-summary.mjs)).

## Dependencies

[`.github/dependabot.yml`](../.github/dependabot.yml) opens one weekly grouped PR for minor and
patch updates, and one PR per major update. TypeScript and `@types/node` majors are ignored on
purpose, and the file says when to lift each rule.
