import { Injectable } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class DashboardService {
  constructor(
    private agentsService: AgentsService,
    private purchasesService: PurchasesService,
    private reviewsService: ReviewsService,
  ) {}

  async getRevenue(userId: string) {
    // 获取用户创建的所有 Agent
    const agents = await this.agentsService.findAll({ ownerId: userId });

    // 模拟收入数据
    const today = new Date();
    const mockRevenue = {
      total: Math.floor(Math.random() * 10000) + 1000,
      thisMonth: Math.floor(Math.random() * 3000) + 500,
      lastMonth: Math.floor(Math.random() * 2500) + 400,
      currency: 'USD',
      agentCount: agents.length,
      // 最近7天收入趋势
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(today.getTime() - (6 - i) * 86400000)
          .toISOString()
          .split('T')[0],
        amount: Math.floor(Math.random() * 500) + 50,
      })),
    };

    return mockRevenue;
  }

  async getRecentOrders(userId: string, limit = 10) {
    // 获取用户创建的 Agent 的订单（作为卖家）
    const agents = await this.agentsService.findAll({ ownerId: userId });
    const agentIds = agents.map((a) => a.id);

    // 模拟订单数据
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `order-${Date.now()}-${i}`,
      agentId: agentIds[i % agentIds.length] || 'unknown',
      agentName: agents[i % agents.length]?.name || 'Unknown Agent',
      buyerId: `user-${Math.random().toString(36).slice(2, 8)}`,
      amount: Math.floor(Math.random() * 100) + 10,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date(Date.now() - i * 3600000),
    }));
  }

  async getMyAgentsPerformance(userId: string) {
    const agents = await this.agentsService.findAll({ ownerId: userId });

    const performance = await Promise.all(
      agents.map(async (agent) => {
        const reviews = await this.reviewsService.findByAgent(agent.id);
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
          id: agent.id,
          name: agent.name,
          salesCount: Math.floor(Math.random() * 50) + 1,
          revenue: Math.floor(Math.random() * 2000) + 100,
          reviewCount: reviews.length,
          averageRating: parseFloat(avgRating.toFixed(2)),
          isActive: agent.isActive,
        };
      }),
    );

    return performance;
  }
}
