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
exports.QueryBountyDto = exports.BountySortBy = void 0;
const class_validator_1 = require("class-validator");
const bounty_entity_1 = require("../entities/bounty.entity");
var BountySortBy;
(function (BountySortBy) {
    BountySortBy["NEWEST"] = "newest";
    BountySortBy["REWARD_HIGH"] = "reward_high";
    BountySortBy["REWARD_LOW"] = "reward_low";
    BountySortBy["DEADLINE"] = "deadline";
})(BountySortBy || (exports.BountySortBy = BountySortBy = {}));
class QueryBountyDto {
    q;
    category;
    status;
    minReward;
    maxReward;
    sort;
    page;
    limit;
}
exports.QueryBountyDto = QueryBountyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(bounty_entity_1.BountyStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "minReward", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "maxReward", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(BountySortBy),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryBountyDto.prototype, "limit", void 0);
//# sourceMappingURL=query-bounty.dto.js.map