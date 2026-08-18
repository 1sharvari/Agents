const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// --------------------------------------------------
// Middleware
// --------------------------------------------------

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Request logging
// --------------------------------------------------

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------
// User API
// --------------------------------------------------

app.get('/api/user', (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      username: 'testuser',
      password: 'password123'
    }
  });
});

// --------------------------------------------------
// Login API - demo only
// --------------------------------------------------

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

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
        username: 'testuser'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log('');
  console.log('====================================');
  console.log('      Node Backend Started');
  console.log('====================================');
  console.log(`Server:  http://localhost:${PORT}`);
  console.log(`Health:  http://localhost:${PORT}/api/health`);
  console.log(`User:    http://localhost:${PORT}/api/user`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log('====================================');
  console.log('');
});