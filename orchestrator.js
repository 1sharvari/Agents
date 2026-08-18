#!/usr/bin/env node

/**
 * SDLC Multi-Agent Orchestrator
 * Single command entrypoint to coordinate autonomous SDLC sub-agents with human authorization gates.
 */

const { JiraService, JIRA_STATUSES } = require('./services/jiraService');
const { AgentRunner } = require('./services/agentRunner');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function printBanner() {
  console.log('\n' + '='.repeat(70));
  console.log('       🚀  SDLC AUTOMATED AGENT ORCHESTRATOR  🚀');
  console.log('    Multi-Agent Workflow with Human Authorization Gates');
  console.log('='.repeat(70) + '\n');
}

function normalizeStatus(statusName) {
  if (!statusName) return '';
  const s = statusName.trim().toLowerCase();
  if (s === 'to do' || s === 'todo') return 'To Do';
  if (s === 'dev ready' || s === 'devready') return 'Dev Ready';
  if (s === 'in dev' || s === 'in development' || s === 'indev') return 'In Dev';
  if (s === 'in review' || s === 'code review' || s === 'inreview') return 'In Review';
  if (s === 'qa ready' || s === 'qaready') return 'QA Ready';
  if (s === 'qa pass' || s === 'qapass') return 'QA Pass';
  if (s === 'deployment ready' || s === 'deploymentready') return 'Deployment Ready';
  if (s === 'done' || s === 'closed') return 'Done';
  return statusName;
}

async function orchestrate() {
  printBanner();

  const jira = new JiraService();
  const runner = new AgentRunner();

  console.log(`📡 Connecting to Jira (${jira.baseUrl || 'Configured via .env'}) for Project: ${jira.projectKey}...`);

  let issues = [];
  try {
    issues = await jira.searchIssues(`project = "${jira.projectKey}" ORDER BY updated DESC`);
  } catch (err) {
    console.warn(`⚠️ Jira connection warning: ${err.message}`);
    console.log('Checking local requirement.md to initialize workflow...\n');
  }

  // If no tickets exist, trigger Business Agent to create one from requirement.md
  if (issues.length === 0) {
    console.log('ℹ️ No active Jira tickets found in project.');
    const businessResult = await runner.runBusinessAgent();
    if (businessResult.ticketKey) {
      try {
        const createdIssue = await jira.getIssue(businessResult.ticketKey);
        issues = [createdIssue];
      } catch (e) {
        issues = [{ key: businessResult.ticketKey, fields: { summary: 'Application Feature', status: { name: 'To Do' } } }];
      }
    }
  }

  const results = [];

  for (const issue of issues) {
    const key = issue.key;
    const summary = issue.fields?.summary || 'Untitled';
    const rawStatus = issue.fields?.status?.name || 'To Do';
    const status = normalizeStatus(rawStatus);

    console.log('\n' + '-'.repeat(70));
    console.log(`📌 Processing Ticket: [${key}] "${summary}" | Current Status: [${status}]`);
    console.log('-'.repeat(70));

    switch (status) {
      case 'To Do':
        console.log(`⏸️ [HUMAN GATE 1] Ticket ${key} is in "To Do".`);
        console.log(`👉 Action Required: Human must review acceptance criteria in Jira and transition ticket to "Dev Ready".`);
        results.push({ key, status, agent: 'BusinessAgent', nextAction: 'Human Approval -> Dev Ready' });
        break;

      case 'Dev Ready':
        console.log(`🎯 Dispatching ArchitectureAgent for ${key}...`);
        const archResult = await runner.runArchitectureAgent(issue);
        results.push({ key, status: 'Dev Ready', agent: 'ArchitectureAgent', nextAction: 'Human Approval -> In Dev' });
        break;

      case 'In Dev':
        console.log(`🎯 Dispatching DevelopmentAgent for ${key}...`);
        const devResult = await runner.runDevelopmentAgent(issue);
        results.push({ key, status: 'In Review', agent: 'DevelopmentAgent', nextAction: 'ReviewAgent PR Audit' });
        break;

      case 'In Review':
        console.log(`🎯 Dispatching ReviewAgent for ${key}...`);
        const revResult = await runner.runReviewAgent(issue);
        results.push({ key, status: 'In Review', agent: 'ReviewAgent', nextAction: 'Human Approval -> QA Ready' });
        break;

      case 'QA Ready':
        console.log(`🎯 Dispatching QAAgent for ${key}...`);
        const qaResult = await runner.runQAAgent(issue);
        results.push({ key, status: 'QA Pass', agent: 'QAAgent', nextAction: 'Deployment Ready' });
        break;

      case 'QA Pass':
        console.log(`🎉 Ticket ${key} has PASSED all QA automation test suites!`);
        results.push({ key, status: 'QA Pass', agent: 'Completed', nextAction: 'Ready for Deployment' });
        break;

      case 'Deployment Ready':
      case 'Done':
        console.log(`✅ Ticket ${key} is ${status}.`);
        results.push({ key, status, agent: 'N/A', nextAction: 'None' });
        break;

      default:
        console.log(`ℹ️ Ticket ${key} is in custom status "${rawStatus}".`);
        results.push({ key, status: rawStatus, agent: 'Custom', nextAction: 'Check Jira workflow' });
    }
  }

  // Render Final Dashboard Summary
  console.log('\n' + '='.repeat(70));
  console.log('                  📊 ORCHESTRATOR PIPELINE SUMMARY');
  console.log('='.repeat(70));
  console.table(results);
  console.log('='.repeat(70) + '\n');
}

if (require.main === module) {
  orchestrate().catch((err) => {
    console.error('❌ Orchestrator execution error:', err);
    process.exit(1);
  });
}

module.exports = { orchestrate };
