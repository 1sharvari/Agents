# Coding Standards & Guidelines

All agents (especially Development Agent and Review Agent) must strictly adhere to these standards during code generation, modification, and code reviews.

---

## 1. Mandatory File Header DocBlock

Every source code file (.js, .ts, .html, .css, .scss) must start with a standardized header docblock in the following format:

`javascript
/**
 * @fileoverview <Brief description of the file and its responsibility>
 * @module <Module / Component Name>
 * @standards Clean Architecture, SOLID Principles, ESLint / Prettier
 * @feature <Feature Name / Jira Ticket ID>
 */
`

---

## 2. Backend Coding Standards (Node.js)

1. **Framework & Runtime**: Node.js with Express in pp/backend/.
2. **API Mock Responses**:
   - Node API responses must be clearly defined in pp/backend/server.js.
   - Realistic mock responses for authentication (/api/login), health checks (/api/health), user profiles (/api/user), and product catalog (/api/products).
3. **Error Handling**:
   - Return standard JSON error responses: { success: false, error: <Error message>, code: <CODE> }.
   - Appropriate HTTP Status Codes (200, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).
4. **Unit Testing & Coverage**:
   - Framework: Jest / Supertest (pp/backend/server.test.js).
   - **Mandatory Threshold**: Line, statement, and branch coverage must be strictly **> 80%**.
   - If any unit test fails, the Development Agent must inspect the code and fix the test.

---

## 3. Frontend Coding Standards (Angular)

1. **Architecture**: Clean Angular structure in pp/frontend/shop/ (or pp/frontend/).
   - Modular components and services with single responsibilities.
   - Use Reactive Forms (FormBuilder, FormGroup, Validators) for login and data inputs.
   - Strict TypeScript models and interfaces.
2. **UI & Styling**:
   - Semantic HTML5 tags and accessible components.
   - Clean CSS/SCSS with responsive layouts.
   - Display clear validation messages matching acceptance criteria.

---

## 4. E2E Automation Standards (Playwright)

1. **Framework**: Playwright in 	ests/.
2. **Spec Files**: Located in 	ests/e2e/.
3. **Execution**: Headless execution with web-first assertions testing all acceptance criteria scenarios.

---

## 5. Git & PR Standards

- **Branch Naming**: <ticketId>-<featureName> (e.g. SHOP-101-user-auth-product-catalog).
- **PR Target**: main branch.
- **Review**: Review Agent checks compliance with this file before moving to QA Ready.
