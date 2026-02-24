import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { ReviewsService } from '../reviews/reviews.service';
export declare class DashboardService {
    private agentsService;
    private purchasesService;
    private reviewsService;
    constructor(agentsService: AgentsService, purchasesService: PurchasesService, reviewsService: ReviewsService);
    getRevenue(userId: string): Promise<{
        total: number;
        thisMonth: number;
        lastMonth: number;
        currency: string;
        agentCount: number;
        daily: {
            date: string;
            amount: number;
        }[];
    }>;
    getRecentOrders(userId: string, limit?: number): Promise<{
        id: string;
        agentId: string;
        agentName: string;
        buyerId: string;
        amount: number;
        currency: string;
        status: string;
        createdAt: Date;
    }[]>;
    getMyAgentsPerformance(userId: string): Promise<{
        id: string;
        name: string;
        salesCount: number;
        revenue: number;
        reviewCount: number;
        averageRating: number;
        isActive: boolean;
    }[]>;
}
