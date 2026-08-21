/**
 * @fileoverview Node.js Express REST API mock service implementing architecture plan.
 * @module Server
 * @standards Clean Architecture, SOLID Principles, Modular Design
 * @feature SHOP-28 - [Feature] User Authentication & Product Catalog Flow
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// User profile endpoint
app.get('/api/user', (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      username: 'testuser',
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'Standard User'
    }
  });
});

// User login endpoint
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
        name: 'Test User',
        email: 'testuser@example.com',
        token: 'jwt-mock-token-12345'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

// Product catalog endpoint
app.get('/api/products', (req, res) => {
  res.status(200).json({
    success: true,
    products: [
      {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        category: 'Electronics',
        inStock: true
      },
      {
        id: 2,
        name: 'Ergonomic Keyboard',
        price: 49.99,
        category: 'Accessories',
        inStock: true
      },
      {
        id: 3,
        name: 'Smart Fitness Watch',
        price: 149.99,
        category: 'Wearables',
        inStock: true
      }
    ]
  });
});

// Simulated error endpoint for 500 error boundary test
app.get('/api/error-test', (req, res, next) => {
  const err = new Error('Simulated internal server error');
  next(err);
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// 500 Error Boundary Middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message || 'Unknown error'
  });
});

// Server start if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
