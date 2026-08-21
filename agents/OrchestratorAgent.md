# SDLC Multi-Agent Orchestrator

## 1. Core Operating Principle: Human Gate Authorization
When triggered by the terminal command (`npm run orchestrator` or `node orchestrator.js`), the Orchestrator inspects the live Jira board and executes only the specialized agent matching the active ticket's current status block up to the designated **Human Authorization Gate**.

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

## 3. End-to-End SDLC Flow & Human Gate Policies

1. **Business Agent (`BusinessAgent.md`)**:
   - Ingests user requirements from `requirement.md`.
   - Checks Jira for existing tickets (prevents duplicates).
   - Creates Jira Story in **To Do** (`toDo`) with full Acceptance Criteria (Gherkin format).
   - **🛑 Human Gate 1**: Human reviews the user story and Acceptance Criteria in Jira. If agreed, **human manually transitions ticket to 'Dev Ready'** (`devReady`). Agent does NOT move ticket to Dev Ready.

2. **Architecture Agent (`ArchitectureAgent.md`)**:
   - Triggers for tickets in **Dev Ready** (`devReady`).
   - Checks comment history.
   - Formulates the technical development plan and posts it as a Jira comment (or alternative plan if human commented asking for one).
   - **🛑 Human Gate 2**: Human reads the technical plan in Jira comments.
     - If human approves: **human manually transitions ticket to 'In Dev'** (`inDev`).
     - If human needs another plan: human adds a comment in Jira (e.g. *"need other plan with X"*) and reruns orchestrator to generate an alternative plan.
     - Agent does NOT move ticket to In Dev.

3. **Development Agent (`DevelopmentAgent.md`)**:
   - Triggers for tickets in **In Dev** (`inDev`).
   - Creates and checkouts feature branch: `<ticketId>-<featureName>`.
   - Adheres to `coding_standards.md` with mandatory file header docblocks.
   - Implements Angular UI in `app/frontend/` and Node.js REST API mock in `app/backend/server.js`.
   - Runs Jest unit tests and self-heals until code coverage is **strictly > 80%**.
   - Pushes feature branch to GitHub remote and creates a Pull Request targeting `main`.
   - **Agent Transition**: ONLY after development is completed, tests pass, and PR is raised, **Development Agent transitions ticket to 'In Review'** (`codeReview`).

4. **Review Agent (`ReviewAgent.md`)**:
   - Triggers for tickets in **In Review** (`codeReview`).
   - Audits code against `coding_standards.md`, checks docblocks, >80% coverage, and acceptance criteria.
   - Posts automated review approval comment on the Jira ticket / PR.
   - **🛑 Human Gate 3**: Human performs second-round review on the GitHub PR. If approved, **human manually transitions ticket to 'QA Ready'** (`qaReady`). Agent does NOT move ticket to QA Ready.

5. **QA Automation Agent (`QAAgent.md`)**:
   - Triggers for tickets in **QA Ready** (`qaReady`).
   - Executes Playwright automated test suite in `tests/`.
   - **Agent Transition**: When 100% of test cases pass, **QA Agent transitions ticket to 'QA Pass'** (`qaPass`) -> **'Deployment Ready'** -> **'Done'**, merges feature branch into `main`, and pushes to GitHub.

---

## 4. Single Terminal Trigger Command
```bash
npm run orchestrator
# or
node orchestrator.js
```
