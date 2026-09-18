// Shared config for the Restful-Booker k6 scripts.
// Override the target with:  k6 run -e BASE_URL=https://your-host scripts/<file>.js

export const BASE_URL = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com';

// A realistic read-heavy user flow: health → list → read one booking.
import http from 'k6/http';
import { check } from 'k6';

export function readFlow() {
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
    const ids = list.json();
    const id = ids[Math.floor(Math.random() * ids.length)].bookingid;
    const one = http.get(`${BASE_URL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
      tags: { name: 'getBooking' },
    });
    check(one, {
      'get booking is 200': (r) => r.status === 200,
      'booking has firstname': (r) => r.json('firstname') !== undefined,
    });
  }
}
