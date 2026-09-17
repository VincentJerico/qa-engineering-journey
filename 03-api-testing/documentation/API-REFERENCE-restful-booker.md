# API Reference — Restful-Booker

Verified live on 2026-09-17. Base URL: `https://restful-booker.herokuapp.com`

Official docs: https://restful-booker.herokuapp.com/apidoc/index.html

## Authentication
Protected operations (PUT, PATCH, DELETE) require a token obtained from `POST /auth`, sent as a
cookie header: `Cookie: token=<token>`. (Basic Auth is also accepted by the API.)

Admin credentials: `admin` / `password123`.

## Endpoints

### GET /ping — Health check
| | |
|---|---|
| Auth | none |
| Success | **201 Created** (note: unusual for a health check; 200 is more conventional) |
| Body | `Created` |

### POST /auth — Create token
| | |
|---|---|
| Auth | none |
| Request | `{"username":"admin","password":"password123"}` |
| Success | **200** → `{"token":"<token>"}` |
| Bad credentials | **200** → `{"reason":"Bad credentials"}` (note: no token; a 401 would be more correct) |

### GET /booking — List booking IDs
| | |
|---|---|
| Auth | none |
| Success | **200** → `[{"bookingid":1}, ...]` |
| Filters | supports `firstname`, `lastname`, `checkin`, `checkout` query params |

### GET /booking/:id — Get a booking
| | |
|---|---|
| Auth | none |
| Headers | `Accept: application/json` to receive JSON |
| Success | **200** → booking object |
| Not found | **404** |

### POST /booking — Create a booking
| | |
|---|---|
| Auth | none |
| Headers | `Content-Type: application/json`, `Accept: application/json` |
| Success | **200** → `{"bookingid":<id>,"booking":{...}}` |

### PUT /booking/:id — Full update
| | |
|---|---|
| Auth | **required** (`Cookie: token=<token>`) |
| Success | **200** → updated booking object |
| No/invalid auth | **403 Forbidden** |

### PATCH /booking/:id — Partial update
| | |
|---|---|
| Auth | **required** |
| Success | **200** → updated booking object |
| No/invalid auth | **403 Forbidden** |

### DELETE /booking/:id — Delete a booking
| | |
|---|---|
| Auth | **required** |
| Success | **201 Created** (note: unusual; 200/204 more conventional) |
| No/invalid auth | **403 Forbidden** |

## Booking object schema
```json
{
  "firstname": "Vincent",
  "lastname": "Jerico",
  "totalprice": 150,
  "depositpaid": true,
  "bookingdates": { "checkin": "2026-10-01", "checkout": "2026-10-05" },
  "additionalneeds": "Breakfast"
}
```
| Field | Type | Notes |
|-------|------|-------|
| firstname | string | required |
| lastname | string | required |
| totalprice | integer | required |
| depositpaid | boolean | required |
| bookingdates.checkin | string (date) | required |
| bookingdates.checkout | string (date) | required |
| additionalneeds | string | optional |

## Design observations (candidate issues for a real API)
- `POST /auth` returns **200** for bad credentials instead of **401 Unauthorized**.
- `GET /ping` returns **201** rather than **200** for a health check.
- `DELETE` returns **201 Created** rather than **200 OK** / **204 No Content**.
- Missing auth returns **403 Forbidden** (arguably **401 Unauthorized** is more correct when no credentials are supplied).

These are documented as observations — Restful-Booker is a practice API, but on a real service each
would be worth raising.
