# SDLC Multi-Agent Orchestrator (Antigravity IDE Edition)

An automated Software Development Life Cycle (SDLC) multi-agent workflow executed natively within the **Antigravity IDE**. 

Specialized Markdown-defined agents coordinate across Product Management, Architecture, Full-Stack Development, Code Review, and QA Automation with strict **Human Authorization Gates** between phases.

---

## 📁 Systematic Project Structure

`	ext
.
├── agents/                         # 🧠 All SDLC Agent Definitions & MCP Configs
│   ├── OrchestratorAgent.md        # Central SDLC workflow coordinator & dispatcher
│   ├── BusinessAgent.md            # Product Analyst (Jira stories with AC in 'To Do')
│   ├── ArchitectureAgent.md        # Technical Architect (Dev plan comments in 'Dev Ready' + Alt plans)
│   ├── DevelopmentAgent.md         # Full-Stack Dev (Angular + Node API, headers, >80% tests)
│   ├── ReviewAgent.md              # Quality Auditor (Code standards check, PR approval in 'In Review')
│   ├── QAAgent.md                  # QA Automation (Playwright E2E tests, moves to 'QA Pass')
│   └── mcp_config.json             # MCP server connections (Jira & GitHub)
│
├── app/                            # 💻 Application Development Setup
│   ├── frontend/                   # Angular UI Application
│   └── backend/                    # Node.js Express API Backend (mock responses in server.js)
│
├── tests/                          # 🎭 Playwright Automated E2E Test Suite
│   ├── e2e/                        # Feature-based Playwright spec files
│   └── playwright.config.js        # Playwright test runner configuration
│
├── requirement.md                  # 📄 Single Manual Intervention File (Feature requirements)
├── coding_standards.md             # 📏 Universal Coding Standards & DocBlock Header Rules
├── .env                            # 🔑 Jira & GitHub environment credentials
└── package.json                    # 📦 Workspace scripts
`

---

## 📊 Jira Status Transitions

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

## 🚀 How to Run

1. Add your feature requirements to [equirement.md](file:///c:/test/Agents/requirement.md).
2. Add any specific coding standards in [coding_standards.md](file:///c:/test/Agents/coding_standards.md).
3. In **Antigravity IDE**, run the single command:
   `	ext
   run SDLC flow
   `
4. Each agent will run its assigned tasks for active tickets and pause at its designated **Human Gate**:
   - **Gate 1**: Review Jira story acceptance criteria and transition to Dev Ready.
   - **Gate 2**: Review architecture plan comment (or comment requesting an alternative plan) and transition to In Dev.
   - **Gate 3**: Review PR & unit test coverage (>80%) and transition to QA Ready.
   - **QA Pass**: All Playwright tests pass and ticket moves to QA Pass / Deployment Ready.
