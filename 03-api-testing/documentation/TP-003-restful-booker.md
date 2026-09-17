# Test Plan: Restful-Booker API

| Field | Value |
|-------|-------|
| **Plan ID** | TP-003 |
| **Type** | API (REST) |
| **Application** | Restful-Booker |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Status** | ✅ Executed (2026-09-17) |

---

## 1. Introduction
Restful-Booker is a public REST API for practicing API testing. It exposes authentication, full CRUD
on bookings, and a health-check endpoint — enough to exercise status codes, request/response
validation, auth, and negative cases.

## 2. Objectives
- Validate each endpoint's success behavior (status code, response body, schema).
- Verify authentication and access control on protected operations.
- Cover negative cases: not-found, missing auth, bad credentials, malformed requests.
- Confirm the full CRUD lifecycle (create → read → update → patch → delete → verify gone).

## 3. Scope

### 3.1 In scope
- `GET /ping` (health)
- `POST /auth` (token; valid + bad credentials)
- `GET /booking`, `GET /booking/:id`
- `POST /booking` (create)
- `PUT /booking/:id`, `PATCH /booking/:id` (with and without auth)
- `DELETE /booking/:id`
- Status-code and response-schema checks; auth/access control

### 3.2 Out of scope
- Load/performance and security testing
- Rate limiting and concurrency
- Exhaustive query-filter combinations (a representative subset only)

## 4. Test Approach
Black-box API testing. Scenarios are grouped by area (health/auth, CRUD, negative/status codes) and
documented in `../test-scenarios/`. Techniques: **equivalence partitioning** (valid/invalid inputs),
**status-code verification**, and **CRUD lifecycle** end-to-end. Executed both manually (curl) and
via automated tests (Playwright request API in `../../04-automation/api/`).

## 5. Test Environment
- **Tools:** curl (manual), Playwright request API (automated), Postman collection (`../collections/`)
- **Auth:** `POST /auth` with `admin` / `password123`; token sent as `Cookie: token=<token>`
- **Data:** bookings created per test and cleaned up (deleted) where applicable

## 6. Deliverables
- This plan (`TP-003-restful-booker.md`)
- API reference ([API-REFERENCE-restful-booker.md](API-REFERENCE-restful-booker.md))
- Test scenarios (`../test-scenarios/SC-01..03`)
- Execution report ([TER-004](../test-scenarios/RESULTS-2026-09-17-restful-booker.md))
- Postman collection + environment (`../collections/`)
- Automated tests (`../../04-automation/api/`)

## 7. Entry / Exit Criteria
- **Entry:** API reachable (`GET /ping` → 201); scenarios drafted.
- **Exit:** all scenarios executed; behavior documented; observations recorded.

## 8. Risks & Assumptions
- **Risk:** public demo may be slow/unavailable, or shared data may change.
  **Mitigation:** create isolated bookings per test; assert on the created record.
- **Assumption:** admin credentials remain `admin` / `password123`.

## 9. Scenario Index
| Area | File |
|------|------|
| Health & Auth | [SC-01-health-and-auth.md](../test-scenarios/SC-01-health-and-auth.md) |
| Booking CRUD | [SC-02-booking-crud.md](../test-scenarios/SC-02-booking-crud.md) |
| Negative & Status Codes | [SC-03-negative-and-status-codes.md](../test-scenarios/SC-03-negative-and-status-codes.md) |
