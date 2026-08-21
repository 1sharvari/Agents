# Antigravity Autonomous SDLC Agent Rules

## 🚨 MANDATORY EXECUTION POLICY: ZERO CHAT PROMPTS

1. **Fully Autonomous Execution**:
   - When the user issues commands such as **un SDLC flow**, **un orchestrator**, or **un sdlc**, the AI agent **MUST NOT** ask interactive confirmation questions, solicit opinions, or pause asking for approval in the chat context window.
   - All tasks (reading requirements, creating Jira tickets, architecture planning, Angular/Node development, Jest unit tests with >80% coverage, PR creation, code reviews, Playwright E2E testing, and Git merges) **MUST be executed automatically end-to-end**.

2. **Jira Board & Git as the Source of Truth**:
   - Human gates exist strictly as ticket status movements on the Jira board if the user chooses to move them manually, NOT as interactive chatbot pauses.
   - The agent directly interacts with Atlassian Jira and GitHub APIs using credentials in .env.

3. **Status Transitions Order**:
   To Do -> Dev Ready -> In Dev -> In Review -> QA Ready -> QA Pass -> Deployment Ready -> Done

4. **Quality & Standards Enforcement**:
   - Mandatory docblock header on every source file as defined in coding_standards.md.
   - Backend unit tests in pp/backend/ must achieve strictly **> 80% coverage**.
   - Playwright automated E2E tests in 	ests/ must achieve **100% pass rate**.
