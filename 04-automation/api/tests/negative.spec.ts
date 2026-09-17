import { test, expect } from '@playwright/test';
import { createBooking, sampleBooking } from './helpers.js';

/**
 * Negative & access control — automates SC-API-020..025.
 * Scenarios: ../../../03-api-testing/test-scenarios/SC-03-negative-and-status-codes.md
 */
test.describe('Restful-Booker — Negative & Access Control', () => {
  test('SC-API-020: GET non-existent booking returns 404', async ({ request }) => {
    const res = await request.get('/booking/99999999');
    expect(res.status()).toBe(404);
  });

  test('SC-API-021: PUT without auth returns 403 and does not modify', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.put(`/booking/${id}`, {
      data: { ...sampleBooking(), firstname: 'NoAuth' },
    });
    expect(res.status()).toBe(403);
    // Side effect: record unchanged
    const check = await request.get(`/booking/${id}`);
    expect(check.status()).toBe(200);
    expect((await check.json()).firstname).toBe('Vincent');
  });

  test('SC-API-022: PATCH without auth returns 403', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.patch(`/booking/${id}`, { data: { firstname: 'NoAuth' } });
    expect(res.status()).toBe(403);
  });

  test('SC-API-023: DELETE without auth returns 403 and record still exists', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.delete(`/booking/${id}`);
    expect(res.status()).toBe(403);
    const check = await request.get(`/booking/${id}`);
    expect(check.status()).toBe(200);
  });

  test('SC-API-024: PUT with an invalid token returns 403', async ({ request }) => {
    const { id } = await createBooking(request);
    const res = await request.put(`/booking/${id}`, {
      headers: { Cookie: 'token=invalid' },
      data: sampleBooking(),
    });
    expect(res.status()).toBe(403);
  });

  test('SC-API-025: POST with incomplete body is rejected (documents actual status)', async ({ request }) => {
    const res = await request.post('/booking', { data: { firstname: 'OnlyName' } });
    // Restful-Booker returns 500 for malformed create; a real API should return 400.
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
