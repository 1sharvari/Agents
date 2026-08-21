const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
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


async function jiraRequest(endpoint, options)
{
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
  const data = await jiraRequest('/rest/api/3/search/jql', {
    method: 'POST',
    body: JSON.stringify({
      jql: 'project = ' + env.JIRA_PROJECT_KEY + ' ORDER BY created DESC',
      fields: ['summary', 'status', 'description', 'labels']
    })
  });
  return data.issues || [];
}

async function createStoryFromRequirement() {
  const env = loadEnv();
  const reqPath = path.join(__dirname, '..', 'requirement.md');
  const reqText = fs.readFileSync(reqPath, 'utf8');
  const titleMatch = reqText.match(/Feature Title:\s(.*)/i) || reqText.match(/#\s(.*)/);
  const title = titleMatch ? title[1].trim() : 'Application Feature';

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

async function transitionTicket(ticketKey, targetStatusName) {
  const transData = await jiraRequest('/rest/api/3/issue/' + ticketKey + '/transitions');
  const target = transData.transitions.find(t => t.to.name.toLowerCase() === targetStatusName.toLowerCase());
  if (!target) {
    throw new Error('Transition to ' + targetStatusName + ' not available for ' + ticketKey + '. Available: ' + transData.transitions.map(t => t.to.name).join(', '));
  }
  await jiraRequest('/rest/api/3/issue/' + ticketKey + '/transitions', {
    method: 'POST',
    body: JSON.stringify({ transition: { id: target.id } })
  });
  return target.to.name;
}

module.exports = {
  getBoardTickets,
  createStoryFromRequirement,
  addComment,
  transitionTicket,
  projectKey: loadEnv().JIRA_PROJECT_KEY
};
