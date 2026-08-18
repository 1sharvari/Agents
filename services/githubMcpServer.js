/**
 * Model Context Protocol (MCP) Server for GitHub
 */

const { GitHubService } = require('./githubService');
const readline = require('readline');

const github = new GitHubService();

const TOOLS = [
  {
    name: 'github_create_branch',
    description: 'Create and checkout a new local git branch',
    parameters: {
      type: 'object',
      properties: {
        branchName: { type: 'string', description: 'Name of the branch' }
      },
      required: ['branchName']
    }
  },
  {
    name: 'github_create_pull_request',
    description: 'Create a Pull Request on GitHub',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'PR Title' },
        body: { type: 'string', description: 'PR Description and summary' },
        headBranch: { type: 'string', description: 'Head branch name' },
        baseBranch: { type: 'string', description: 'Base branch name (default: main)' }
      },
      required: ['title', 'body', 'headBranch']
    }
  },
  {
    name: 'github_add_pr_comment',
    description: 'Add comment or review summary to a Pull Request',
    parameters: {
      type: 'object',
      properties: {
        prNumber: { type: 'number', description: 'PR Number' },
        comment: { type: 'string', description: 'Review comment body' }
      },
      required: ['prNumber', 'comment']
    }
  },
  {
    name: 'github_get_pr_diff',
    description: 'Get git diff for a Pull Request',
    parameters: {
      type: 'object',
      properties: {
        prNumber: { type: 'number', description: 'PR Number' }
      },
      required: ['prNumber']
    }
  }
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'github_create_branch':
      return github.createLocalBranch(args.branchName);
    case 'github_create_pull_request':
      return await github.createPullRequest(args);
    case 'github_add_pr_comment':
      return await github.addPullRequestComment(args.prNumber, args.comment);
    case 'github_get_pr_diff':
      return await github.getPullRequestDiff(args.prNumber);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

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
