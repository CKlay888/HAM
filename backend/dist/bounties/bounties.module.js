"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountiesModule = void 0;
const common_1 = require("@nestjs/common");
const bounties_controller_1 = require("./bounties.controller");
const bounties_service_1 = require("./bounties.service");
let BountiesModule = class BountiesModule {
};
exports.BountiesModule = BountiesModule;
exports.BountiesModule = BountiesModule = __decorate([
    (0, common_1.Module)({
        controllers: [bounties_controller_1.BountiesController],
        providers: [bounties_service_1.BountiesService],
        exports: [bounties_service_1.BountiesService],
    })
], BountiesModule);
//# sourceMappingURL=bounties.module.js.map