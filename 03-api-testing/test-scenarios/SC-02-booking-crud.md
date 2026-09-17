# API Scenarios: Restful-Booker — Booking CRUD

| Field | Value |
|-------|-------|
| **Area** | Booking lifecycle (Create, Read, Update, Patch, Delete) |
| **Related plan** | [TP-003](../documentation/TP-003-restful-booker.md) |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Author** | Vincent Jerico |

**Precondition:** a valid token (SC-API-002) for update/patch/delete.

---

### SC-API-010 — List bookings
**Method:** `GET /booking` · **Auth:** none · **Priority:** Medium
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | JSON array of `{ "bookingid": <int> }` (non-empty) |

---

### SC-API-011 — Create a booking
**Method:** `POST /booking` · **Auth:** none · **Priority:** High
**Headers:** `Content-Type: application/json`, `Accept: application/json`
**Body:**
```json
{"firstname":"Vincent","lastname":"Jerico","totalprice":150,"depositpaid":true,
 "bookingdates":{"checkin":"2026-10-01","checkout":"2026-10-05"},"additionalneeds":"Breakfast"}
```
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | `{ "bookingid": <int>, "booking": {...} }` |
| Echo | returned `booking` matches the request payload |

---

### SC-API-012 — Get the created booking
**Method:** `GET /booking/:id` · **Auth:** none · **Priority:** High
**Headers:** `Accept: application/json`
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | booking object matching the created data |

---

### SC-API-013 — Full update (PUT) with auth
**Method:** `PUT /booking/:id` · **Auth:** token · **Priority:** High
**Body:** a full booking object with changed values
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | reflects all updated fields |

---

### SC-API-014 — Partial update (PATCH) with auth
**Method:** `PATCH /booking/:id` · **Auth:** token · **Priority:** High
**Body:** `{"firstname":"Patched"}`
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | `firstname` updated; other fields unchanged |

---

### SC-API-015 — Delete the booking
**Method:** `DELETE /booking/:id` · **Auth:** token · **Priority:** High
| Assertion | Expected |
|-----------|----------|
| Status code | 201 |

---

### SC-API-016 — Verify deletion
**Method:** `GET /booking/:id` (deleted id) · **Auth:** none · **Priority:** High
| Assertion | Expected |
|-----------|----------|
| Status code | 404 |

---

## Notes
- SC-API-011 → 016 form one end-to-end CRUD lifecycle and are best run in sequence on a
  freshly-created booking (avoids depending on shared/pre-existing data).
