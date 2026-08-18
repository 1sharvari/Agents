const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'qa-results.json' }]
  ],
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'node ../app/backend/server.js',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: true,
    timeout: 15000
  }
});
