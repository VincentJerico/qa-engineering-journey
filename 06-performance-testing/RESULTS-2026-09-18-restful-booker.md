# Performance Test Execution Report — Restful-Booker

| Field | Value |
|-------|-------|
| **Report ID** | TER-006 |
| **Target** | Restful-Booker — https://restful-booker.herokuapp.com |
| **Tool** | k6 v2.2.0 |
| **Scenario** | Read-heavy flow: `GET /ping` → `GET /booking` → `GET /booking/:id` |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-18 |

> Load was kept modest and short — Restful-Booker is a shared public demo, so these runs are sized to
> demonstrate technique, not to hammer the service.

## Results by test type

| Test | Profile | Requests | Throughput | p95 latency | Max latency | Error rate | Checks |
|------|---------|---------:|-----------:|------------:|------------:|-----------:|-------:|
| Smoke | 1 VU, 5 iters | 15 | 1.3 req/s | 738 ms | 749 ms | 0.00% | 100% |
| Load | 10 VUs, ~70s | 804 | 11.2 req/s | 672 ms | 858 ms | 0.00% | 100% |
| Stress | ramp to 40 VUs, ~70s | 2,193 | 30.8 req/s | 229 ms | **6.22 s** | 0.27% (6) | 99.67% |

All threshold gates passed, including the stress test's looser gates (`http_req_failed<0.20`,
`p95<4000ms`).

## Interpretation
- **Smoke & load are healthy.** At 10 concurrent users the API served ~11 req/s with **zero errors**
  and p95 ≈ 0.67 s — comfortably within the 1.5 s / <5% error budget.
- **Stress reveals the ceiling in the tail, not the median.** At up to 40 VUs the *median* stayed fast
  (~214 ms) and p95 was even low (229 ms), **but**:
  - **Max latency jumped to 6.22 s** — some requests were served far slower than typical (tail-latency
    spikes are the early warning of saturation).
  - **6 requests failed (0.27%)** — all on `GET /booking/:id`, the third call in the flow. The first
    functional failures appear here, i.e. this is where degradation begins.
- **Takeaway:** the service copes with the tested levels but shows the classic saturation signature at
  ~40 VUs — a small but non-zero error rate and a long tail — while averages still look fine. This is
  exactly why performance testing looks at **percentiles and max**, not just averages.

## Threshold rationale
| Metric | Load gate | Why |
|--------|-----------|-----|
| `http_req_failed` | < 5% (load), < 20% (stress) | stress *expects* some degradation; we're finding the ceiling |
| `http_req_duration p95` | < 1.5 s (load), < 4 s (stress) | user-perceptible responsiveness under normal vs. stressed load |
| `checks` | > 95% | functional correctness must hold under load |

## How to reproduce
```bash
cd 06-performance-testing
k6 run scripts/smoke.js
k6 run scripts/load.js
k6 run scripts/stress.js
# target another host:  k6 run -e BASE_URL=https://your-host scripts/load.js
```

## Recommendations (as if this were a real service)
- Investigate the tail-latency spikes at higher concurrency (connection pool, cold instances, DB).
- Add a soak test (steady load over a longer period) to catch memory leaks / gradual degradation.
- Track p95/p99 and error rate as release gates in CI, not averages.
