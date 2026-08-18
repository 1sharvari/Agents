const axios = require('axios');
require('dotenv').config();

const JIRA_STATUSES = {
  toDo: 'To Do',
  devReady: 'Dev Ready',
  inDev: 'In Dev',
  codeReview: 'In Review',
  qaReady: 'QA Ready',
  qaPass: 'QA Pass',
  deploymentReady: 'Deployment Ready',
  done: 'Done'
};

class JiraService {
  constructor() {
    this.baseUrl = (process.env.JIRA_BASE_URL || '').replace(/\/$/, '');
    this.email = process.env.JIRA_EMAIL;
    this.apiToken = process.env.JIRA_API_TOKEN;
    this.projectKey = process.env.JIRA_PROJECT_KEY || 'SHOP';
    this.boardId = process.env.JIRA_BOARD_ID || '2';

    if (this.email && this.apiToken) {
      const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
      this.client = axios.create({
        baseURL: `${this.baseUrl}/rest/api/3`,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      this.clientV2 = axios.create({
        baseURL: `${this.baseUrl}/rest/api/2`,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      this.agileClient = axios.create({
        baseURL: `${this.baseUrl}/rest/agile/1.0`,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
    }
  }

  isConfigured() {
    return Boolean(this.baseUrl && this.email && this.apiToken);
  }

  textToAdf(text) {
    const lines = text.split('\n');
    const content = [];
    let currentParagraph = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        content.push({
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: line.replace('# ', '') }]
        });
      } else if (line.startsWith('## ')) {
        content.push({
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: line.replace('## ', '') }]
        });
      } else if (line.startsWith('### ')) {
        content.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: line.replace('### ', '') }]
        });
      } else if (line.trim().length === 0) {
        if (currentParagraph.length > 0) {
          content.push({
            type: 'paragraph',
            content: currentParagraph
          });
          currentParagraph = [];
        }
      } else {
        currentParagraph.push({
          type: 'text',
          text: line + '\n'
        });
      }
    }

    if (currentParagraph.length > 0) {
      content.push({
        type: 'paragraph',
        content: currentParagraph
      });
    }

    if (content.length === 0) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: text || 'No description provided' }]
      });
    }

    return {
      version: 1,
      type: 'doc',
      content
    };
  }

  async searchIssues(jql) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured. Please check .env file.');
    }
    const query = jql || `project = "${this.projectKey}" ORDER BY updated DESC`;
    const defaultFields = ['summary', 'status', 'description', 'issuetype', 'labels', 'updated', 'created'];

    try {
      const res = await this.client.post('/search/jql', {
        jql: query,
        fields: defaultFields,
        maxResults: 50
      });
      return res.data.issues || [];
    } catch (e1) {
      try {
        const res = await this.client.post('/search', {
          jql: query,
          fields: defaultFields,
          maxResults: 50
        });
        return res.data.issues || [];
      } catch (e2) {
        try {
          const res = await this.clientV2.get(`/search?jql=${encodeURIComponent(query)}`);
          return res.data.issues || [];
        } catch (e3) {
          try {
            const res = await this.agileClient.get(`/board/${this.boardId}/issue?jql=${encodeURIComponent(query)}`);
            return res.data.issues || [];
          } catch (e4) {
            console.error('Jira search error:', e4.response?.data || e4.message);
            return [];
          }
        }
      }
    }
  }

  async getIssue(issueKey) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured.');
    }
    try {
      const response = await this.client.get(`/issue/${issueKey}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching issue ${issueKey}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async createStory({ summary, description, issueType = 'Story', labels = ['sdlc-automated'] }) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured.');
    }
    const adfDescription = typeof description === 'string' ? this.textToAdf(description) : description;

    const payload = {
      fields: {
        project: {
          key: this.projectKey
        },
        summary,
        description: adfDescription,
        issuetype: {
          name: issueType
        },
        labels
      }
    };

    try {
      const response = await this.client.post('/issue', payload);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors?.issuetype) {
        console.warn(`Issue type '${issueType}' not recognized. Retrying with 'Task'...`);
        payload.fields.issuetype.name = 'Task';
        const retryResponse = await this.client.post('/issue', payload);
        return retryResponse.data;
      }
      console.error('Error creating Jira issue:', error.response?.data || error.message);
      throw error;
    }
  }

  async addComment(issueKey, commentText) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured.');
    }
    const adfComment = this.textToAdf(commentText);
    try {
      const response = await this.client.post(`/issue/${issueKey}/comment`, {
        body: adfComment
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to ${issueKey}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getTransitions(issueKey) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured.');
    }
    try {
      const response = await this.client.get(`/issue/${issueKey}/transitions`);
      return response.data.transitions || [];
    } catch (error) {
      console.error(`Error fetching transitions for ${issueKey}:`, error.response?.data || error.message);
      throw error;
    }
  }

  async transitionIssue(issueKey, targetStatusName) {
    if (!this.isConfigured()) {
      throw new Error('Jira is not configured.');
    }
    try {
      const transitions = await this.getTransitions(issueKey);
      const match = transitions.find(
        (t) =>
          t.name.toLowerCase() === targetStatusName.toLowerCase() ||
          t.to?.name?.toLowerCase() === targetStatusName.toLowerCase()
      );

      if (!match) {
        const available = transitions.map((t) => `'${t.name}' (-> ${t.to?.name})`).join(', ');
        throw new Error(
          `Cannot transition ${issueKey} to '${targetStatusName}'. Available transitions: ${available || 'None'}`
        );
      }

      await this.client.post(`/issue/${issueKey}/transitions`, {
        transition: {
          id: match.id
        }
      });

      return {
        success: true,
        transitionId: match.id,
        status: targetStatusName
      };
    } catch (error) {
      console.error(`Failed to transition ${issueKey} to '${targetStatusName}':`, error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = {
  JiraService,
  JIRA_STATUSES
};
