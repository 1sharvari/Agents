# Engineering Coding Standards & Guidelines

This document outlines the mandatory coding standards, review checklist, and quality metrics enforced across all repositories by the **Review Agent** and engineering teams.

---

## 1. General Principles
- **Clarity over cleverness**: Code must be readable, self-explanatory, and maintainable.
- **DRY (Don't Repeat Yourself)**: Abstract common reusable logic into shared utility modules.
- **Single Responsibility Principle (SRP)**: Each function, component, or class must do one thing well.
- **Fail Gracefully**: All API routes and UI asynchronous operations must handle errors and return informative messages.

---

## 2. Backend Coding Standards (Node.js / Express)
- **Architecture**: Keep controllers, routes, and services separated.
- **Configuration**: Always use environment variables via `process.env` / `dotenv`. Never hardcode secrets or ports.
- **Error Handling**:
  - Use standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).
  - Provide standard JSON error responses: `{ "success": false, "message": "Error description" }`.
  - Always have a global 404 handler and 500 error middleware.
- **CORS & Security**:
  - Configure CORS with allowed origins, headers, and methods.
  - Parse request bodies safely using `express.json()`.
- **Unit Testing & Coverage**:
  - Unit tests must be written for every endpoint using Jest + Supertest.
  - **Code Coverage Threshold**: Minimum **80% statement, branch, and function coverage**.

---

## 3. Frontend Coding Standards (Angular / TypeScript)
- **Component Design**:
  - Keep components modular and presentational where appropriate.
  - Use reactive forms or clean data-binding patterns.
  - Handle loading, empty, and error states gracefully in templates.
- **State & Service Management**:
  - Encapsulate HTTP requests inside Angular Injectable Services.
  - Type all HTTP response payloads with TypeScript interfaces.
- **Styling**:
  - Use scoped component CSS / SCSS.
  - Avoid inline styles.
- **Unit Testing**:
  - Provide spec files (`.spec.ts` / `.spec.js`) for components and services.
  - Maintain >80% code coverage.

---

## 4. Git & Pull Request (PR) Standards
- **Branch Naming**: `<ticketId>-<featureName>` (e.g., `SHOP-101-user-login-page`).
- **Commit Messages**: Conventional commits format (`feat: <description>`, `fix: <description>`, `test: <description>`).
- **PR Description**:
  - Link to the corresponding Jira ticket.
  - Provide summary of changes.
  - Include unit test coverage summary (must verify >80% coverage).
  - List verification steps.

---

## 5. Review Agent Automated Verification Checklist
The Review Agent will verify the following items on every pull request:
- [x] Branch name matches `<ticketId>-<featureName>`.
- [x] Code passes linting with no syntax or runtime errors.
- [x] Unit test suite runs successfully with zero failures.
- [x] Code coverage exceeds the **80% minimum threshold**.
- [x] No hardcoded credentials, tokens, or API keys.
- [x] Node API endpoints conform to REST standards.
- [x] Angular components handle error states and loading feedback.
