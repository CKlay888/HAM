import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /**
   * GET /dashboard/revenue
   * 收入统计
   */
  @Get('revenue')
  async getRevenue(@Request() req) {
    return this.dashboardService.getRevenue(req.user.id);
  }

  /**
   * GET /dashboard/orders
   * 最近订单（作为卖家）
   */
  @Get('orders')
  async getRecentOrders(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.getRecentOrders(
      req.user.id,
      limit ? parseInt(limit) : 10,
    );
  }

  /**
   * GET /dashboard/agents
   * 我的 Agent 表现
   */
  @Get('agents')
  async getMyAgentsPerformance(@Request() req) {
    return this.dashboardService.getMyAgentsPerformance(req.user.id);
  }
}
