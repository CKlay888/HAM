import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getRevenue(req: any): Promise<{
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
    getRecentOrders(req: any, limit?: string): Promise<{
        id: string;
        agentId: string;
        agentName: string;
        buyerId: string;
        amount: number;
        currency: string;
        status: string;
        createdAt: Date;
    }[]>;
    getMyAgentsPerformance(req: any): Promise<{
        id: string;
        name: string;
        salesCount: number;
        revenue: number;
        reviewCount: number;
        averageRating: number;
        isActive: boolean;
    }[]>;
}
