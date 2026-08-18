# SDLC Multi-Agent Orchestrator with Human Gates

An enterprise-grade, automated Software Development Life Cycle (SDLC) multi-agent system coordinating Jira, GitHub, Angular, Node.js, and Playwright automation with strictly enforced **Human Authorization Gates**.

---

## 🏗️ Architecture & SDLC Workflow

```
                   ┌──────────────────────────────────────┐
                   │            requirement.md            │
                   └──────────────────┬───────────────────┘
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │            Business Agent            │
                   │ (Creates User Story + AC in "To Do") │
                   └──────────────────┬───────────────────┘
                                      │
             [ ⏸️ HUMAN GATE 1: Review AC & Move to "Dev Ready" ]
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │          Architecture Agent          │
                   │ (Posts Technical Plan as Jira Comment)
                   └──────────────────┬───────────────────┘
                                      │
             [ ⏸️ HUMAN GATE 2: Review Plan & Move to "In Dev" ]
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │          Development Agent           │
                   │ - Creates branch <ticketId>-<feature>│
                   │ - Implements Angular UI & Node API   │
                   │ - Executes Unit Tests (>80% coverage)│
                   │ - Raises PR to main                  │
                   │ - Transitions Jira to "In Review"    │
                   └──────────────────┬───────────────────┘
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │             Review Agent             │
                   │ (Audits PR against coding_standards) │
                   └──────────────────┬───────────────────┘
                                      │
             [ ⏸️ HUMAN GATE 3: 2nd Review & Move to "QA Ready" ]
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │               QA Agent               │
                   │ - Generates & runs Playwright tests  │
                   │ - Verifies 100% test pass rate       │
                   │ - Transitions Jira to "QA Pass"      │
                   └──────────────────────────────────────┘
```

---

## ⚡ Single Terminal Command to Run

To run the complete multi-agent workflow:

```bash
npm start
```
*(or `node orchestrator.js`)*

When the orchestrator runs:
1. It connects to Jira and GitHub using `.env`.
2. Inspects all open tickets for project `SHOP`.
3. Dispatches the specialized agent corresponding to each ticket's state.
4. Executes the agent task and halts safely at the corresponding **Human Gate**.
5. Renders a real-time status summary table in the terminal.

---

## 🚦 Human Authorization Gates

| Stage | From Status | To Status | Human Gate Responsibility |
|---|---|---|---|
| **Gate 1** | `To Do` | `Dev Ready` | Human reviews business requirements and acceptance criteria in Jira. |
| **Gate 2** | `Dev Ready` | `In Dev` | Human reviews the technical architecture plan posted in the ticket comments. |
| **Gate 3** | `In Review` | `QA Ready` | Human performs final code & PR review sign-off before QA automation begins. |

---

## 📁 Repository Structure

```
Agents/
├── agents/                       # Specialized Agent Prompt & Instruction Definitions
│   ├── OrchestratorAgent.md      # Master coordinator & state machine controller
│   ├── BusinessAgent.md          # Requirements parser & Jira story creator
│   ├── ArchitectureAgent.md      # Technical architecture & API contract planner
│   ├── DevelopmentAgent.md       # Angular/Node implementation, branch/PR & unit testing
│   ├── ReviewAgent.md            # Code review auditor against coding_standards.md
│   └── QAAgent.md                # Playwright E2E automation generator & test runner
│
├── services/                     # MCP and REST API Services
│   ├── jiraService.js            # Jira Cloud REST Client (Stories, Transitions, Comments)
│   ├── githubService.js          # GitHub REST Client (Branches, PRs, Comments, Diffs)
│   ├── agentRunner.js            # Multi-agent task execution and human gate handling
│   ├── jiraMcpServer.js          # Jira Model Context Protocol stdio server
│   └── githubMcpServer.js        # GitHub Model Context Protocol stdio server
│
├── app/                          # Application Codebase
│   ├── backend/                  # Node.js Express API
│   │   ├── server.js             # Mock API endpoints (/health, /login, /user, /products)
│   │   ├── server.test.js        # Jest unit tests with >80% code coverage threshold
│   │   └── package.json          # Backend dependencies and test scripts
│   └── frontend/                 # Angular Frontend
│       └── shop/                 # Components, services, and unit tests
│
├── tests/                        # QA E2E Automation Suite
│   ├── e2e/                      # Playwright test specs
│   │   ├── health.spec.js        # API health check tests
│   │   └── user-flow.spec.js     # User login & catalog acceptance criteria verification
│   ├── playwright.config.js      # Playwright runner configuration with auto webServer
│   └── package.json              # Playwright dependencies
│
├── requirement.md                # Input requirements specification for Business Agent
├── coding_standards.md           # Engineering guidelines enforced by Review Agent
├── mcp_config.json               # Model Context Protocol server configuration
├── orchestrator.js               # Main CLI single-command orchestrator entrypoint
├── .env                          # Jira and GitHub connection credentials
└── package.json                  # Root runner configuration
```

---

## 🧪 Testing & Code Coverage Commands

- **Run Orchestrator**: `npm start`
- **Run Backend Unit Tests & Coverage (>80%)**:
  ```bash
  npm run test:coverage
  ```
- **Run Playwright E2E QA Automation**:
  ```bash
  npm run test:qa
  ```