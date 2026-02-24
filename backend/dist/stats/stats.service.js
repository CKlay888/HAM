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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const reviews_service_1 = require("../reviews/reviews.service");
let StatsService = class StatsService {
    agentsService;
    reviewsService;
    mockStats = {
        totalUsers: 1250,
        totalTransactions: 3420,
        totalRevenue: 128500,
    };
    constructor(agentsService, reviewsService) {
        this.agentsService = agentsService;
        this.reviewsService = reviewsService;
    }
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
    async getAgentStats(agentId) {
        const agent = await this.agentsService.findOne(agentId);
        const reviews = await this.reviewsService.findByAgent(agentId);
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
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
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        reviews_service_1.ReviewsService])
], StatsService);
//# sourceMappingURL=stats.service.js.map