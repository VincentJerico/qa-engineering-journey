# API Scenarios: Restful-Booker — Negative & Status Codes

| Field | Value |
|-------|-------|
| **Area** | Negative cases, access control, status codes |
| **Related plan** | [TP-003](../documentation/TP-003-restful-booker.md) |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Author** | Vincent Jerico |

---

### SC-API-020 — Get non-existent booking
**Method:** `GET /booking/99999999` · **Auth:** none · **Priority:** High · **Technique:** Negative
| Assertion | Expected |
|-----------|----------|
| Status code | 404 |

---

### SC-API-021 — Update (PUT) without auth
**Method:** `PUT /booking/:id` · **Auth:** none · **Priority:** High · **Technique:** Access control
| Assertion | Expected |
|-----------|----------|
| Status code | 403 |
| Effect | booking is **not** modified |

---

### SC-API-022 — Patch without auth
**Method:** `PATCH /booking/:id` · **Auth:** none · **Priority:** High · **Technique:** Access control
| Assertion | Expected |
|-----------|----------|
| Status code | 403 |
| Effect | booking is **not** modified |

---

### SC-API-023 — Delete without auth
**Method:** `DELETE /booking/:id` · **Auth:** none · **Priority:** High · **Technique:** Access control
| Assertion | Expected |
|-----------|----------|
| Status code | 403 |
| Effect | booking still exists (GET → 200) |

---

### SC-API-024 — Update with an invalid token
**Method:** `PUT /booking/:id` · **Auth:** `Cookie: token=invalid` · **Priority:** Medium · **Technique:** Negative
| Assertion | Expected |
|-----------|----------|
| Status code | 403 |
| Effect | booking is **not** modified |

---

### SC-API-025 — Create with malformed / incomplete body
**Method:** `POST /booking` · **Auth:** none · **Priority:** Medium · **Technique:** Negative / boundary
**Body:** `{"firstname":"OnlyName-<timestamp>"}` (missing required fields; unique name so the effect is checkable)
| Assertion | Expected |
|-----------|----------|
| Status code | **500** (observed actual, pinned exactly so a 502/503 outage or a fix to 400 is noticed) |
| Effect | no booking created (`GET /booking?firstname=<name>` → `[]`) |
| Note | Record actual behavior; on a real API a **400 Bad Request** would be expected |

---

## Notes
- SC-API-021..025 also assert the **side effect** (record unchanged / still present), not just the
  status code — access-control tests should prove the operation had no effect.
