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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const purchases_service_1 = require("../purchases/purchases.service");
const reviews_service_1 = require("../reviews/reviews.service");
let DashboardService = class DashboardService {
    agentsService;
    purchasesService;
    reviewsService;
    constructor(agentsService, purchasesService, reviewsService) {
        this.agentsService = agentsService;
        this.purchasesService = purchasesService;
        this.reviewsService = reviewsService;
    }
    async getRevenue(userId) {
        const agents = await this.agentsService.findAll({ ownerId: userId });
        const today = new Date();
        const mockRevenue = {
            total: Math.floor(Math.random() * 10000) + 1000,
            thisMonth: Math.floor(Math.random() * 3000) + 500,
            lastMonth: Math.floor(Math.random() * 2500) + 400,
            currency: 'USD',
            agentCount: agents.length,
            daily: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(today.getTime() - (6 - i) * 86400000)
                    .toISOString()
                    .split('T')[0],
                amount: Math.floor(Math.random() * 500) + 50,
            })),
        };
        return mockRevenue;
    }
    async getRecentOrders(userId, limit = 10) {
        const agents = await this.agentsService.findAll({ ownerId: userId });
        const agentIds = agents.map((a) => a.id);
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
    async getMyAgentsPerformance(userId) {
        const agents = await this.agentsService.findAll({ ownerId: userId });
        const performance = await Promise.all(agents.map(async (agent) => {
            const reviews = await this.reviewsService.findByAgent(agent.id);
            const avgRating = reviews.length > 0
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
        }));
        return performance;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        purchases_service_1.PurchasesService,
        reviews_service_1.ReviewsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map