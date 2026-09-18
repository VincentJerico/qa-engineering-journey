// Stress test — push beyond expected load to observe where performance degrades.
// Kept intentionally modest/short against the public demo. Run:  k6 run scripts/stress.js
import { sleep } from 'k6';
import { readFlow } from './lib/config.js';

export const options = {
  stages: [
    { duration: '20s', target: 10 }, // normal
    { duration: '20s', target: 25 }, // above normal
    { duration: '20s', target: 40 }, // stress
    { duration: '10s', target: 0 },  // recover
  ],
  thresholds: {
    // Looser than load.js — under stress we EXPECT degradation; we're finding the ceiling.
    http_req_failed: ['rate<0.20'],
    http_req_duration: ['p(95)<4000'],
  },
};

export default function () {
  readFlow();
  sleep(1);
}
