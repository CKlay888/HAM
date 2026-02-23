import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private statsService: StatsService) {}

  /**
   * GET /stats/overview
   * 平台概览统计
   */
  @Get('stats/overview')
  async getOverview() {
    return this.statsService.getOverview();
  }

  /**
   * GET /stats/agent/:id
   * Agent 统计（销量、收入、评分）
   */
  @Get('stats/agent/:id')
  async getAgentStats(@Param('id') id: string) {
    return this.statsService.getAgentStats(id);
  }

  /**
   * GET /agents/trending
   * 趋势 Agent
   */
  @Get('agents/trending')
  async getTrendingAgents(@Query('limit') limit?: string) {
    return this.statsService.getTrendingAgents(limit ? parseInt(limit) : 10);
  }

  /**
   * GET /agents/new
   * 新上架 Agent
   */
  @Get('agents/new')
  async getNewAgents(@Query('limit') limit?: string) {
    return this.statsService.getNewAgents(limit ? parseInt(limit) : 10);
  }
}
