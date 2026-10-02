# QA Engineering Journey

[![CI](https://github.com/VincentJerico/qa-engineering-journey/actions/workflows/ci.yml/badge.svg)](https://github.com/VincentJerico/qa-engineering-journey/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Manual cases](https://img.shields.io/badge/manual%20cases-91-informational)
![Automated tests](https://img.shields.io/badge/automated%20tests-108-success)
![Last Commit](https://img.shields.io/github/last-commit/VincentJerico/qa-engineering-journey)

My QA learning and portfolio repository. It covers manual testing, test design, API testing, UI and API automation, SQL, performance, security, AI testing and CI/CD.

All 9 areas are done. Each one went through the same steps. I wrote a plan and test cases, ran them against a live app, reported the results and any defects, automated what was worth automating, and added it to CI.

## Highlights

- Two manual test cycles against live apps. [SauceDemo](01-manual-testing/test-plans/TP-001-saucedemo.md) had 47 cases and 2 bugs found. [The Internet](01-manual-testing/test-plans/TP-002-the-internet.md) had 44 cases.
- API testing of [Restful-Booker](03-api-testing/documentation/TP-003-restful-booker.md), with 17 scenarios, a [Postman collection](03-api-testing/collections/) and 5 notes on the API's design.
- 108 automated tests. There are 91 [Playwright UI](04-automation/ui/) tests across 2 apps and 17 [Playwright API](04-automation/api/) tests, and each one maps to a manual case ID.
- A [CI pipeline](.github/workflows/ci.yml) that runs on every PR and every push to `main`. It runs the UI and API suites, the AI evals and the SQL checks, and compiles the k6 scripts. See [09-ci-cd](09-ci-cd/).
- Two bug reports. [BUG-001](01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md) covers identical product images, and [BUG-002](01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md) covers an empty cart that checks out as a $0 order.

## Related projects

Each of these repositories goes deeper on one skill.

- [taskflow-under-test](https://github.com/VincentJerico/taskflow-under-test) is a small
  task-manager app I built to test, with unit, API and E2E suites and planted bugs the suite has to
  catch.
- [playwright-framework-template](https://github.com/VincentJerico/playwright-framework-template)
  is a reusable Playwright and TypeScript starter with fixtures, page objects and cross-browser CI.
- [api-testing-framework](https://github.com/VincentJerico/api-testing-framework) has typed API
  tests on Playwright's request API, with Zod schema checks and automatic cleanup.
- [accessibility-testing](https://github.com/VincentJerico/accessibility-testing) checks SauceDemo
  against WCAG 2.2 AA with axe-core and a keyboard audit.

## Repository structure

| Folder | Focus |
|--------|-------|
| [`01-manual-testing/`](01-manual-testing/) | Test plans, test cases, bug reports, and checklists |
| [`02-test-design/`](02-test-design/) | Test design techniques: equivalence partitioning, boundary value analysis, decision tables, state transition |
| [`03-api-testing/`](03-api-testing/) | API collections, test scenarios, and documentation |
| [`04-automation/`](04-automation/) | UI automation and API automation |
| [`05-sql-testing/`](05-sql-testing/) | SQL queries and data-validation test scenarios |
| [`06-performance-testing/`](06-performance-testing/) | Load, stress, and performance testing artifacts |
| [`07-security-testing/`](07-security-testing/) | Security testing notes and findings |
| [`08-ai-testing/`](08-ai-testing/) | Testing AI/LLM-based systems |
| [`09-ci-cd/`](09-ci-cd/) | Continuous integration and delivery pipelines |
| [`10-projects/`](10-projects/) | The brief for TaskFlow, the app I built to test |
| [`notes/`](notes/) | Study notes by topic |
| [`daily-log/`](daily-log/) | Daily learning log |
| [`.github/workflows/`](.github/workflows/) | GitHub Actions workflows |

## Progress

| Area | Status | What's inside |
|------|--------|---------------|
| Manual testing | Done | 2 plans, 91 cases, 2 execution reports, 2 bug reports, 2 checklists |
| API testing | Done | Plan, 17 scenarios, API reference, Postman collection, execution report |
| Automation | Done | 91 UI + 17 API Playwright tests, in CI |
| CI/CD | Active | GitHub Actions: sanity, UI, API, AI evals, SQL checks, k6 compile |
| Test design | Done | Worked examples of EP, BVA, decision tables, state transition |
| SQL testing | Done | SQLite sample DB, 8 data-validation checks, analytics queries, execution report |
| Performance testing | Done | k6 smoke/load/stress vs Restful-Booker, execution report |
| Security testing | Done | OWASP-oriented checklist, 15 checks, live execution report |
| AI testing | Done | Runnable LLM eval harness (6 evals: classification, extraction, safety, schema) |

## Tech stack
Playwright and TypeScript, Postman, k6, SQLite, Node (for the eval harness), GitHub Actions and Markdown.

## Running the automated tests
```bash
# UI tests (SauceDemo + The Internet)
cd 04-automation/ui && npm install && npm run install:browsers && npm test

# API tests (Restful-Booker)
cd 04-automation/api && npm install && npm test
```

The SQL checks, k6 scripts and AI evals each have a run block in their area README:
[05-sql-testing](05-sql-testing/), [06-performance-testing](06-performance-testing/),
[08-ai-testing](08-ai-testing/).

