import { type APIRequestContext, expect } from '@playwright/test';

export const ADMIN = { username: 'admin', password: 'password123' } as const;

export function sampleBooking() {
  return {
    firstname: 'Vincent',
    lastname: 'Jerico',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
    additionalneeds: 'Breakfast',
  };
}

/** Obtain an auth token via POST /auth. */
export async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: ADMIN });
  expect(res.status()).toBe(200);
  const { token } = await res.json();
  expect(token, 'auth token should be present').toBeTruthy();
  return token as string;
}

/** Create a booking and return its id and body. */
export async function createBooking(request: APIRequestContext) {
  const res = await request.post('/booking', { data: sampleBooking() });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return { id: body.bookingid as number, booking: body.booking };
}
