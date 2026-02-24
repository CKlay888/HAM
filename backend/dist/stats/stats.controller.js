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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
let StatsController = class StatsController {
    statsService;
    constructor(statsService) {
        this.statsService = statsService;
    }
    async getOverview() {
        return this.statsService.getOverview();
    }
    async getAgentStats(id) {
        return this.statsService.getAgentStats(id);
    }
    async getTrendingAgents(limit) {
        return this.statsService.getTrendingAgents(limit ? parseInt(limit) : 10);
    }
    async getNewAgents(limit) {
        return this.statsService.getNewAgents(limit ? parseInt(limit) : 10);
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('stats/agent/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getAgentStats", null);
__decorate([
    (0, common_1.Get)('agents/trending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getTrendingAgents", null);
__decorate([
    (0, common_1.Get)('agents/new'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getNewAgents", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map