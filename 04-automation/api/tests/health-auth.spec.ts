import { test, expect } from '@playwright/test';
import { ADMIN } from './helpers.js';

/**
 * Health & Auth — automates SC-API-001..004.
 * Scenarios: ../../../03-api-testing/test-scenarios/SC-01-health-and-auth.md
 */
test.describe('Restful-Booker — Health & Auth', () => {
  test('SC-API-001: GET /ping returns 201', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
    expect(await res.text()).toContain('Created');
  });

  test('SC-API-002: POST /auth with valid credentials returns a token', async ({ request }) => {
    const res = await request.post('/auth', { data: ADMIN });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(typeof json.token).toBe('string');
    expect(json.token.length).toBeGreaterThan(0);
  });

  test('SC-API-003: POST /auth with bad credentials returns Bad credentials (no token)', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'bad', password: 'bad' } });
    // Documented observation: the API returns 200 (not 401) for bad credentials.
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.reason).toBe('Bad credentials');
    expect(json.token).toBeUndefined();
  });

  test('SC-API-004: POST /auth with missing fields does not return a token', async ({ request }) => {
    const res = await request.post('/auth', { data: {} });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.token).toBeUndefined();
  });
});
