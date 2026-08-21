const fs = require('fs');
const path = require('path');

function getWorkspaceRoot() {
  const possibleRoots = [
    path.join(__dirname, '..'),
    process.cwd(),
    'c:\\test\\Agents',
    'C:\\test\\Agents'
  ];
  for (const root of possibleRoots) {
    if (fs.existsSync(path.join(root, '.env'))) {
      return root;
    }
  }
  return path.join(__dirname, '..');
}

const WORKSPACE_ROOT = getWorkspaceRoot();

function loadEnv() {
  const envPath = path.join(WORKSPACE_ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('Could not find .env file at ' + envPath);
  }
  const envText = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  }
  return env;
}

async function jiraRequest(endpoint, options = {}) {
  const env = loadEnv();
  const auth = Buffer.from(env.JIRA_EMAIL + ':' + env.JIRA_API_TOKEN).toString('base64');
  const baseUrl = env.JIRA_BASE_URL.replace(/\/+$/, '');
  const opts = options || {};
  const headers = Object.assign({
    'Authorization': 'Basic ' + auth,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }, opts.headers || {});

  const res = await fetch(baseUrl + endpoint, Object.assign({}, opts, { headers }));
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error('Jira API error ' + res.status + ': ' + text);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function getBoardTickets() {
  const env = loadEnv();
  try {
    const data = await jiraRequest('/rest/api/3/search/jql?jql=' + encodeURIComponent('project = ' + env.JIRA_PROJECT_KEY + ' ORDER BY created DESC') + '&fields=summary,status,description,labels,comment');
    if (data && data.issues && data.issues.length > 0) {
      return data.issues;
    }
  } catch (e) {}

  if (env.JIRA_BOARD_ID) {
    try {
      const boardData = await jiraRequest('/rest/agile/1.0/board/' + env.JIRA_BOARD_ID + '/issue');
      if (boardData && boardData.issues) {
        return boardData.issues;
      }
    } catch (e) {}
  }
  return [];
}

async function getTicketComments(ticketKey) {
  const data = await jiraRequest('/rest/api/3/issue/' + ticketKey + '/comment');
  return data.comments || [];
}

async function createStoryFromRequirement() {
  const env = loadEnv();
  const reqPath = path.join(WORKSPACE_ROOT, 'requirement.md');
  const reqText = fs.readFileSync(reqPath, 'utf8');
  const titleMatch = reqText.match(/Feature Title:\s*(.*)/i) || reqText.match(/#\s*(.*)/);
  const title = titleMatch ? titleMatch[1].trim() : 'Application Feature';

  const payload = {
    fields: {
      project: { key: env.JIRA_PROJECT_KEY },
      summary: '[Feature] ' + title,
      issuetype: { name: 'Story' },
      description: {
        type: 'doc',
        version: 1,
        content: [{ type: 'paragraph', content: [{ type: 'text', text: reqText }] }]
      },
      labels: ['sdlc-automated', 'business-agent', 'auth', 'catalog']
    }
  };

  return jiraRequest('/rest/api/3/issue', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function addComment(ticketKey, commentText) {
  const payload = {
    body: {
      type: 'doc',
      version: 1,
      content: [{ type: 'paragraph', content: [{ type: 'text', text: commentText }] }]
    }
  };
  return jiraRequest('/rest/api/3/issue/' + ticketKey + '/comment', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

async function getAvailableTransitions(ticketKey) {
  const transData = await jiraRequest('/rest/api/3/issue/' + ticketKey + '/transitions');
  return transData.transitions || [];
}

async function transitionTicket(ticketKey, targetStatusName) {
  const transData = await jiraRequest('/rest/api/3/issue/' + ticketKey + '/transitions');
  const target = transData.transitions.find(t => t.to.name.toLowerCase() === targetStatusName.toLowerCase());
  if (!target) {
    throw new Error('Transition to "' + targetStatusName + '" not available for ' + ticketKey + '. Available: ' + transData.transitions.map(t => t.to.name).join(', '));
  }
  await jiraRequest('/rest/api/3/issue/' + ticketKey + '/transitions', {
    method: 'POST',
    body: JSON.stringify({ transition: { id: target.id } })
  });
  return target.to.name;
}

module.exports = {
  WORKSPACE_ROOT,
  loadEnv,
  jiraRequest,
  getBoardTickets,
  getTicketComments,
  createStoryFromRequirement,
  addComment,
  getAvailableTransitions,
  transitionTicket
};
