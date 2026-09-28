// Shared config for the Restful-Booker k6 scripts.
// Override the target with:  k6 run -e BASE_URL=https://your-host scripts/<file>.js

export const BASE_URL = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com';

import http from 'k6/http';
import { check } from 'k6';

const FIRSTNAME = 'k6perf';

// Read a booking this run created, not a random shared id another user may delete mid-run.
export function setup() {
  const res = http.post(
    `${BASE_URL}/booking`,
    JSON.stringify({
      firstname: FIRSTNAME,
      lastname: 'reader',
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-02' },
    }),
    { headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, tags: { name: 'createBooking' } },
  );
  if (res.status !== 200) throw new Error(`setup: create booking returned ${res.status}`);
  return { id: res.json('bookingid') };
}

// A realistic read-heavy user flow: health → list → read the booking created in setup().
export function readFlow({ id }) {
  const ping = http.get(`${BASE_URL}/ping`, { tags: { name: 'ping' } });
  check(ping, { 'ping is 201': (r) => r.status === 201 });

  const list = http.get(`${BASE_URL}/booking`, {
    headers: { Accept: 'application/json' },
    tags: { name: 'listBookings' },
  });
  const ok = check(list, {
    'list is 200': (r) => r.status === 200,
    'list is a non-empty array': (r) => Array.isArray(r.json()) && r.json().length > 0,
  });

  if (ok) {
    const one = http.get(`${BASE_URL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
      tags: { name: 'getBooking' },
    });
    check(one, {
      'get booking is 200': (r) => r.status === 200,
      'booking has the created firstname': (r) => r.json('firstname') === FIRSTNAME,
    });
  }
}
