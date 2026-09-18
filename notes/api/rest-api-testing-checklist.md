# REST API Testing — Checklist & Notes

## What to check on every endpoint
- **Status code** — correct for the outcome (see table below).
- **Response body** — schema/shape, data types, required fields present.
- **Data correctness** — values match what was sent/stored (echo checks after create/update).
- **Headers** — `Content-Type`, auth requirements, caching where relevant.
- **Negative paths** — not found, unauthorized, forbidden, malformed input.
- **Idempotency & side effects** — did the operation actually change (or not change) state?

## Common status codes
| Code | Meaning | Typical use |
|------|---------|-------------|
| 200 | OK | successful GET/PUT/PATCH |
| 201 | Created | successful POST (resource created) |
| 204 | No Content | successful DELETE with no body |
| 400 | Bad Request | malformed/invalid input |
| 401 | Unauthorized | missing/invalid authentication |
| 403 | Forbidden | authenticated but not allowed |
| 404 | Not Found | resource doesn't exist |
| 500 | Internal Server Error | server fault (never for bad client input) |

## Auth patterns
- **Token/Bearer:** obtain via a login/auth call, send on protected requests.
- **Cookie:** e.g. Restful-Booker uses `Cookie: token=<token>` for PUT/PATCH/DELETE.
- Always test: valid token, **missing** token, and **invalid** token.

## CRUD lifecycle test
Create → Read (verify created) → Update (verify changed) → Delete → Read (verify 404).
Run on a **freshly created** record so the test doesn't depend on shared data.

## Observations from Restful-Booker (TP-003)
Good reminders that "works" isn't the same as "correct":
- Bad credentials returned **200** (should be **401**).
- Health check returned **201** (should be **200**).
- Delete returned **201** (should be **200/204**).
- Malformed create returned **500** (should be **400** — a client error must never surface a 500).

**Takeaway:** always assert the *specific* expected status code, not just "not an error" — that's how
these design issues surface.

## Tools
- **curl** — quick recon and one-off checks.
- **Postman / Newman** — interactive + collection runs ([collection](../../03-api-testing/collections/)).
- **Playwright `request`** — code-based, CI-friendly ([tests](../../04-automation/api/)).
