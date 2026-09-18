# Project Plan: `taskflow-under-test`

> ✅ **BUILT (2026-09-18).** Repo: https://github.com/VincentJerico/taskflow-under-test
> All 7 milestones complete — Express + SQLite app with **59 automated tests** (27 unit + 28 API +
> 4 E2E), a seed-and-catch-bugs writeup, and CI (unit+API and E2E jobs) green.
> This document is the original plan/spec that guided the build.

## Pitch
Most QA portfolios only test *someone else's* app. This repo shows both sides: **build** a small app,
then **test it like an adversary** — unit → API → E2E → performance — and document real bugs
deliberately introduced and caught. That's the SDET mindset employers screen for.

## Tech stack (simple, testable, reuses existing skills)
- **App:** Node + **Express** (REST API) + **SQLite** + a minimal static **HTML/JS** UI
- **Tests:** **Vitest** (unit), **Supertest** or Playwright `request` (API), **Playwright** (E2E)
- **CI:** GitHub Actions (lint → unit → API → E2E)

## App scope — "TaskFlow" (task manager)
- **Auth:** register, login (token), logout
- **Tasks CRUD:** create, list (filter/sort), get, update, delete
- **Business rules:** title required; status ∈ {todo, doing, done}; due-date validation;
  a user sees only their own tasks (access control)

## Structure
```
taskflow-under-test/
├── README.md                 # what it is, run steps, test strategy, bugs found
├── src/                      # app: app.js server.js db.js routes/ middleware/
├── public/                   # minimal UI (index.html + app.js)
├── tests/
│   ├── unit/                 # validators, business logic (Vitest)
│   ├── api/                  # endpoints, auth, access control (Supertest)
│   └── e2e/                  # user journeys (Playwright)
├── docs/
│   ├── TEST-STRATEGY.md      # test pyramid rationale
│   └── BUGS-FOUND.md         # seeded bugs + how each test caught them
├── .github/workflows/ci.yml
└── package.json
```

## Testing layers (the pyramid, demonstrated)
| Layer | Tool | Examples |
|-------|------|----------|
| Unit | Vitest | title/status/due-date validators, token helper — EP/BVA edge cases |
| API | Supertest | CRUD happy paths, 400 bad input, 401 unauth, 403 cross-user, 404 |
| E2E | Playwright | register → login → create → complete → logout journeys |
| Perf (optional) | k6 | reuse `06-performance-testing` scripts against the local API |

## Differentiator: seeded bugs
Plant ~4–5 realistic bugs on a branch, write tests that catch them, document in `BUGS-FOUND.md`, then fix:
- Missing server-side validation (empty title accepted) → API test
- Access-control gap (user B reads user A's task) → 403 test
- Off-by-one in a list filter
- Wrong status code (200 instead of 201 on create)

## Milestones (each a clean commit/PR)
1. Scaffold — app skeleton + DB + one endpoint + CI green
2. Build TaskFlow — auth + tasks CRUD + rules
3. Unit tests — validators/logic
4. API tests — endpoints, auth, access control
5. E2E tests — UI journeys
6. Seed + catch bugs — the `BUGS-FOUND.md` narrative
7. Docs + polish — README, test strategy, badges

## Demonstrates
Building software · full test pyramid · API + UI automation · access-control/security thinking · CI ·
clear QA documentation — in one cohesive repo.

## Open questions to confirm before building
- Stack as above (Express + SQLite + Playwright), or different?
- Scope: keep to auth + tasks CRUD, or add more (labels, comments, pagination)?

---

## Other repo ideas (backlog)
Standalone repos that each prove one skill deeply:
1. **playwright-framework-template** — production framework: fixtures, multi-env config, data factories, reporters, Docker, sharding.
2. **api-testing-framework** — typed request clients, schema/contract validation, auth + cleanup hooks.
3. **cypress-vs-playwright** — same app in both + written tradeoff comparison.
4. **bdd-cucumber-demo** — Gherkin/BDD scenarios.
5. **visual-regression-suite** — screenshot diffing.
6. **accessibility-testing** — axe-core + WCAG checklist.
7. **performance-lab** — expanded k6 (soak/spike) + dashboards.
8. **qa-portfolio-site** — GitHub Pages linking all repos with case studies.
9. **qa-interview-prep** — SQL, test-design katas, "how would you test X?" answers.

**Recommended order:** taskflow-under-test → playwright-framework-template → qa-portfolio-site.
