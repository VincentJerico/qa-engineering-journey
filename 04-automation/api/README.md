# Restful-Booker API Automation (Playwright)

Automated API tests for [Restful-Booker](https://restful-booker.herokuapp.com), derived from the
scenarios in [TP-003](../../03-api-testing/documentation/TP-003-restful-booker.md). Each test title
carries its scenario ID (e.g. `SC-API-011`) for traceability.

## Stack

- [Playwright Test](https://playwright.dev) `request` fixture (HTTP only — **no browser needed**, so
  no `playwright install` step).

## Setup & run

```bash
cd 04-automation/api
npm install
npm test           # runs all API specs
npm run report     # open the last HTML report
```

## Structure

```
api/
├── playwright.config.ts     # baseURL + default JSON headers
└── tests/
    ├── helpers.ts           # getToken(), createBooking(), sampleBooking()
    ├── health-auth.spec.ts  # SC-API-001..004
    ├── booking-crud.spec.ts # SC-API-010..016 (CRUD lifecycle)
    └── negative.spec.ts     # SC-API-020..025
```

## Notes

- Each `booking-crud.spec.ts` test creates its own booking, so tests don't depend on shared data
  or on run order. Writes are verified by reading the booking back, not by the echoed response.
- Negative tests assert **side effects** (record unchanged / still present), not just status codes.
- Tests hit the live public API; results depend on it being reachable.
