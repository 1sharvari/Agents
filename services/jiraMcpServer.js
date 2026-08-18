/**
 * Model Context Protocol (MCP) Server for Atlassian Jira
 */

const { JiraService, JIRA_STATUSES } = require('./jiraService');
const readline = require('readline');

const jira = new JiraService();

const TOOLS = [
  {
    name: 'jira_search_issues',
    description: 'Search Jira issues using JQL query',
    parameters: {
      type: 'object',
      properties: {
        jql: { type: 'string', description: 'JQL query string' }
      }
    }
  },
  {
    name: 'jira_get_issue',
    description: 'Get details of a specific Jira issue by key',
    parameters: {
      type: 'object',
      properties: {
        issueKey: { type: 'string', description: 'Jira issue key (e.g. SHOP-101)' }
      },
      required: ['issueKey']
    }
  },
  {
    name: 'jira_create_issue',
    description: 'Create a new Jira issue (User Story / Task)',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Summary / Title' },
        description: { type: 'string', description: 'Description / Acceptance criteria' },
        issueType: { type: 'string', description: 'Issue type (Story, Task)', default: 'Story' }
      },
      required: ['summary', 'description']
    }
  },
  {
    name: 'jira_add_comment',
    description: 'Add comment to a Jira issue',
    parameters: {
      type: 'object',
      properties: {
        issueKey: { type: 'string', description: 'Jira issue key' },
        comment: { type: 'string', description: 'Comment text in markdown' }
      },
      required: ['issueKey', 'comment']
    }
  },
  {
    name: 'jira_transition_issue',
    description: 'Transition Jira issue to a new status (e.g. "Dev Ready", "In Dev", "In Review", "QA Ready", "QA Pass")',
    parameters: {
      type: 'object',
      properties: {
        issueKey: { type: 'string', description: 'Jira issue key' },
        status: { type: 'string', description: 'Target status name' }
      },
      required: ['issueKey', 'status']
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'jira_search_issues':
      return await jira.searchIssues(args.jql);
    case 'jira_get_issue':
      return await jira.getIssue(args.issueKey);
    case 'jira_create_issue':
      return await jira.createStory({
        summary: args.summary,
        description: args.description,
        issueType: args.issueType || 'Story'
      });
    case 'jira_add_comment':
      return await jira.addComment(args.issueKey, args.comment);
    case 'jira_transition_issue':
      return await jira.transitionIssue(args.issueKey, args.status);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Simple MCP stdio communication listener
if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    try {
      if (!line.trim()) return;
      const request = JSON.parse(line);
      if (request.method === 'tools/list') {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { tools: TOOLS } }) + '\n');
      } else if (request.method === 'tools/call') {
        const result = await handleToolCall(request.params.name, request.params.arguments || {});
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { content: [{ type: 'text', text: JSON.stringify(result) }] } }) + '\n');
      }
    } catch (err) {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { message: err.message } }) + '\n');
    }
  });
}

module.exports = { TOOLS, handleToolCall };
