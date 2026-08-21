# Universal Coding Standards & Guidelines

All agents (especially Development Agent) must strictly adhere to these standards during code generation and modification.

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

1. **Framework & Runtime**: Node.js with Express.
2. **Architecture**: Clean layered architecture:
   - src/controllers/: Route handlers and HTTP request/response handling.
   - src/services/: Business logic, domain rules, and external data calls.
   - src/models/: Data structures, mock databases, and schemas.
   - src/routes/: Express router endpoint declarations.
3. **Error Handling**:
   - Centralized error-handling middleware.
   - Return standard JSON error responses: { success: false, error: <Error message>, code: <CODE> }.
   - Never leak stack traces in production responses.
4. **Unit Testing & Coverage**:
   - Framework: Jest / Supertest.
   - **Mandatory Threshold**: Line and branch code coverage must be **>= 80%**.
   - Must cover positive, negative (e.g. invalid input, 401, 400), and edge cases.

---

## 3. Frontend Coding Standards (Angular)

1. **Architecture**: Component-driven architecture using Angular best practices.
   - Components must remain thin, delegating state and API communication to Angular Services (@Injectable).
   - Use Reactive Forms (FormBuilder, FormGroup, Validators) for forms and user inputs.
   - Use TypeScript interfaces / models for strict typing.
2. **UI & Styling**:
   - Semantic HTML5 tags (<header>, <nav>, <main>, <section>, <article>).
   - Responsive layouts with modern CSS (Flexbox/Grid).
   - Accessibility (WCAG 2.1 AA): appropriate ARIA attributes, color contrast, and keyboard navigation.
3. **Clean Code**:
   - Format with Prettier / standard indentation (2 spaces).
   - Avoid ny type in TypeScript wherever possible.

---

## 4. E2E Automation Standards (Playwright)

1. **Framework**: Playwright (@playwright/test).
2. **Structure**: Feature-based test specs in e2e-tests/tests/<feature-name>.spec.js.
3. **Assertions & Resilience**:
   - Use web-first assertions (wait expect(locator).toBeVisible(), wait expect(locator).toHaveText()).
   - Avoid hardcoded sleep timeouts; use automatic waiting and locators with user-facing attributes (getByRole, getByText, getByLabel).
   - Cover all Acceptance Criteria scenarios from equirement.md / Jira.

---

## 5. Git & Branching Standards

- **Branch Naming**: <ticket_id>-<name_of_feature> (e.g. SHOP-101-user-auth-product-catalog).
- **Commit Messages**: Conventional commits format: eat(scope): message [TICKET-ID].
- **Merge Target**: Pull requests merge into main after human gate approval.
