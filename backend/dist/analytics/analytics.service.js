"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
let AnalyticsService = class AnalyticsService {
    agentsService;
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async getUserAnalytics(userId) {
        const agents = await this.agentsService.findAll({ ownerId: userId });
        const now = new Date();
        return {
            userId,
            period: 'last_30_days',
            summary: {
                totalViews: Math.floor(Math.random() * 10000) + 1000,
                totalClicks: Math.floor(Math.random() * 2000) + 200,
                totalPurchases: Math.floor(Math.random() * 100) + 10,
                conversionRate: `${(Math.random() * 5 + 1).toFixed(2)}%`,
                revenue: Math.floor(Math.random() * 5000) + 500,
            },
            agentStats: agents.map((a) => ({
                agentId: a.id,
                agentName: a.name,
                views: Math.floor(Math.random() * 1000) + 100,
                clicks: Math.floor(Math.random() * 200) + 20,
                purchases: Math.floor(Math.random() * 20) + 1,
            })),
            dailyTrend: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(now.getTime() - (6 - i) * 86400000).toISOString().split('T')[0],
                views: Math.floor(Math.random() * 500) + 50,
                purchases: Math.floor(Math.random() * 10) + 1,
            })),
        };
    }
    async getAgentAnalytics(agentId) {
        const agent = await this.agentsService.findOne(agentId);
        const now = new Date();
        return {
            agentId,
            agentName: agent.name,
            period: 'last_30_days',
            metrics: {
                totalViews: Math.floor(Math.random() * 5000) + 500,
                uniqueVisitors: Math.floor(Math.random() * 2000) + 200,
                avgTimeOnPage: `${Math.floor(Math.random() * 120) + 30}s`,
                bounceRate: `${(Math.random() * 40 + 20).toFixed(1)}%`,
                purchases: Math.floor(Math.random() * 50) + 5,
                revenue: Math.floor(Math.random() * 2000) + 200,
            },
            trafficSources: [
                { source: 'search', percentage: 35, visits: 350 },
                { source: 'direct', percentage: 25, visits: 250 },
                { source: 'referral', percentage: 20, visits: 200 },
                { source: 'social', percentage: 20, visits: 200 },
            ],
            hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                views: Math.floor(Math.random() * 100) + 10,
            })),
        };
    }
    async getPlatformAnalytics() {
        return {
            period: 'last_30_days',
            overview: {
                totalUsers: Math.floor(Math.random() * 10000) + 5000,
                activeUsers: Math.floor(Math.random() * 3000) + 1000,
                newUsers: Math.floor(Math.random() * 500) + 100,
                totalAgents: Math.floor(Math.random() * 1000) + 200,
                totalTransactions: Math.floor(Math.random() * 5000) + 1000,
                totalRevenue: Math.floor(Math.random() * 100000) + 20000,
            },
            topCategories: [
                { category: 'productivity', count: 150, revenue: 15000 },
                { category: 'creative', count: 120, revenue: 12000 },
                { category: 'data', count: 100, revenue: 10000 },
                { category: 'development', count: 80, revenue: 8000 },
            ],
            growthRate: {
                users: '+12.5%',
                agents: '+8.3%',
                revenue: '+15.2%',
            },
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map