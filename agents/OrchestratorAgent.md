# SDLC Multi-Agent Orchestrator

## 1. Core Operating Principle: Autonomous Execution (Zero Chat Prompts)
When triggered by the command **un SDLC flow** (or **un orchestrator**), the Orchestrator executes all phases **completely autonomously** without interrupting the user with confirmation questions or prompts in the context window.

---

## 2. Standard Jira Board Statuses

`yaml
statuses:
  toDo: To Do
  devReady: Dev Ready
  inDev: In Dev
  codeReview: In Review
  qaReady: QA Ready
  qaPass: QA Pass
  deploymentReady: Deployment Ready
  done: Done
`

---

## 3. End-to-End Autonomous Workflow

1. **Board Sync & Business Agent (BusinessAgent.md)**:
   - Inspects live Jira board and equirement.md.
   - Creates Jira story in To Do with full Gherkin acceptance criteria if not already created, then transitions to Dev Ready.

2. **Architecture Agent (ArchitectureAgent.md)**:
   - Formulates technical architecture (Angular UI in pp/frontend/, Node.js REST API in pp/backend/server.js, Jest unit tests, Playwright E2E tests).
   - Posts the development plan as a comment on the Jira ticket and transitions to In Dev.

3. **Development Agent (DevelopmentAgent.md)**:
   - Creates feature branch: <ticketId>-<featureName>.
   - Prepend mandatory docblock headers on every file per coding_standards.md.
   - Implements Angular components & Node.js backend.
   - Runs Jest unit tests and self-heals until code coverage is **strictly > 80%**.
   - Pushes branch to GitHub remote and transitions to In Review.

4. **Review Agent (ReviewAgent.md)**:
   - Audits code against coding_standards.md and verifies acceptance criteria.
   - Approves PR on GitHub, posts review comment on Jira, and transitions to QA Ready.

5. **QA Automation Agent (QAAgent.md)**:
   - Runs Playwright E2E test suite in 	ests/.
   - Verifies 100% test pass rate.
   - Transitions Jira ticket to QA Pass -> Deployment Ready -> Done.
   - Merges feature branch into main and pushes to GitHub remote.

---

## 4. Single Trigger Command
> **un SDLC flow**
