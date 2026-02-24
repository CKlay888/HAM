"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const agents_module_1 = require("./agents/agents.module");
const purchases_module_1 = require("./purchases/purchases.module");
const executions_module_1 = require("./executions/executions.module");
const reviews_module_1 = require("./reviews/reviews.module");
const search_module_1 = require("./search/search.module");
const user_module_1 = require("./user/user.module");
const stats_module_1 = require("./stats/stats.module");
const favorites_module_1 = require("./favorites/favorites.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const notifications_module_1 = require("./notifications/notifications.module");
const messages_module_1 = require("./messages/messages.module");
const analytics_module_1 = require("./analytics/analytics.module");
const bounties_module_1 = require("./bounties/bounties.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            agents_module_1.AgentsModule,
            purchases_module_1.PurchasesModule,
            executions_module_1.ExecutionsModule,
            reviews_module_1.ReviewsModule,
            search_module_1.SearchModule,
            user_module_1.UserModule,
            stats_module_1.StatsModule,
            favorites_module_1.FavoritesModule,
            dashboard_module_1.DashboardModule,
            notifications_module_1.NotificationsModule,
            messages_module_1.MessagesModule,
            analytics_module_1.AnalyticsModule,
            bounties_module_1.BountiesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map