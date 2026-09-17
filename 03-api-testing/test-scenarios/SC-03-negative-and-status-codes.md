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

---

### SC-API-025 — Create with malformed / incomplete body
**Method:** `POST /booking` · **Auth:** none · **Priority:** Medium · **Technique:** Negative / boundary
**Body:** `{"firstname":"OnlyName"}` (missing required fields)
| Assertion | Expected |
|-----------|----------|
| Status code | Document actual (Restful-Booker tends to return **500** for malformed create) |
| Note | Record actual behavior; on a real API a **400 Bad Request** would be expected |

---

## Notes
- SC-API-021/023 also assert the **side effect** (record unchanged / still present), not just the
  status code — access-control tests should prove the operation had no effect.
