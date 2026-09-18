# Security Testing

Defensive, black-box security testing of the practice apps used elsewhere in this repo
(SauceDemo, Restful-Booker). Scope is limited to **non-destructive checks** — auth behavior, access
control, security headers, transport security, and read-only injection *probes*. No exploitation, no
destructive actions.

> ⚠️ Only test systems you own or are explicitly authorized to test. These are public demo apps
> intended for practice; the same techniques against systems without permission would be illegal.

## Contents
```
07-security-testing/
├── security-checklist.md               # OWASP-oriented checklist adapted to these apps
├── security-test-cases.md              # concrete SEC-* cases with technique + OWASP mapping
└── RESULTS-2026-09-18-security.md       # execution report (TER-007) — verified live
```

## Approach
Mapped to the [OWASP Top 10 (2021)](https://owasp.org/Top10/). Each check is defensive: verify a
control exists (or document that it's missing) without attempting to break or damage anything.

## Highlights from the live run
**Good:** no user enumeration on SauceDemo login, access control enforced on protected routes, the
Restful-Booker booking filter is not SQL-injectable, writes require a valid token.
**Gaps:** both apps are missing standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options,
CSP); Restful-Booker returns **200** for bad credentials. See [TER-007](RESULTS-2026-09-18-security.md).
