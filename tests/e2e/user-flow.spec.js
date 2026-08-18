const { test, expect } = require('@playwright/test');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

test.describe('User Authentication & Login Flow E2E QA Verification', () => {
  test('Scenario 1: Successful Login with valid credentials', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/login`, {
      data: {
        username: 'testuser',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Login successful');
    expect(body.user.username).toBe('testuser');
  });

  test('Scenario 2: Failed Login with invalid password', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/login`, {
      data: {
        username: 'testuser',
        password: 'wrongpassword'
      }
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid username or password');
  });

  test('Scenario 3: Validation Error on missing parameters', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/login`, {
      data: {
        username: 'testuser'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Username and password are required');
  });
});
