const axios = require('axios');
const { execSync } = require('child_process');
require('dotenv').config();

class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPOSITORY || '1sharvari/Agents';
    this.baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';

    if (this.token) {
      this.client = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'SDLC-Orchestrator-Agent'
        },
        timeout: 15000
      });
    }
  }

  isConfigured() {
    return Boolean(this.token && this.repo);
  }

  createLocalBranch(branchName) {
    try {
      execSync(`git checkout -B ${branchName}`, { stdio: 'pipe' });
      return { success: true, branch: branchName };
    } catch (error) {
      console.error(`Error creating branch ${branchName}:`, error.message);
      throw error;
    }
  }

  commitAndPush(branchName, commitMessage) {
    try {
      execSync('git add .', { stdio: 'pipe' });
      try {
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
      } catch (commitErr) {
        // Might be nothing to commit if already committed
        console.log('No new local changes to commit or already committed.');
      }
      execSync(`git push -u origin ${branchName} --force`, { stdio: 'pipe' });
      return { success: true, branch: branchName };
    } catch (error) {
      console.error(`Error pushing branch ${branchName}:`, error.message);
      throw error;
    }
  }

  async getPullRequestForBranch(branchName) {
    if (!this.isConfigured()) return null;
    const [owner, repoName] = this.repo.split('/');
    try {
      const response = await this.client.get(`/repos/${owner}/${repoName}/pulls?head=${owner}:${branchName}&state=open`);
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching PR for branch:', error.response?.data || error.message);
      return null;
    }
  }

  async createPullRequest({ title, body, headBranch, baseBranch = this.baseBranch }) {
    if (!this.isConfigured()) {
      throw new Error('GitHub is not configured.');
    }
    const [owner, repoName] = this.repo.split('/');

    // Check if PR already exists
    const existingPr = await this.getPullRequestForBranch(headBranch);
    if (existingPr) {
      return existingPr;
    }

    try {
      const response = await this.client.post(`/repos/${owner}/${repoName}/pulls`, {
        title,
        body,
        head: headBranch,
        base: baseBranch
      });
      return response.data;
    } catch (error) {
      console.error('Error creating GitHub PR:', error.response?.data || error.message);
      throw error;
    }
  }

  async addPullRequestComment(prNumber, commentBody) {
    if (!this.isConfigured()) return null;
    const [owner, repoName] = this.repo.split('/');
    try {
      const response = await this.client.post(`/repos/${owner}/${repoName}/issues/${prNumber}/comments`, {
        body: commentBody
      });
      return response.data;
    } catch (error) {
      console.error('Error adding PR comment:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPullRequestDiff(prNumber) {
    if (!this.isConfigured()) return '';
    const [owner, repoName] = this.repo.split('/');
    try {
      const response = await this.client.get(`/repos/${owner}/${repoName}/pulls/${prNumber}`, {
        headers: {
          Accept: 'application/vnd.github.v3.diff'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching PR diff:', error.response?.data || error.message);
      return '';
    }
  }
}

module.exports = {
  GitHubService
};
