# Security Test Execution Report

| Field | Value |
|-------|-------|
| **Report ID** | TER-007 |
| **Targets** | SauceDemo (https://www.saucedemo.com), Restful-Booker (https://restful-booker.herokuapp.com) |
| **Scope** | Non-destructive black-box checks (auth, access control, headers, transport, read-only injection probe) |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-18 |

> Public practice apps, tested defensively. No exploitation or destructive actions were performed.

## Summary
| Result | Count |
|--------|------:|
| Controls verified present (PASS) | 8 |
| Gaps / weaknesses found | 7 |

Both apps get the fundamentals right (HTTPS, access control, no user enumeration, no SQLi on the
tested filter) but share the most common real-world gap: **missing HTTP security headers**.

## Passing controls ✅
| ID | Check | Evidence |
|----|-------|----------|
| SEC-001 | Direct `/inventory.html` blocked when logged out | redirect + "…only access…when you are logged in" |
| SEC-002 | Session not restored via Back after logout | returns to login (TP-001 TC-LOGIN-011) |
| SEC-003 | Writes without token rejected | PUT/PATCH/DELETE → 403 |
| SEC-004 | Invalid token rejected | PUT with `token=invalid` → 403 |
| SEC-005 | No user enumeration | wrong username and wrong password give the **same** generic error |
| SEC-007 | No SQL injection on `firstname` filter | `' OR '1'='1` → **0 rows** (literal match), status 200, no error |
| SEC-008 | HTTPS enforced | both served over TLS |
| SEC-009 | Password field masked | `type="password"` |

## Gaps / weaknesses ⚠️
| ID | Severity | Finding | Detail |
|----|----------|---------|--------|
| SEC-010 | Medium | **No HSTS** header | neither app sends `Strict-Transport-Security` |
| SEC-011 | Medium | **No `X-Content-Type-Options: nosniff`** | MIME-sniffing not prevented |
| SEC-012 | Medium | **No `X-Frame-Options` / CSP frame-ancestors** | clickjacking not mitigated |
| SEC-013 | Medium | **No Content-Security-Policy** | no XSS/content mitigation layer |
| SEC-006 | Low-Med | Bad credentials → **200** (Restful-Booker) | should be **401**; returns `{"reason":"Bad credentials"}` |
| SEC-014 | Low | Tech disclosure | `Server: GitHub.com` / `Server: Heroku`, `X-Powered-By: Express` |
| SEC-015 | Low | Permissive CORS (SauceDemo) | `Access-Control-Allow-Origin: *` (static site → low risk, still noted) |

## Notes on severity
- The missing-header findings are **Medium** for a real app: they're defense-in-depth controls, easy
  to add (a few response headers), and their absence widens the blast radius of other bugs (e.g. XSS,
  clickjacking, protocol downgrade).
- SEC-006 (auth 200 instead of 401) is a correctness/spec issue more than an exploit, but incorrect
  auth status codes can confuse clients and monitoring.
- The **positives matter too**: proving *no* user enumeration and *no* SQLi is as much a security test
  result as finding a gap.

## Recommendations
1. Add security headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
   `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`), and a baseline `Content-Security-Policy`.
2. Return **401** for failed authentication.
3. Reduce tech-disclosure headers where the platform allows.
4. Tighten CORS to specific origins on any endpoint that returns sensitive data.

## Commands used (reproducible)
```bash
# security headers
curl -sI https://www.saucedemo.com | grep -iE "strict-transport|x-content-type|x-frame|content-security|referrer-policy"
curl -sI https://restful-booker.herokuapp.com/ping | grep -iE "strict-transport|x-content-type|x-frame|content-security|referrer-policy"

# read-only SQLi probe (expect 0 rows, treated as literal)
curl -s "https://restful-booker.herokuapp.com/booking?firstname=%27%20OR%20%271%27%3D%271" | python3 -c "import sys,json;print(len(json.load(sys.stdin)))"

# auth status code
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://restful-booker.herokuapp.com/auth \
  -H "Content-Type: application/json" -d '{"username":"bad","password":"bad"}'
```
