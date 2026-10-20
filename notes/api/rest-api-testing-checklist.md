# REST API testing checklist

## What to check on every endpoint

- Status code: the right one for the outcome (see the table below).
- Response body: the shape, data types and required fields.
- Data: the values match what was sent or stored. After a create or update, read it back.
- Headers: `Content-Type`, auth requirements, and caching where it matters.
- Negative paths: not found, unauthorized, forbidden and malformed input.
- Side effects: did the call actually change state, or correctly leave it alone?

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

- Bearer token: get it from a login or auth call and send it on protected requests.
- Cookie: Restful-Booker, for example, expects `Cookie: token=<token>` on PUT, PATCH and DELETE.
- Always test three cases: a valid token, a missing token and an invalid token.

## CRUD lifecycle test

Create the record, read it back, update it and check the change, delete it, then confirm a read
returns 404. Use a record the test just created, so it doesn't depend on shared data.

## Observations from Restful-Booker (TP-003)

A call that "works" isn't necessarily correct:

- Bad credentials returned 200 instead of 401.
- The health check returned 201 instead of 200.
- Delete returned 201 instead of 200 or 204.
- A malformed create returned 500 instead of 400. A client error should never surface as a 500.

Assert the exact status code you expect, not just "not an error". That's how these design issues
show up.

## Tools

- curl, for quick recon and one-off checks.
- Postman and Newman, for interactive work and collection runs ([collection](../../03-api-testing/collections/)).
- Playwright `request`, for code-based tests that run in CI ([tests](../../04-automation/api/)).
