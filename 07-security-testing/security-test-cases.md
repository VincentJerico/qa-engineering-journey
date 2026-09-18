# Security Test Cases

Concrete, non-destructive security checks for SauceDemo (UI) and Restful-Booker (API), mapped to the
OWASP Top 10. Results recorded in [RESULTS-2026-09-18-security.md](RESULTS-2026-09-18-security.md).

| ID | OWASP | Target | Check | Expected (secure) |
|----|-------|--------|-------|-------------------|
| SEC-001 | A01 | SauceDemo | Direct access to `/inventory.html` while logged out | Blocked / redirected to login |
| SEC-002 | A01 | SauceDemo | Back button after logout | Session not restored |
| SEC-003 | A01 | Restful-Booker | `PUT`/`PATCH`/`DELETE` without token | 403 (rejected) |
| SEC-004 | A08 | Restful-Booker | Write with an **invalid** token | 403 (rejected) |
| SEC-005 | A07 | SauceDemo | Wrong username vs wrong password error text | Identical (no user enumeration) |
| SEC-006 | A07 | Restful-Booker | `POST /auth` with bad credentials | Should be 401 (no token) |
| SEC-007 | A03 | Restful-Booker | `' OR '1'='1` in `firstname` filter (read-only) | Treated as literal; no extra rows; no error |
| SEC-008 | A02 | Both | Traffic over HTTPS | Yes |
| SEC-009 | A02 | SauceDemo | Password field masking | `type="password"` |
| SEC-010 | A02 | Both | HSTS header (`Strict-Transport-Security`) | Present |
| SEC-011 | A05 | Both | `X-Content-Type-Options: nosniff` | Present |
| SEC-012 | A05 | Both | `X-Frame-Options` / CSP `frame-ancestors` (clickjacking) | Present |
| SEC-013 | A05 | Both | Content-Security-Policy | Present |
| SEC-014 | A05 | Both | Tech disclosure (`Server`, `X-Powered-By`) | Minimized |
| SEC-015 | A05 | SauceDemo | CORS `Access-Control-Allow-Origin` | Not `*` on sensitive responses |

## Notes
- SEC-001/002/005 were also covered functionally in TP-001 (login/access-control cases); here they're
  framed as **security** controls.
- SEC-006 corresponds to the auth status-code observation from TP-003 (API testing).
- All injection testing is **read-only probing** — confirm the control holds, never exploit or damage.
