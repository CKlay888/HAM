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
exports.ExecutionsService = void 0;
const common_1 = require("@nestjs/common");
const execution_entity_1 = require("./entities/execution.entity");
const agents_service_1 = require("../agents/agents.service");
const purchases_service_1 = require("../purchases/purchases.service");
const crypto_1 = require("crypto");
let ExecutionsService = class ExecutionsService {
    agentsService;
    purchasesService;
    executions = new Map();
    constructor(agentsService, purchasesService) {
        this.agentsService = agentsService;
        this.purchasesService = purchasesService;
    }
    async findAll(userId) {
        return Array.from(this.executions.values())
            .filter((e) => e.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async findOne(id, userId) {
        const execution = this.executions.get(id);
        if (!execution) {
            throw new common_1.NotFoundException(`Execution ${id} not found`);
        }
        if (execution.userId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own executions');
        }
        return execution;
    }
    async create(dto, userId) {
        const agent = await this.agentsService.findOne(dto.agentId);
        if (!agent.isActive) {
            throw new common_1.BadRequestException('Agent is not available');
        }
        if (agent.ownerId !== userId) {
            const purchases = await this.purchasesService.findAll(userId);
            const hasPurchased = purchases.some((p) => p.agentId === dto.agentId && p.status === 'completed');
            if (!hasPurchased) {
                throw new common_1.ForbiddenException('You must purchase this agent first');
            }
        }
        const now = new Date();
        const execution = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            agentId: dto.agentId,
            input: dto.input || {},
            status: execution_entity_1.ExecutionStatus.COMPLETED,
            output: { result: 'Agent executed successfully', timestamp: now },
            startedAt: now,
            completedAt: now,
            createdAt: now,
        };
        this.executions.set(execution.id, execution);
        return execution;
    }
};
exports.ExecutionsService = ExecutionsService;
exports.ExecutionsService = ExecutionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        purchases_service_1.PurchasesService])
], ExecutionsService);
//# sourceMappingURL=executions.service.js.map