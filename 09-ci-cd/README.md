# CI/CD

The pipeline lives in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). It runs on every
push to `main`, on every pull request to `main`, and on demand from the Actions tab. By
convention a pull request merges only after every job is green. Branch protection does not
enforce this yet.

## Jobs

| Job | What it proves | Fails when |
|-----|----------------|------------|
| Repository sanity check | `README.md`, `LICENSE` and `.gitignore` exist | a required file is missing |
| Playwright UI tests | 91 UI tests pass against SauceDemo and The Internet, after lint, format and typecheck gates | any gate or test fails |
| Playwright API tests | 17 API tests pass against Restful-Booker, after the same gates | any gate or test fails |
| AI eval harness | every eval in [`08-ai-testing`](../08-ai-testing/) passes against the mock model | any eval fails |
| SQL data-validation checks | [`05-sql-testing/check.sh`](../05-sql-testing/check.sh) output matches `expected/` | a query or the seed drifts |
| k6 scripts compile | each script in [`06-performance-testing/scripts`](../06-performance-testing/scripts/) passes `k6 inspect` | a script does not compile |

The k6 job generates no load. Load and stress runs against the public demo API stay manual, so
their thresholds apply only to those runs.

The UI and API jobs upload their Playwright HTML reports as artifacts for 14 days.

## Dependencies

[`.github/dependabot.yml`](../.github/dependabot.yml) opens one weekly grouped PR for minor and
patch updates, and one PR per major update. TypeScript and `@types/node` majors are ignored on
purpose, and the file says when to lift each rule.
