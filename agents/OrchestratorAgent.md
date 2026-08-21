# SDLC Multi-Agent Orchestrator

## 1. Core Operating Principle: Dynamic Role Execution & Human Authorization Gates
When triggered by the terminal command (`npm run orchestrator` or `node orchestrator.js`), the Orchestrator inspects the live Jira board and dynamically dispatches tickets to their respective specialized agents. Execution runs autonomously for each phase until reaching the next **Human Authorization Gate**.

---

## 2. Standard Jira Board Statuses

```yaml
statuses:
  toDo: "To Do"
  devReady: "Dev Ready"
  inDev: "In Dev"
  codeReview: "In Review"
  qaReady: "QA Ready"
  qaPass: "QA Pass"
  deploymentReady: "Deployment Ready"
  done: "Done"
```

---

## 3. End-to-End SDLC Flow with Human Gates

1. **Business Agent (`BusinessAgent.md`)**:
   - Ingests requirements from `requirement.md`.
   - Creates Jira Story in **To Do** (`toDo`) with full Acceptance Criteria (Gherkin format).
   - **Human Gate 1**: Waits for human to review ticket and transition it to **Dev Ready** (`devReady`).

2. **Architecture Agent (`ArchitectureAgent.md`)**:
   - Dispatches for tickets in **Dev Ready** (`devReady`).
   - Checks comments for feedback (if human commented *"need other plan"*, generates alternative plan; otherwise creates initial development plan).
   - Posts technical architecture & plan comment to the Jira ticket.
   - **Human Gate 2**: Waits for human to review plan in comments and transition ticket to **In Dev** (`inDev`) (or comment requesting another plan).

3. **Development Agent (`DevelopmentAgent.md`)**:
   - Dispatches for tickets in **In Dev** (`inDev`).
   - Creates feature branch: `<ticketId>-<featureName>`.
   - Adheres to `coding_standards.md` with mandatory file header docblocks.
   - Implements Angular UI in `app/frontend/` and Node.js REST API mock in `app/backend/server.js`.
   - Runs Jest unit tests and self-heals until code coverage is **strictly > 80%**.
   - Pushes branch to GitHub remote, creates Pull Request targeting `main`, and transitions ticket to **In Review** (`codeReview`).

4. **Review Agent (`ReviewAgent.md`)**:
   - Dispatches for tickets in **In Review** (`codeReview`).
   - Audits code against `coding_standards.md`, checks docblocks, >80% coverage, and acceptance criteria.
   - Posts review approval comment on the Jira ticket / PR.
   - **Human Gate 3**: Waits for second-round human review on the PR and transition of ticket to **QA Ready** (`qaReady`).

5. **QA Automation Agent (`QAAgent.md`)**:
   - Dispatches for tickets in **QA Ready** (`qaReady`).
   - Executes Playwright automated test suite in `tests/`.
   - When 100% of test cases pass, transitions ticket to **QA Pass** (`qaPass`).
   - Merges feature branch into `main` and transitions ticket to **Deployment Ready** / **Done**.

---

## 4. Single Terminal Trigger Command
```bash
npm run orchestrator
# or
node orchestrator.js
```
