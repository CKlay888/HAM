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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const purchases_service_1 = require("../purchases/purchases.service");
const crypto_1 = require("crypto");
let ReviewsService = class ReviewsService {
    agentsService;
    purchasesService;
    reviews = new Map();
    constructor(agentsService, purchasesService) {
        this.agentsService = agentsService;
        this.purchasesService = purchasesService;
    }
    async findByAgent(agentId) {
        return Array.from(this.reviews.values())
            .filter((r) => r.agentId === agentId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async create(dto, userId) {
        await this.agentsService.findOne(dto.agentId);
        const purchases = await this.purchasesService.findAll(userId);
        const hasPurchased = purchases.some((p) => p.agentId === dto.agentId && p.status === 'completed');
        if (!hasPurchased) {
            throw new common_1.ForbiddenException('You must purchase this agent to review');
        }
        const existing = Array.from(this.reviews.values()).find((r) => r.userId === userId && r.agentId === dto.agentId);
        if (existing) {
            throw new common_1.BadRequestException('You have already reviewed this agent');
        }
        const now = new Date();
        const review = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            agentId: dto.agentId,
            rating: dto.rating,
            content: dto.content,
            createdAt: now,
            updatedAt: now,
        };
        this.reviews.set(review.id, review);
        return review;
    }
    async remove(id, userId) {
        const review = this.reviews.get(id);
        if (!review) {
            throw new common_1.NotFoundException(`Review ${id} not found`);
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        this.reviews.delete(id);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        purchases_service_1.PurchasesService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map