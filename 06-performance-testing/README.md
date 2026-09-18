# Performance Testing

Load, stress, and smoke tests for the [Restful-Booker](https://restful-booker.herokuapp.com) API,
using [k6](https://k6.io). Mirrors the API functional work in [03-api-testing](../03-api-testing/).

## Contents
```
06-performance-testing/
├── scripts/
│   ├── lib/config.js     # shared BASE_URL + the read-heavy user flow
│   ├── smoke.js          # 1 VU — sanity + baseline latency
│   ├── load.js           # 10 VUs — steady expected load
│   └── stress.js         # ramp to 40 VUs — find the degradation point
└── RESULTS-2026-09-18-restful-booker.md   # execution report (TER-006)
```

## Test types
| Type | Purpose | Profile here |
|------|---------|--------------|
| **Smoke** | Does it work + baseline speed? | 1 VU, 5 iterations |
| **Load** | Performance at expected concurrency | 10 VUs, ~70 s |
| **Stress** | Where does it start to degrade? | ramp to 40 VUs, ~70 s |

## Setup & run
```bash
# install k6 (macOS)
brew install k6

cd 06-performance-testing
k6 run scripts/smoke.js
k6 run scripts/load.js
k6 run scripts/stress.js

# point at a different host
k6 run -e BASE_URL=https://your-host scripts/load.js
```

## Key metrics (what to read)
- **http_req_duration p95 / p99** — user-perceived latency; watch percentiles, not the average.
- **http_req_failed** — error rate under load.
- **max latency** — tail spikes are the early warning of saturation (see TER-006).
- **checks** — functional correctness must hold under load, not just status 200.

Thresholds are defined per script in `options.thresholds` and act as pass/fail gates.

## Results
See [RESULTS-2026-09-18-restful-booker.md](RESULTS-2026-09-18-restful-booker.md) — smoke and load were
clean; the stress run surfaced tail-latency spikes (max 6.2 s) and the first request failures at ~40 VUs.

## Note
Restful-Booker is a shared public demo — scripts use modest VUs and short durations. Never point
high-VU stress tests at systems you don't own or have permission to test.
