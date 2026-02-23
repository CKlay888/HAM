import { Injectable } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class StatsService {
  // 模拟统计数据
  private mockStats = {
    totalUsers: 1250,
    totalTransactions: 3420,
    totalRevenue: 128500,
  };

  constructor(
    private agentsService: AgentsService,
    private reviewsService: ReviewsService,
  ) {}

  async getOverview() {
    const agents = await this.agentsService.findAll({ isActive: true });
    return {
      totalAgents: agents.length,
      totalUsers: this.mockStats.totalUsers,
      totalTransactions: this.mockStats.totalTransactions,
      totalRevenue: this.mockStats.totalRevenue,
      currency: 'USD',
    };
  }

  async getAgentStats(agentId: string) {
    const agent = await this.agentsService.findOne(agentId);
    const reviews = await this.reviewsService.findByAgent(agentId);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // 模拟销量数据
    const salesCount = Math.floor(Math.random() * 100) + 1;
    const revenue = salesCount * agent.price;

    return {
      agentId,
      agentName: agent.name,
      salesCount,
      revenue,
      currency: agent.currency,
      reviewCount: reviews.length,
      averageRating: parseFloat(avgRating.toFixed(2)),
    };
  }

  async getTrendingAgents(limit = 10) {
    const agents = await this.agentsService.findAll({ isActive: true });
    // 模拟趋势排序（按随机热度）
    return agents
      .map((a) => ({
        ...a,
        trendScore: Math.floor(Math.random() * 100),
        weeklyGrowth: `${(Math.random() * 50).toFixed(1)}%`,
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  async getNewAgents(limit = 10) {
    const agents = await this.agentsService.findAll({ isActive: true });
    return agents
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
