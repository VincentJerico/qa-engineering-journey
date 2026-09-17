# API Scenarios: Restful-Booker — Health & Auth

| Field | Value |
|-------|-------|
| **Area** | Health check, Authentication |
| **Related plan** | [TP-003](../documentation/TP-003-restful-booker.md) |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Author** | Vincent Jerico |

---

### SC-API-001 — Health check
**Method:** `GET /ping` · **Auth:** none · **Priority:** High
| Assertion | Expected |
|-----------|----------|
| Status code | 201 |
| Body | contains "Created" |

---

### SC-API-002 — Create auth token (valid credentials)
**Method:** `POST /auth` · **Auth:** none · **Priority:** High
**Body:** `{"username":"admin","password":"password123"}`
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | contains a `token` string (non-empty) |

---

### SC-API-003 — Auth with bad credentials
**Method:** `POST /auth` · **Auth:** none · **Priority:** High · **Technique:** Negative
**Body:** `{"username":"bad","password":"bad"}`
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | `{"reason":"Bad credentials"}`; no `token` field |
| Observation | A real API should return 401 Unauthorized here (see API reference) |

---

### SC-API-004 — Auth with missing fields
**Method:** `POST /auth` · **Auth:** none · **Priority:** Medium · **Technique:** Negative
**Body:** `{}`
| Assertion | Expected |
|-----------|----------|
| Status code | 200 |
| Body | Bad-credentials style response; no `token` |
| Note | Confirm actual behavior at execution |

---

## Notes
- The token from SC-API-002 is reused for all protected operations (PUT/PATCH/DELETE) as
  `Cookie: token=<token>`.
