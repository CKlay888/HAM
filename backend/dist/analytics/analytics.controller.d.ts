import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getUserAnalytics(req: any): Promise<{
        userId: string;
        period: string;
        summary: {
            totalViews: number;
            totalClicks: number;
            totalPurchases: number;
            conversionRate: string;
            revenue: number;
        };
        agentStats: {
            agentId: string;
            agentName: string;
            views: number;
            clicks: number;
            purchases: number;
        }[];
        dailyTrend: {
            date: string;
            views: number;
            purchases: number;
        }[];
    }>;
    getAgentAnalytics(id: string): Promise<{
        agentId: string;
        agentName: string;
        period: string;
        metrics: {
            totalViews: number;
            uniqueVisitors: number;
            avgTimeOnPage: string;
            bounceRate: string;
            purchases: number;
            revenue: number;
        };
        trafficSources: {
            source: string;
            percentage: number;
            visits: number;
        }[];
        hourlyDistribution: {
            hour: number;
            views: number;
        }[];
    }>;
    getPlatformAnalytics(): Promise<{
        period: string;
        overview: {
            totalUsers: number;
            activeUsers: number;
            newUsers: number;
            totalAgents: number;
            totalTransactions: number;
            totalRevenue: number;
        };
        topCategories: {
            category: string;
            count: number;
            revenue: number;
        }[];
        growthRate: {
            users: string;
            agents: string;
            revenue: string;
        };
    }>;
}
