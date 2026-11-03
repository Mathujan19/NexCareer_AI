import { Injectable } from '@nestjs/common';

const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

@Injectable()
export class AgentsService {
  private async forward(endpoint: string, method: string = 'POST', body?: any) {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(`${AI_AGENT_URL}${endpoint}`, options);
      if (!res.ok) {
        const errText = await res.text();
        return { error: `AI Agent responded with status ${res.status}: ${errText}` };
      }
      return await res.json();
    } catch (err: any) {
      return {
        error: `Could not connect to FastAPI AI Orchestrator at ${AI_AGENT_URL}. Ensure uvicorn is running. Details: ${err.message}`,
        status: 'OFFLINE_FALLBACK',
      };
    }
  }

  async getHealth() {
    return this.forward('/health', 'GET');
  }

  // Core Phase 1 Endpoints
  async analyzeAndTailor(body: any) {
    return this.forward('/api/agents/analyze-and-tailor', 'POST', body);
  }

  async approveCV(body: any) {
    return this.forward('/api/agents/approve-cv', 'POST', body);
  }

  async verifyTruth(body: any) {
    return this.forward('/api/agents/verify-truth', 'POST', body);
  }

  // Team A: Profile & Portfolio
  async normalizeProfile(body: any) {
    return this.forward('/api/agents/profile/normalize', 'POST', body);
  }

  async buildPortfolio(body: any) {
    return this.forward('/api/agents/portfolio/build', 'POST', body);
  }

  async checkStaleness(body: any) {
    return this.forward('/api/agents/profile/check-staleness', 'POST', body);
  }

  // Team B: Job & Skill Intelligence
  async discoverJobs(body: any) {
    return this.forward('/api/agents/jobs/discover', 'POST', body);
  }

  async learningPath(body: any) {
    return this.forward('/api/agents/learning/path', 'POST', body);
  }

  async advisorChat(body: any) {
    return this.forward('/api/agents/advisor/chat', 'POST', body);
  }

  // Team C: Document Studio
  async prepareApplication(body: any) {
    return this.forward('/api/agents/application/prepare', 'POST', body);
  }

  // Team D: Outreach & Tracking
  async draftEmail(body: any) {
    return this.forward('/api/agents/outreach/draft-email', 'POST', body);
  }

  async trackerTransition(body: any) {
    return this.forward('/api/agents/tracker/transition', 'POST', body);
  }

  async kanbanBoard(body: any) {
    return this.forward('/api/agents/tracker/kanban', 'POST', body);
  }
}
