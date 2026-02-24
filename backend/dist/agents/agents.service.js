"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let AgentsService = class AgentsService {
    agents = new Map();
    async findAll(query) {
        let results = Array.from(this.agents.values());
        if (query?.category) {
            results = results.filter((a) => a.category === query.category);
        }
        if (query?.ownerId) {
            results = results.filter((a) => a.ownerId === query.ownerId);
        }
        if (query?.isActive !== undefined) {
            results = results.filter((a) => a.isActive === query.isActive);
        }
        return results;
    }
    async findOne(id) {
        const agent = this.agents.get(id);
        if (!agent) {
            throw new common_1.NotFoundException(`Agent ${id} not found`);
        }
        return agent;
    }
    async create(dto, ownerId) {
        const agent = {
            id: (0, crypto_1.randomUUID)(),
            name: dto.name,
            description: dto.description,
            category: dto.category,
            price: dto.price,
            currency: dto.currency || 'USD',
            ownerId,
            capabilities: dto.capabilities,
            apiEndpoint: dto.apiEndpoint,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.agents.set(agent.id, agent);
        return agent;
    }
    async update(id, dto, userId) {
        const agent = await this.findOne(id);
        if (agent.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own agents');
        }
        const updated = {
            ...agent,
            ...dto,
            updatedAt: new Date(),
        };
        this.agents.set(id, updated);
        return updated;
    }
    async remove(id, userId) {
        const agent = await this.findOne(id);
        if (agent.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own agents');
        }
        this.agents.delete(id);
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)()
], AgentsService);
//# sourceMappingURL=agents.service.js.map