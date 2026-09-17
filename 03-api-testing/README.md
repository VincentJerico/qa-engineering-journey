# API Testing

API test artifacts for the QA journey. First target: **Restful-Booker**, a public API purpose-built
for test practice (auth token, full CRUD, health check).

## Structure
```
03-api-testing/
├── documentation/
│   ├── API-REFERENCE-restful-booker.md     # endpoint reference (verified live)
│   └── TP-003-restful-booker.md            # API test plan
├── test-scenarios/
│   ├── SC-01-health-and-auth.md
│   ├── SC-02-booking-crud.md
│   ├── SC-03-negative-and-status-codes.md
│   └── RESULTS-2026-09-17-restful-booker.md # execution report (TER-004)
└── collections/
    ├── restful-booker.postman_collection.json
    └── restful-booker.postman_environment.json
```

Executable API tests live in [`../04-automation/api/`](../04-automation/api/) (Playwright request API),
mirroring the UI automation pattern.

## Target API
- **Base URL:** https://restful-booker.herokuapp.com
- **Docs:** https://restful-booker.herokuapp.com/apidoc/index.html
- **Auth:** `POST /auth` returns a token; send it as `Cookie: token=<token>` on PUT/PATCH/DELETE.
- **Admin creds:** `admin` / `password123`
