import { Controller, Post, Get, Body } from '@nestjs/common';
import { AgentsService } from './agents.service.js';

@Controller('api/agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('health')
  getHealth() {
    return this.agentsService.getHealth();
  }

  // Core Phase 1
  @Post('analyze-and-tailor')
  analyzeAndTailor(@Body() body: any) {
    return this.agentsService.analyzeAndTailor(body);
  }

  @Post('approve-cv')
  approveCV(@Body() body: any) {
    return this.agentsService.approveCV(body);
  }

  @Post('verify-truth')
  verifyTruth(@Body() body: any) {
    return this.agentsService.verifyTruth(body);
  }

  // Team A: Profile & Portfolio
  @Post('profile/normalize')
  normalizeProfile(@Body() body: any) {
    return this.agentsService.normalizeProfile(body);
  }

  @Post('portfolio/build')
  buildPortfolio(@Body() body: any) {
    return this.agentsService.buildPortfolio(body);
  }

  @Post('profile/check-staleness')
  checkStaleness(@Body() body: any) {
    return this.agentsService.checkStaleness(body);
  }

  // Team B: Job & Skill Intelligence
  @Post('jobs/discover')
  discoverJobs(@Body() body: any) {
    return this.agentsService.discoverJobs(body);
  }

  @Post('learning/path')
  learningPath(@Body() body: any) {
    return this.agentsService.learningPath(body);
  }

  @Post('advisor/chat')
  advisorChat(@Body() body: any) {
    return this.agentsService.advisorChat(body);
  }

  // Team C: Document Studio
  @Post('application/prepare')
  prepareApplication(@Body() body: any) {
    return this.agentsService.prepareApplication(body);
  }

  // Team D: Outreach & Tracking
  @Post('outreach/draft-email')
  draftEmail(@Body() body: any) {
    return this.agentsService.draftEmail(body);
  }

  @Post('tracker/transition')
  trackerTransition(@Body() body: any) {
    return this.agentsService.trackerTransition(body);
  }

  @Post('tracker/kanban')
  kanbanBoard(@Body() body: any) {
    return this.agentsService.kanbanBoard(body);
  }
}
