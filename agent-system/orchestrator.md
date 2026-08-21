# SDLC Multi-Agent Orchestrator

## 1. Overview & Purpose
This Orchestrator is the master coordinator for the automated Software Development Life Cycle (SDLC). It manages three autonomous sub-agents:
1. **Business Agent** (usiness.md)
2. **Development Agent** (development.md)
3. **QA Agent** (qa.md)

The system requires **minimal human intervention**: the user only updates equirement.md and provides approval at strict **Human Authorization Gates** before transitions occur.

---

## 2. Command Trigger
Whenever the user enters:
> **run SDLC flow** (or *run SDLC workflow*)

Antigravity IDE must immediately initiate this orchestration process from Step 1.

---

## 3. End-to-End Execution Sequence & Human Gates

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

## 4. Operational Rules for Antigravity IDE

1. **Step-by-Step Execution**: Execute one agent at a time according to its respective markdown file in gent-system/.
2. **Strict Gate Halts**:
   - **NEVER** proceed to the next agent automatically after completing a phase.
   - You **MUST** output the phase summary and ask the user for confirmation.
   - Wait for user response before loading and executing the subsequent agent.
3. **Standards Enforcement**:
   - Verify that all code follows gent-system/coding_standards.md with mandatory file header docblocks.
   - Ensure backend unit test coverage is strictly **> 80%**.
   - Ensure Playwright tests achieve **100% pass rate** before requesting Gate 3 approval.
4. **Git Finalization**:
   - Once Gate 3 is approved, merge the feature branch to main and push to remote.
