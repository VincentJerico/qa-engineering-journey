import { test, expect } from '@playwright/test';
import { getToken, sampleBooking } from './helpers.js';

/**
 * Booking CRUD lifecycle — automates SC-API-010..016.
 * Runs serially on a single freshly-created booking (create → read → put → patch → delete → verify).
 * Scenarios: ../../../03-api-testing/test-scenarios/SC-02-booking-crud.md
 */
test.describe.serial('Restful-Booker — Booking CRUD', () => {
  let token: string;
  let bookingId: number;

  test.beforeAll(async ({ request }) => {
    token = await getToken(request);
  });

  test('SC-API-010: GET /booking lists booking ids', async ({ request }) => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);
    const arr = await res.json();
    expect(Array.isArray(arr)).toBe(true);
    expect(arr[0]).toHaveProperty('bookingid');
  });

  test('SC-API-011: POST /booking creates a booking', async ({ request }) => {
    const res = await request.post('/booking', { data: sampleBooking() });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(typeof json.bookingid).toBe('number');
    expect(json.booking.firstname).toBe('Vincent');
    bookingId = json.bookingid;
  });

  test('SC-API-012: GET /booking/:id returns the created booking', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.firstname).toBe('Vincent');
    expect(b.bookingdates).toHaveProperty('checkin', '2026-10-01');
  });

  test('SC-API-013: PUT /booking/:id updates the booking (with auth)', async ({ request }) => {
    const res = await request.put(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: {
        firstname: 'Vince',
        lastname: 'Updated',
        totalprice: 200,
        depositpaid: false,
        bookingdates: { checkin: '2026-11-01', checkout: '2026-11-03' },
        additionalneeds: 'Lunch',
      },
    });
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.firstname).toBe('Vince');
    expect(b.totalprice).toBe(200);
  });

  test('SC-API-014: PATCH /booking/:id partially updates (with auth)', async ({ request }) => {
    const res = await request.patch(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: { firstname: 'Patched' },
    });
    expect(res.status()).toBe(200);
    const b = await res.json();
    expect(b.firstname).toBe('Patched');
    expect(b.lastname).toBe('Updated'); // unchanged
  });

  test('SC-API-015: DELETE /booking/:id deletes the booking (with auth)', async ({ request }) => {
    const res = await request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);
  });

  test('SC-API-016: GET /booking/:id after delete returns 404', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(404);
  });
});
