# Product Requirements Specification

## Feature Title: User Authentication & Product Catalog Flow

### 1. Overview
Implement user authentication (login flow) and product catalog retrieval for the shop application. The backend serves mock API data and the frontend allows the user to log in and view product details.

### 2. User Stories & Functional Requirements
1. **User Login**:
   - As a user, I want to log in using my username and password so that I can access personalized shop features.
   - Credentials for demonstration:
     - Username: `testuser`
     - Password: `password123`
   - Backend endpoint: `POST /api/login`
   - Should return success message and user profile if valid.
   - Should return `401 Unauthorized` if credentials do not match.
   - Should return `400 Bad Request` if username or password is missing.

2. **User Profile & Health Check**:
   - Endpoint: `GET /api/health` returns status of the backend service.
   - Endpoint: `GET /api/user` returns current mock user data.

3. **Product Catalog**:
   - Endpoint: `GET /api/products` returns list of products (ID, title, price, description, category, inStock).
   - Frontend UI renders the product grid with responsive cards.

### 3. Acceptance Criteria
- **Scenario 1: Successful Login**
  - **Given** the user is on the login page
  - **When** the user enters username `"testuser"` and password `"password123"` and clicks "Sign In"
  - **Then** the user is authenticated, redirected to the shop dashboard, and sees their username displayed.

- **Scenario 2: Failed Login with Invalid Credentials**
  - **Given** the user is on the login page
  - **When** the user enters an invalid username or password and submits
  - **Then** an error message `"Invalid username or password"` is displayed and login is rejected.

- **Scenario 3: API Health & Backend Service**
  - **Given** the backend server is running
  - **When** a GET request is sent to `/api/health`
  - **Then** the response status is `200 OK` with `{ "success": true, "message": "Backend is running" }`.

### 4. Technical Specifications
- **Frontend**: Angular component in `app/frontend/shop`.
- **Backend**: Node.js Express server in `app/backend/server.js`.
- **Unit Testing**: Jest unit tests in `app/backend/` with code coverage > 80%.
- **E2E Automation**: Playwright automated tests in `tests/`.
