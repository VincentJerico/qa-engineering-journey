# QA Engineering Journey

[![CI](https://github.com/VincentJerico/qa-engineering-journey/actions/workflows/ci.yml/badge.svg)](https://github.com/VincentJerico/qa-engineering-journey/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-in%20progress-brightgreen)
![Focus](https://img.shields.io/badge/focus-QA%20Engineering-blue)
![Manual cases](https://img.shields.io/badge/manual%20cases-91-informational)
![Automated tests](https://img.shields.io/badge/automated%20tests-108-success)
![Last Commit](https://img.shields.io/github/last-commit/VincentJerico/qa-engineering-journey)

A structured learning and portfolio repository documenting my path in Quality Assurance engineering — from manual testing fundamentals through automation, performance, security, AI testing, and CI/CD.

Every area follows the same disciplined loop: **plan → write cases → execute live → report results (and log any defects) → automate → run in CI.**

## Highlights so far
- **2 manual test cycles executed** end-to-end against live apps — [SauceDemo](01-manual-testing/test-plans/TP-001-saucedemo.md) (47 cases, 2 bugs found) and [The Internet](01-manual-testing/test-plans/TP-002-the-internet.md) (44 cases).
- **API testing** of [Restful-Booker](03-api-testing/documentation/TP-003-restful-booker.md) — 17 scenarios, a [Postman collection](03-api-testing/collections/), and 5 documented API design observations.
- **108 automated tests** — 91 [Playwright UI](04-automation/ui/) specs (2 apps) + 17 [Playwright API](04-automation/api/) specs — all traceable to their manual case IDs and **green in CI**.
- **CI pipeline** ([ci.yml](.github/workflows/ci.yml)) runs the sanity check, UI suite, and API suite on every push.
- **2 defects found & documented**: [BUG-001](01-manual-testing/bug-reports/BUG-001-problem-user-identical-images.md) (identical product images) and [BUG-002](01-manual-testing/bug-reports/BUG-002-empty-cart-checkout.md) (empty-cart checkout completes a $0 order).

## Repository Structure

| Folder | Focus |
|--------|-------|
| [`01-manual-testing/`](01-manual-testing/) | Test plans, test cases, bug reports, checklists, and exploratory testing charters |
| [`02-test-design/`](02-test-design/) | Test design techniques: equivalence partitioning, boundary value analysis, decision tables, state transition |
| [`03-api-testing/`](03-api-testing/) | API collections, test scenarios, and documentation |
| [`04-automation/`](04-automation/) | UI automation, API automation, and shared utilities |
| [`05-sql-testing/`](05-sql-testing/) | SQL queries and data-validation test scenarios |
| [`06-performance-testing/`](06-performance-testing/) | Load, stress, and performance testing artifacts |
| [`07-security-testing/`](07-security-testing/) | Security testing notes and findings |
| [`08-ai-testing/`](08-ai-testing/) | Testing AI/LLM-based systems |
| [`09-ci-cd/`](09-ci-cd/) | Continuous integration and delivery pipelines |
| [`10-projects/`](10-projects/) | End-to-end practice projects |
| [`notes/`](notes/) | Study notes by topic |
| [`daily-log/`](daily-log/) | Daily learning log |
| [`.github/workflows/`](.github/workflows/) | GitHub Actions workflows |

## Progress

| Area | Status | What's inside |
|------|--------|---------------|
| Manual testing | ✅ Done | 2 plans, 91 cases, 2 execution reports, 2 bug reports, 2 checklists |
| API testing | ✅ Done | Plan, 17 scenarios, API reference, Postman collection, execution report |
| Automation | ✅ Done | 91 UI + 17 API Playwright tests, in CI |
| CI/CD | ✅ Active | GitHub Actions: sanity + UI + API jobs |
| Test design | ✅ Done | Worked examples of EP, BVA, decision tables, state transition |
| SQL testing | ✅ Done | SQLite sample DB, 8 data-validation checks, analytics queries, execution report |
| Performance testing | ✅ Done | k6 smoke/load/stress vs Restful-Booker, execution report |
| Security testing | ⬜ Planned | OWASP-style checks and findings |
| AI testing | ⬜ Planned | Evaluating AI/LLM-based systems |

## Tech stack
Playwright + TypeScript · Postman · GitHub Actions · Markdown documentation

## Running the automated tests
```bash
# UI tests (SauceDemo + The Internet)
cd 04-automation/ui && npm install && npm run install:browsers && npm test

# API tests (Restful-Booker)
cd 04-automation/api && npm install && npm test
```

## Learning Roadmap

1. ✅ **Manual Testing** — fundamentals of test design and defect reporting
2. ✅ **Test Design Techniques** — systematic case derivation
3. ✅ **API Testing** — request/response validation, status codes, auth
4. ✅ **Automation** — UI & API test automation with Playwright
5. ✅ **SQL Testing** — data integrity and backend validation
6. ✅ **Performance Testing** — load and stress testing (k6)
7. ⬜ **Security Testing** — common vulnerabilities and defensive checks
8. ⬜ **AI Testing** — evaluating AI/LLM systems
9. ✅ **CI/CD** — pipelines and test integration

## Notes

Empty section folders contain a `.gitkeep` placeholder so the structure is preserved in version control. Replace these as content is added.
