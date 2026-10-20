# TaskFlow project brief

TaskFlow is a small task manager I built so I could test my own software end to end, instead of
only testing someone else's demo app. The code is in its own repository,
[taskflow-under-test](https://github.com/VincentJerico/taskflow-under-test), and its README has
the current test counts and how to run everything. This brief is the plan I built it from.

## Scope

- Auth: register, log in with a token, log out.
- Tasks: create, list, read, update and delete.
- Rules: a title is required, status is `todo`, `doing` or `done`, due dates must be real
  calendar dates, and users can only see and change their own tasks.

## Stack

Node and Express serve the API, SQLite stores the data, and a single HTML page is the UI. Vitest
runs the unit tests, Supertest the API tests and Playwright the browser tests. GitHub Actions runs
all three on every push.

## Test layers

| Layer | Tool       | What it covers                                                                      |
| ----- | ---------- | ----------------------------------------------------------------------------------- |
| Unit  | Vitest     | Validators and auth helpers, with equivalence partitioning and boundary values      |
| API   | Supertest  | CRUD, bad input (400), no token (401), another user's task (403), missing task (404) |
| E2E   | Playwright | Register, add a task, complete it, log out and log back in                          |

## Seeded bugs

The plan was to plant a few realistic bugs, show which test catches each one, and fix them. The
write-up is in [BUGS-FOUND.md](https://github.com/VincentJerico/taskflow-under-test/blob/main/docs/BUGS-FOUND.md).

## Milestones

1. Scaffold the app, the database, one endpoint and CI.
2. Build auth and task CRUD with the business rules.
3. Unit tests.
4. API tests, including access control.
5. E2E tests.
6. Seed bugs, catch them and write it up.
7. README, test strategy and badges.

All seven were done on 2026-09-18.
