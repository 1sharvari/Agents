const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.models = ['gemini-3.5-flash-lite', 'gemini-flash-latest'];
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async callGemini(prompt, systemInstruction = '') {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured in .env file.');
    }

    let lastError = null;

    for (const model of this.models) {
      const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              ...(systemInstruction ? [{ text: systemInstruction }] : []),
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      };

      try {
        const response = await axios.post(url, payload, { timeout: 45000 });
        const candidate = response.data?.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
          return JSON.parse(cleaned);
        }
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiService] Model ${model} failed, trying fallback...`, err.response?.data?.error?.message || err.message);
      }
    }

    throw lastError || new Error('All Gemini models failed to generate content');
  }

  async generateCode({ requirement, acceptanceCriteria, architecturePlan }) {
    console.log('🤖 [Gemini AI] Generating full-stack code for user story...');

    const systemPrompt = `You are a Senior Full-Stack Software Engineer AI.
Implement the required feature for Node.js Express backend and Angular frontend.
Return strictly valid JSON with keys:
{
  "serverCode": "complete JavaScript code for app/backend/server.js",
  "serverTestCode": "complete JavaScript unit tests for app/backend/server.test.js with >80% coverage",
  "angularAuthService": "TypeScript/JavaScript code for AuthService",
  "angularProductService": "TypeScript/JavaScript code for ProductService",
  "angularComponentHtml": "HTML code for Angular shop app component",
  "summary": "Summary of changes made"
}`;

    const prompt = `Requirement:
${requirement || 'Implement User Authentication & Product Catalog Flow'}

Acceptance Criteria:
${acceptanceCriteria || '1. POST /api/login authenticates user. 2. GET /api/health returns health status. 3. GET /api/products returns product list.'}

Architecture Plan:
${architecturePlan || 'Express REST endpoints + Supertest unit test suite + Angular services.'}`;

    try {
      const result = await this.callGemini(prompt, systemPrompt);
      return result;
    } catch (err) {
      console.warn('⚠️ [Gemini AI] Code generation API fallback: using robust template implementation.', err.message);
      return null;
    }
  }
}

module.exports = { GeminiService };
