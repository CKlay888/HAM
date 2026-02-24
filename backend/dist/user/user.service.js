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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const purchases_service_1 = require("../purchases/purchases.service");
const agents_service_1 = require("../agents/agents.service");
const balances = new Map();
const profiles = new Map();
let UserService = class UserService {
    usersService;
    purchasesService;
    agentsService;
    constructor(usersService, purchasesService, agentsService) {
        this.usersService = usersService;
        this.purchasesService = purchasesService;
        this.agentsService = agentsService;
    }
    async getProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const extra = profiles.get(userId) || {};
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            bio: extra.bio || '',
            avatar: extra.avatar || '',
            createdAt: user.createdAt,
        };
    }
    async updateProfile(userId, dto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.username) {
            user.username = dto.username;
            user.updatedAt = new Date();
        }
        const extra = profiles.get(userId) || {};
        if (dto.bio !== undefined)
            extra.bio = dto.bio;
        if (dto.avatar !== undefined)
            extra.avatar = dto.avatar;
        profiles.set(userId, extra);
        return this.getProfile(userId);
    }
    async getBalance(userId) {
        const balance = balances.get(userId) || 0;
        return {
            userId,
            balance,
            currency: 'USD',
        };
    }
    async recharge(userId, dto) {
        const current = balances.get(userId) || 0;
        const newBalance = current + dto.amount;
        balances.set(userId, newBalance);
        return {
            userId,
            amount: dto.amount,
            balance: newBalance,
            currency: 'USD',
            message: 'Recharge successful',
        };
    }
    async getOrders(userId) {
        const purchases = await this.purchasesService.findAll(userId);
        const ordersWithAgent = await Promise.all(purchases.map(async (p) => {
            try {
                const agent = await this.agentsService.findOne(p.agentId);
                return { ...p, agent: { id: agent.id, name: agent.name } };
            }
            catch {
                return { ...p, agent: null };
            }
        }));
        return ordersWithAgent;
    }
    async getMyAgents(userId) {
        const purchases = await this.purchasesService.findAll(userId);
        const completedPurchases = purchases.filter((p) => p.status === 'completed');
        const agents = await Promise.all(completedPurchases.map(async (p) => {
            try {
                return await this.agentsService.findOne(p.agentId);
            }
            catch {
                return null;
            }
        }));
        return agents.filter((a) => a !== null);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        purchases_service_1.PurchasesService,
        agents_service_1.AgentsService])
], UserService);
//# sourceMappingURL=user.service.js.map