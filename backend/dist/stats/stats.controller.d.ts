import { StatsService } from './stats.service';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getOverview(): Promise<{
        totalAgents: number;
        totalUsers: number;
        totalTransactions: number;
        totalRevenue: number;
        currency: string;
    }>;
    getAgentStats(id: string): Promise<{
        agentId: string;
        agentName: string;
        salesCount: number;
        revenue: number;
        currency: string;
        reviewCount: number;
        averageRating: number;
    }>;
    getTrendingAgents(limit?: string): Promise<{
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
    getNewAgents(limit?: string): Promise<import("../agents/entities/agent.entity").Agent[]>;
}
