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
exports.ExecutionsController = void 0;
const common_1 = require("@nestjs/common");
const executions_service_1 = require("./executions.service");
const create_execution_dto_1 = require("./dto/create-execution.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExecutionsController = class ExecutionsController {
    executionsService;
    constructor(executionsService) {
        this.executionsService = executionsService;
    }
    async findAll(req) {
        return this.executionsService.findAll(req.user.id);
    }
    async findOne(id, req) {
        return this.executionsService.findOne(id, req.user.id);
    }
    async create(dto, req) {
        return this.executionsService.create(dto, req.user.id);
    }
};
exports.ExecutionsController = ExecutionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_execution_dto_1.CreateExecutionDto, Object]),
    __metadata("design:returntype", Promise)
], ExecutionsController.prototype, "create", null);
exports.ExecutionsController = ExecutionsController = __decorate([
    (0, common_1.Controller)('executions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [executions_service_1.ExecutionsService])
], ExecutionsController);
//# sourceMappingURL=executions.controller.js.map