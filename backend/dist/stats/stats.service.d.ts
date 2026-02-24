import { AgentsService } from '../agents/agents.service';
import { ReviewsService } from '../reviews/reviews.service';
export declare class StatsService {
    private agentsService;
    private reviewsService;
    private mockStats;
    constructor(agentsService: AgentsService, reviewsService: ReviewsService);
    getOverview(): Promise<{
        totalAgents: number;
        totalUsers: number;
        totalTransactions: number;
        totalRevenue: number;
        currency: string;
    }>;
    getAgentStats(agentId: string): Promise<{
        agentId: string;
        agentName: string;
        salesCount: number;
        revenue: number;
        currency: string;
        reviewCount: number;
        averageRating: number;
    }>;
    getTrendingAgents(limit?: number): Promise<{
        trendScore: number;
        weeklyGrowth: string;
        id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        currency: string;
        ownerId: string;
        capabilities: string[];
        apiEndpoint?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getNewAgents(limit?: number): Promise<import("../agents/entities/agent.entity").Agent[]>;
}
