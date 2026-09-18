# Web/API Security Testing Checklist (OWASP-oriented)

A practical, defensive checklist for black-box security testing, mapped to the
[OWASP Top 10 (2021)](https://owasp.org/Top10/). Use it as a baseline pass on any web app or API.

## A01 — Broken Access Control
- [ ] Protected pages/endpoints require authentication (direct-URL access is blocked).
- [ ] A user cannot access another user's data by changing an ID (IDOR).
- [ ] Privileged actions (write/delete) reject unauthenticated and non-privileged requests.
- [ ] Session ends on logout; back button / reused token does not restore access.

## A02 — Cryptographic Failures
- [ ] All traffic is over HTTPS/TLS (no HTTP).
- [ ] `Strict-Transport-Security` (HSTS) header is set.
- [ ] Password fields are masked; credentials/secrets never appear in URLs or logs.
- [ ] Sensitive cookies use `Secure`, `HttpOnly`, and `SameSite`.

## A03 — Injection
- [ ] Inputs used in queries are parameterized (SQL/NoSQL injection probes have no effect).
- [ ] Output is encoded to prevent stored/reflected XSS.
- [ ] Error responses don't leak stack traces or query fragments.

## A04 — Insecure Design
- [ ] Rate limiting / lockout on auth endpoints (brute-force resistance).
- [ ] Business rules can't be bypassed (e.g. negative quantities, empty-cart checkout).

## A05 — Security Misconfiguration
- [ ] Security headers present: `X-Content-Type-Options`, `X-Frame-Options`/CSP `frame-ancestors`,
      `Content-Security-Policy`, `Referrer-Policy`.
- [ ] CORS is not needlessly permissive (`Access-Control-Allow-Origin: *` on sensitive endpoints).
- [ ] No unnecessary tech disclosure (`Server`, `X-Powered-By`).
- [ ] Default credentials / debug endpoints disabled.

## A07 — Identification & Authentication Failures
- [ ] No **user enumeration** — same message/behavior for wrong username vs wrong password.
- [ ] Failed auth returns the correct status (401), not 200.
- [ ] Strong password policy; no credentials in query strings.

## A08 — Software & Data Integrity
- [ ] Tokens are validated server-side; tampered/invalid tokens are rejected.

## A09 — Logging & Monitoring
- [ ] Security-relevant events are logged (auth failures, access denials) — without logging secrets.

## A10 — Server-Side Request Forgery (SSRF)
- [ ] User-supplied URLs are validated/allow-listed before the server fetches them.

---
### Quick header check
```bash
curl -sI https://TARGET | grep -iE "strict-transport|x-content-type|x-frame|content-security|referrer-policy"
```
### Safe SQLi probe (read-only)
Send `' OR '1'='1` in a filter param and confirm it is treated as a literal (no extra rows, no error).
