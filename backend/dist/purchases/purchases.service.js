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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const purchase_entity_1 = require("./entities/purchase.entity");
const agents_service_1 = require("../agents/agents.service");
const crypto_1 = require("crypto");
let PurchasesService = class PurchasesService {
    agentsService;
    purchases = new Map();
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAll(userId) {
        return Array.from(this.purchases.values()).filter((p) => p.userId === userId);
    }
    async findOne(id, userId) {
        const purchase = this.purchases.get(id);
        if (!purchase) {
            throw new common_1.NotFoundException(`Purchase ${id} not found`);
        }
        if (purchase.userId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own purchases');
        }
        return purchase;
    }
    async create(dto, userId) {
        const agent = await this.agentsService.findOne(dto.agentId);
        if (!agent.isActive) {
            throw new common_1.BadRequestException('Agent is not available for purchase');
        }
        if (agent.ownerId === userId) {
            throw new common_1.BadRequestException('You cannot purchase your own agent');
        }
        const existing = Array.from(this.purchases.values()).find((p) => p.userId === userId &&
            p.agentId === dto.agentId &&
            p.status === purchase_entity_1.PurchaseStatus.COMPLETED);
        if (existing) {
            throw new common_1.BadRequestException('You have already purchased this agent');
        }
        const purchase = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            agentId: dto.agentId,
            amount: agent.price,
            currency: agent.currency,
            status: purchase_entity_1.PurchaseStatus.COMPLETED,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.purchases.set(purchase.id, purchase);
        return purchase;
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map