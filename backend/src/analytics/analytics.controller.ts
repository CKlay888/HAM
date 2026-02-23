import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('user')
  async getUserAnalytics(@Request() req) {
    return this.analyticsService.getUserAnalytics(req.user.id);
  }

  @Get('agent/:id')
  async getAgentAnalytics(@Param('id') id: string) {
    return this.analyticsService.getAgentAnalytics(id);
  }

  @Get('platform')
  async getPlatformAnalytics() {
    return this.analyticsService.getPlatformAnalytics();
  }
}
