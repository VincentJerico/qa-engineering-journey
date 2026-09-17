# API Test Execution Report — Restful-Booker (TP-003)

| Field | Value |
|-------|-------|
| **Report ID** | TER-004 |
| **Related plan** | [TP-003](../documentation/TP-003-restful-booker.md) |
| **Application** | Restful-Booker — https://restful-booker.herokuapp.com |
| **Tester** | Vincent Jerico |
| **Date** | 2026-09-17 |
| **Method** | Manual (curl) recon + automated (Playwright request API, `../../04-automation/api/`) |

## Summary
| Metric | Count |
|--------|------:|
| Scenarios executed | 17 |
| Passed | 17 |
| Failed | 0 |
| Design observations | 5 |

All scenarios pass. The API is functionally correct for the happy paths and enforces auth on
protected operations. Five status-code/design observations were recorded — on a real production API,
items #1 and #5 below would be raised as defects.

## Results

### Health & Auth (SC-API-001..004)
| Scenario | Expected | Actual | Result |
|----------|----------|--------|--------|
| SC-API-001 GET /ping | 201, "Created" | 201 | ✅ |
| SC-API-002 POST /auth valid | 200 + token | 200 + token | ✅ |
| SC-API-003 POST /auth bad creds | 200, "Bad credentials", no token | as expected | ✅ |
| SC-API-004 POST /auth empty body | 200, no token | as expected | ✅ |

### Booking CRUD (SC-API-010..016)
| Scenario | Expected | Actual | Result |
|----------|----------|--------|--------|
| SC-API-010 GET /booking | 200, array of ids | 200 | ✅ |
| SC-API-011 POST /booking | 200 + `{bookingid, booking}` | 200 | ✅ |
| SC-API-012 GET /booking/:id | 200, matches created | 200 | ✅ |
| SC-API-013 PUT (auth) | 200, fields updated | 200 | ✅ |
| SC-API-014 PATCH (auth) | 200, partial update | 200 | ✅ |
| SC-API-015 DELETE (auth) | 201 | 201 | ✅ |
| SC-API-016 GET after delete | 404 | 404 | ✅ |

### Negative & Access Control (SC-API-020..025)
| Scenario | Expected | Actual | Result |
|----------|----------|--------|--------|
| SC-API-020 GET missing id | 404 | 404 | ✅ |
| SC-API-021 PUT no auth | 403, unchanged | 403, unchanged | ✅ |
| SC-API-022 PATCH no auth | 403 | 403 | ✅ |
| SC-API-023 DELETE no auth | 403, still exists | 403, still exists | ✅ |
| SC-API-024 PUT invalid token | 403 | 403 | ✅ |
| SC-API-025 POST incomplete body | ≥ 400 | **500** | ✅ (documented) |

## Design observations (candidate defects on a real API)
| # | Observation | Actual | Expected on a real API |
|---|-------------|--------|------------------------|
| 1 | Bad credentials on `POST /auth` | **200** + `{"reason":"Bad credentials"}` | **401 Unauthorized** |
| 2 | `GET /ping` health check | **201 Created** | **200 OK** |
| 3 | `DELETE /booking/:id` success | **201 Created** | **200 OK** / **204 No Content** |
| 4 | Missing auth on protected ops | **403 Forbidden** | **401 Unauthorized** (403 fits an *authenticated but not permitted* case) |
| 5 | Malformed `POST /booking` | **500 Internal Server Error** | **400 Bad Request** |

**Most significant:** #5 (a malformed request should never surface a 500) and #1 (auth failures
should be 401). Both would be logged as defects against a real service.

## Execution notes
- Verified with curl first (recon), then encoded as 17 automated Playwright API tests — all green (7.8s).
- CRUD runs as a serial lifecycle on a freshly-created booking; negative tests create their own
  isolated records and assert side-effects, not just status codes.
- The Postman collection in `../collections/` mirrors these scenarios for interactive/Newman runs.
