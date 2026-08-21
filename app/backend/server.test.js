/**
 * @fileoverview Unit test suite for Node.js Express REST API server endpoints (>80% coverage).
 * @module ServerTests
 * @standards Clean Architecture, Jest / Supertest
 * @feature User Authentication & Product Catalog / SHOP
 */

const request = require('supertest');
const app = require('./server');

describe('Node Backend REST API Unit Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK and health status message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Backend is running');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/user', () => {
    it('should return mock user profile', async () => {
      const res = await request(app).get('/api/user');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.user.email).toBe('testuser@example.com');
    });
  });

  describe('POST /api/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user.username).toBe('testuser');
      expect(res.body.user.token).toBeDefined();
    });

    it('should return 401 Unauthorized for invalid password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid username or password');
    });

    it('should return 401 Unauthorized for unknown username', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'unknownuser', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid username or password');
    });

    it('should return 400 Bad Request when username is missing', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Username and password are required');
    });

    it('should return 400 Bad Request when password is missing', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'testuser' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Username and password are required');
    });
  });

  describe('GET /api/products', () => {
    it('should return list of mock products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body.products[0]).toHaveProperty('name');
      expect(res.body.products[0]).toHaveProperty('price');
    });
  });

  describe('404 Route Handling', () => {
    it('should return 404 for unmapped route', async () => {
      const res = await request(app).get('/api/non-existing-route');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Route not found');
    });
  });

  describe('500 Error Boundary Handling', () => {
    it('should handle internal server errors gracefully with 500 status', async () => {
      const res = await request(app).get('/api/error-test');
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Internal server error');
    });
  });
});
