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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const agents_service_1 = require("../agents/agents.service");
const crypto_1 = require("crypto");
let FavoritesService = class FavoritesService {
    agentsService;
    favorites = new Map();
    constructor(agentsService) {
        this.agentsService = agentsService;
    }
    async findAll(userId) {
        const userFavorites = Array.from(this.favorites.values()).filter((f) => f.userId === userId);
        const favoritesWithAgent = await Promise.all(userFavorites.map(async (f) => {
            try {
                const agent = await this.agentsService.findOne(f.agentId);
                return { ...f, agent };
            }
            catch {
                return { ...f, agent: null };
            }
        }));
        return favoritesWithAgent.filter((f) => f.agent !== null);
    }
    async create(dto, userId) {
        await this.agentsService.findOne(dto.agentId);
        const existing = Array.from(this.favorites.values()).find((f) => f.userId === userId && f.agentId === dto.agentId);
        if (existing) {
            throw new common_1.BadRequestException('Agent already in favorites');
        }
        const favorite = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            agentId: dto.agentId,
            createdAt: new Date(),
        };
        this.favorites.set(favorite.id, favorite);
        return favorite;
    }
    async remove(id, userId) {
        const favorite = this.favorites.get(id);
        if (!favorite) {
            throw new common_1.NotFoundException(`Favorite ${id} not found`);
        }
        if (favorite.userId !== userId) {
            throw new common_1.NotFoundException(`Favorite ${id} not found`);
        }
        this.favorites.delete(id);
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agents_service_1.AgentsService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map