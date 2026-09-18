// Smoke test — minimal load, verifies the system works and is fast enough at rest.
// Run:  k6 run scripts/smoke.js
import { sleep } from 'k6';
import { readFlow } from './lib/config.js';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    http_req_failed: ['rate<0.01'],       // <1% errors
    http_req_duration: ['p(95)<2000'],    // 95th percentile under 2s
    checks: ['rate>0.99'],                // ~all functional checks pass
  },
};

export default function () {
  readFlow();
  sleep(1);
}
