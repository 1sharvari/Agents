# SDLC Multi-Agent Orchestrator

## 1. Overview & Purpose
The **Orchestrator Agent** is the central controller coordinating all specialized SDLC agents. When triggered, the Orchestrator inspects the current Jira board state and invokes the appropriate sub-agent based on each ticket's status.

Each agent executes autonomously **up to its designated Human Authorization Gate**, where execution halts for human approval before moving forward.

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

## 3. Single Terminal / Chat Run Command

Execute the multi-agent workflow anytime by typing in Antigravity:
> **un SDLC flow**

Or running in terminal:
`ash
npm run orchestrator
`

---

## 4. End-to-End Execution Sequence & Human Gates

`mermaid
sequenceDiagram
    autonumber
    actor User as Human Operator
    participant Orch as OrchestratorAgent
    participant Biz as BusinessAgent
    participant Arch as ArchitectureAgent
    participant Dev as DevelopmentAgent
    participant Rev as ReviewAgent
    participant QA as QAAgent
    participant Jira as Jira Board
    participant Git as GitHub Remote

    User->>Orch: run SDLC flow
    
    rect rgb(240, 248, 255)
    Note over Orch,Biz: 1. Business Specification
    Orch->>Biz: Read requirement.md & extract specs
    Biz->>Jira: Create Story in To Do with Acceptance Criteria
    Biz->>User: 🛑 [HUMAN GATE 1] Story created in To Do -> Please review and move to Dev Ready
    end

    Note over User,Jira: Human reviews acceptance criteria and moves ticket to Dev Ready

    rect rgb(255, 250, 240)
    Note over Orch,Arch: 2. Architecture & Planning
    Orch->>Arch: Scan tickets in Dev Ready
    Arch->>Arch: Design technical plan (or alternative plan if user commented)
    Arch->>Jira: Add Development Plan as Ticket Comment
    Arch->>User: 🛑 [HUMAN GATE 2] Plan posted -> If approved, move to In Dev (or comment for alt plan)
    end

    Note over User,Jira: Human approves plan and moves ticket to In Dev

    rect rgb(245, 255, 245)
    Note over Orch,Dev: 3. Full-Stack Development & Unit Testing
    Orch->>Dev: Scan tickets in In Dev
    Dev->>Git: Create branch <ticketId>-<featureName>
    Dev->>Dev: Implement Angular UI (app/frontend/) & Node API (app/backend/server.js)
    Dev->>Dev: Apply coding standards & mandatory file headers
    Dev->>Dev: Run Jest tests with coverage (Self-heal until coverage > 80%)
    Dev->>Git: Commit, push branch & raise PR to main
    Dev->>Jira: Move ticket to In Review
    end

    rect rgb(255, 245, 255)
    Note over Orch,Rev: 4. Automated Code Review
    Orch->>Rev: Scan tickets in In Review
    Rev->>Rev: Audit coding_standards.md compliance & acceptance criteria
    Rev->>Git: Approve PR on GitHub & post review comment
    Rev->>User: 🛑 [HUMAN GATE 3] Automated review passed -> Please review PR & move ticket to QA Ready
    end

    Note over User,Jira: Human completes 2nd round approval and moves ticket to QA Ready

    rect rgb(240, 255, 255)
    Note over Orch,QA: 5. QA Automation & Verification
    Orch->>QA: Scan tickets in QA Ready
    QA->>QA: Author Playwright tests in tests/e2e/
    QA->>QA: Execute Playwright test suite against services
    alt 100% Tests Pass
        QA->>Jira: Move ticket to QA Pass -> Deployment Ready -> Done
        QA->>Git: Merge PR to main branch
    else Tests Fail
        QA->>Jira: Reopen ticket to In Dev with failure logs
    end
    end
`

---

## 5. Orchestration State Machine Dispatcher

When OrchestratorAgent executes:

| Current Ticket Status | Assigned Sub-Agent | Action Performed | Next State / Gate |
| :--- | :--- | :--- | :--- |
| **No Ticket / equirement.md updated** | BusinessAgent.md | Ingests equirement.md, creates Story in Jira. | To Do $\rightarrow$ **🛑 Human Gate 1** |
| **To Do** | **Human Gate 1** | Waiting for human review of Acceptance Criteria. | Human moves to Dev Ready |
| **Dev Ready** | ArchitectureAgent.md | Prepares architecture plan (or alternative plan). Posts comment. | Dev Ready $\rightarrow$ **🛑 Human Gate 2** |
| **In Dev** | DevelopmentAgent.md | Creates branch, writes Angular + Node code, Jest tests >80%, raises PR. | In Review |
| **In Review** | ReviewAgent.md | Audits coding standards & approves PR. | In Review $\rightarrow$ **🛑 Human Gate 3** |
| **QA Ready** | QAAgent.md | Authors & executes Playwright tests. | QA Pass $\rightarrow$ Deployment Ready $\rightarrow$ Done |

---

## 6. Operational Rules for Antigravity IDE
1. **Always halt at Human Gates**: Do not bypass human authorization steps.
2. **Deterministic execution**: When an agent completes its phase, log structured output and wait for the human gate transition.
3. **Coding Standards**: Ensure all generated files strictly comply with [coding_standards.md](file:///c:/test/Agents/coding_standards.md).
