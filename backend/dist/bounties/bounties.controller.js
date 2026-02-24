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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountiesController = void 0;
const common_1 = require("@nestjs/common");
const bounties_service_1 = require("./bounties.service");
const create_bounty_dto_1 = require("./dto/create-bounty.dto");
const apply_bounty_dto_1 = require("./dto/apply-bounty.dto");
const deliver_bounty_dto_1 = require("./dto/deliver-bounty.dto");
const query_bounty_dto_1 = require("./dto/query-bounty.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let BountiesController = class BountiesController {
    bountiesService;
    constructor(bountiesService) {
        this.bountiesService = bountiesService;
    }
    async create(dto, req) {
        return this.bountiesService.create(dto, req.user.id);
    }
    async findAll(query) {
        return this.bountiesService.findAll(query);
    }
    async getMyCreated(req) {
        return this.bountiesService.getMyBounties(req.user.id, 'creator');
    }
    async getMyAssigned(req) {
        return this.bountiesService.getMyBounties(req.user.id, 'assignee');
    }
    async findOne(id) {
        return this.bountiesService.findOne(id);
    }
    async apply(id, dto, req) {
        return this.bountiesService.apply(id, dto, req.user.id);
    }
    async acceptApplication(id, applicationId, req) {
        return this.bountiesService.acceptApplication(id, applicationId, req.user.id);
    }
    async deliver(id, dto, req) {
        return this.bountiesService.deliver(id, dto, req.user.id);
    }
    async complete(id, req) {
        return this.bountiesService.complete(id, req.user.id);
    }
    async cancel(id, req) {
        return this.bountiesService.cancel(id, req.user.id);
    }
};
exports.BountiesController = BountiesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bounty_dto_1.CreateBountyDto, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_bounty_dto_1.QueryBountyDto]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/created'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "getMyCreated", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/assigned'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "getMyAssigned", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/apply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, apply_bounty_dto_1.ApplyBountyDto, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "apply", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/accept/:applicationId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('applicationId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "acceptApplication", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/deliver'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, deliver_bounty_dto_1.DeliverBountyDto, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "deliver", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "complete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BountiesController.prototype, "cancel", null);
exports.BountiesController = BountiesController = __decorate([
    (0, common_1.Controller)('bounties'),
    __metadata("design:paramtypes", [bounties_service_1.BountiesService])
], BountiesController);
//# sourceMappingURL=bounties.controller.js.map