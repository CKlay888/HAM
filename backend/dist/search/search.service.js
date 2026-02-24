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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const purchases_service_1 = require("../purchases/purchases.service");
const reviews_service_1 = require("../reviews/reviews.service");
const search_query_dto_1 = require("./dto/search-query.dto");
let SearchService = class SearchService {
    agentsService;
    purchasesService;
    reviewsService;
    categories = [
        { id: 'productivity', name: '效率工具', description: '提升工作效率的 Agent' },
        { id: 'creative', name: '创意设计', description: '设计和创意相关' },
        { id: 'data', name: '数据分析', description: '数据处理和分析' },
        { id: 'communication', name: '沟通协作', description: '沟通和协作工具' },
        { id: 'development', name: '开发工具', description: '编程和开发辅助' },
        { id: 'other', name: '其他', description: '其他类型' },
    ];
    constructor(agentsService, purchasesService, reviewsService) {
        this.agentsService = agentsService;
        this.purchasesService = purchasesService;
        this.reviewsService = reviewsService;
    }
    async search(query) {
        let agents = await this.agentsService.findAll({ isActive: true });
        if (query.q) {
            const keyword = query.q.toLowerCase();
            agents = agents.filter((a) => a.name.toLowerCase().includes(keyword) ||
                a.description.toLowerCase().includes(keyword) ||
                a.capabilities.some((c) => c.toLowerCase().includes(keyword)));
        }
        if (query.category) {
            agents = agents.filter((a) => a.category === query.category);
        }
        if (query.minPrice) {
            const minPrice = parseFloat(query.minPrice);
            agents = agents.filter((a) => a.price >= minPrice);
        }
        if (query.maxPrice) {
            const maxPrice = parseFloat(query.maxPrice);
            agents = agents.filter((a) => a.price <= maxPrice);
        }
        agents = this.sortAgents(agents, query.sort);
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '20');
        const total = agents.length;
        const results = agents.slice((page - 1) * limit, page * limit);
        return {
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getCategories() {
        return this.categories;
    }
    async getHotAgents(limit = 10) {
        const agents = await this.agentsService.findAll({ isActive: true });
        return agents
            .sort(() => Math.random() - 0.5)
            .slice(0, limit)
            .map((a) => ({ ...a, salesCount: Math.floor(Math.random() * 100) }));
    }
    async getRecommendedAgents(limit = 10) {
        const agents = await this.agentsService.findAll({ isActive: true });
        return agents
            .sort(() => Math.random() - 0.5)
            .slice(0, limit)
            .map((a) => ({ ...a, recommendScore: Math.random().toFixed(2) }));
    }
    sortAgents(agents, sort) {
        switch (sort) {
            case search_query_dto_1.SortBy.PRICE_ASC:
                return agents.sort((a, b) => a.price - b.price);
            case search_query_dto_1.SortBy.PRICE_DESC:
                return agents.sort((a, b) => b.price - a.price);
            case search_query_dto_1.SortBy.NEWEST:
                return agents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            case search_query_dto_1.SortBy.RATING:
            case search_query_dto_1.SortBy.SALES:
            default:
                return agents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        purchases_service_1.PurchasesService,
        reviews_service_1.ReviewsService])
], SearchService);
//# sourceMappingURL=search.service.js.map