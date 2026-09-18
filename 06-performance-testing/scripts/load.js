// Load test — steady, expected-level concurrency to check performance under normal use.
// Modest VUs and short duration (shared public demo). Run:  k6 run scripts/load.js
import { sleep } from 'k6';
import { readFlow } from './lib/config.js';

export const options = {
  stages: [
    { duration: '20s', target: 10 }, // ramp up to 10 virtual users
    { duration: '40s', target: 10 }, // hold at 10
    { duration: '10s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],    // <5% errors under load
    http_req_duration: ['p(95)<1500'], // p95 under 1.5s
    checks: ['rate>0.95'],
  },
};

export default function () {
  readFlow();
  sleep(1);
}
