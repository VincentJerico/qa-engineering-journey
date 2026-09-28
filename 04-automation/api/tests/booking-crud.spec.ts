import { test, expect } from '@playwright/test';
import { createBooking, getToken, sampleBooking } from './helpers.js';

/**
 * Booking CRUD lifecycle — automates SC-API-010..016.
 * Each test creates its own booking, so tests are independent of order and of each other.
 * Scenarios: ../../../03-api-testing/test-scenarios/SC-02-booking-crud.md
 */
test.describe('Restful-Booker — Booking CRUD', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getToken(request);
  });

  test('SC-API-010: GET /booking lists booking ids', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);
    const arr = await res.json();
    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toContainEqual({ bookingid: id });
  });

  test('SC-API-011: POST /booking creates a booking', async ({ request }) => {
    const res = await request.post('/booking', { data: sampleBooking() });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(typeof json.bookingid).toBe('number');
    expect(json.booking.firstname).toBe('Vincent');
  });

  test('SC-API-012: GET /booking/:id returns the created booking', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(sampleBooking());
  });

  test('SC-API-013: PUT /booking/:id updates the booking (with auth)', async ({ request }) => {
    const { id } = await createBooking(request);
    const updated = {
      firstname: 'Vince',
      lastname: 'Updated',
      totalprice: 200,
      depositpaid: false,
      bookingdates: { checkin: '2026-11-01', checkout: '2026-11-03' },
      additionalneeds: 'Lunch',
    };
    const res = await request.put(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: updated,
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(updated);
    const check = await request.get(`/booking/${id}`);
    expect(await check.json()).toEqual(updated);
  });

  test('SC-API-014: PATCH /booking/:id partially updates (with auth)', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.patch(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: { firstname: 'Patched' },
    });
    expect(res.status()).toBe(200);
    const check = await request.get(`/booking/${id}`);
    expect(await check.json()).toEqual({ ...sampleBooking(), firstname: 'Patched' });
  });

  test('SC-API-015: DELETE /booking/:id deletes the booking (with auth)', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);
  });

  test('SC-API-016: GET /booking/:id after delete returns 404', async ({ request }) => {
    const { id } = await createBooking(request);
    const del = await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(del.status()).toBe(201);
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(404);
  });
});
