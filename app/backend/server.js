/**
 * @fileoverview Node.js Express REST API server providing mock endpoints for user auth and catalog.
 * @module Server
 * @standards Clean Architecture, SOLID Principles, ESLint / Prettier
 * @feature User Authentication & Product Catalog / SHOP
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// User API
app.get('/api/user', (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      username: 'testuser',
      name: 'Test User',
      email: 'testuser@example.com'
    }
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  if (username === 'testuser' && password === 'password123') {
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: 'testuser',
        token: 'mock-jwt-token-sdlc-12345'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

// Products Catalog API
app.get('/api/products', (req, res) => {
  res.status(200).json({
    success: true,
    products: [
      { id: 1, name: 'Cloud Native Developer Kit', price: 99.99, category: 'Software', inStock: true },
      { id: 2, name: 'AI SDLC Automation Suite', price: 199.99, category: 'DevTools', inStock: true },
      { id: 3, name: 'Automated Test Runner', price: 49.99, category: 'Testing', inStock: true }
    ]
  });
});

// Test error trigger route (for testing 500 error boundary)
app.get('/api/error-test', (req, res, next) => {
  next(new Error('Simulated internal server error'));
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Server error:', err);
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start Server if executed directly
/* istanbul ignore next */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

module.exports = app;