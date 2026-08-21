# SDLC Multi-Agent Orchestrator (Antigravity IDE Edition)

An automated Software Development Life Cycle (SDLC) multi-agent workflow executed natively within the **Antigravity IDE**. 

Specialized Markdown-defined agents coordinate across product management, full-stack engineering, and QA automation with strict **Human Authorization Gates** between phases.

---

## 📁 Project Structure

`	ext
.
├── agent-system/                   # Centralized Agent Instructions & Tooling Configs
│   ├── orchestrator.md             # Master SDLC workflow manager & Human Gate coordinator
│   ├── business.md                 # Product Analyst (Jira stories, story points, linking, 'Dev Ready')
│   ├── development.md              # Full-Stack Dev (Angular + Node, coding standards, >80% tests, 'QA Ready')
│   ├── qa.md                       # QA Automation (Playwright E2E tests, 'Deployment Ready', merge to main)
│   ├── coding_standards.md         # Universal coding rules & mandatory file header docblocks
│   └── mcp_config.json             # MCP server definitions (Jira, GitHub)
│
├── requirement.md                  # The single manual intervention file (Feature requirements)
│
├── frontend/                       # Angular UI Application
├── backend/                        # Node.js REST API Backend (Jest unit tests)
├── e2e-tests/                      # Playwright Automated E2E Test Suite
├── .env.example                    # Template for Jira & GitHub credentials
└── package.json                    # Workspace scripts
`

---

## 🔄 SDLC Multi-Agent Workflow

`mermaid
sequenceDiagram
    autonumber
    actor User as Human Operator
    participant Orch as Orchestrator
    participant Biz as Business Agent
    participant Dev as Dev Agent
    participant QA as QA Agent
    participant Jira as Jira Board
    participant Git as GitHub Remote

    User->>Orch: run SDLC flow
    Orch->>Biz: Read requirement.md & parse
    Biz->>Jira: Create Story, calculate Story Points, add Labels & Links
    Biz->>Jira: Transition ticket to Dev Ready
    Biz->>User: 🛑 [HUMAN GATE 1] Story & Points summary -> Request approval
    Note over User,Biz: Human reviews and types proceed

    User->>Orch: proceed
    Orch->>Dev: Start Development
    Dev->>Git: Create branch: <ticket_id>-<name_of_feature>
    Dev->>Jira: Transition ticket to In Dev
    Dev->>Dev: Code frontend (Angular) & backend (Node) with header docblocks
    Dev->>Dev: Write Jest unit tests (Enforce > 80% coverage)
    Dev->>Git: Commit & push feature branch
    Dev->>Jira: Transition ticket to In Code Review -> QA Ready
    Dev->>User: 🛑 [HUMAN GATE 2] Code changes & coverage (>80%) -> Request approval
    Note over User,Dev: Human reviews and types proceed

    User->>Orch: proceed
    Orch->>QA: Start QA Automation
    QA->>QA: Write Playwright E2E tests in e2e-tests/
    QA->>QA: Execute Playwright test suite against services
    alt All E2E Tests Pass (100%)
        QA->>Jira: Transition ticket to Deployment Ready
        QA->>User: 🛑 [HUMAN GATE 3] Test results (100% pass) -> Request approval to merge
        Note over User,QA: Human reviews and types approve
        User->>Orch: approve
        Orch->>Git: Merge feature branch into main & push to main
    else Any Test Fails
        QA->>Jira: Transition ticket back to In Dev
        QA->>Dev: Alert failures to Dev Agent for bug fix
    end
`

---

## 🚀 How to Run

1. Update equirement.md with your feature user stories and acceptance criteria.
2. In **Antigravity IDE**, type:
   `	ext
   run SDLC flow
   `
3. Review and provide approval at each human gate (proceed / pprove).
