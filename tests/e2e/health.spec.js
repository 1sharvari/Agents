const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('Backend API Automated QA Checks', () => {
  test('Health Check API returns 200 and healthy status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/health`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Backend is running');
    expect(body.timestamp).toBeDefined();
  });

  test('User API returns valid mock profile', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/user`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user.username).toBe('testuser');
  });

  test('Products API returns catalog list', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/products`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
  });
});
