import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ExecutionsModule } from './executions/executions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';
import { StatsModule } from './stats/stats.module';
import { FavoritesModule } from './favorites/favorites.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagesModule } from './messages/messages.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BountiesModule } from './bounties/bounties.module';
// 新增模块
import { CategoriesModule } from './categories/categories.module';
import { RecommendModule } from './recommend/recommend.module';
import { OrdersModule } from './orders/orders.module';
import { DevelopersModule } from './developers/developers.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AgentsModule,
    PurchasesModule,
    ExecutionsModule,
    ReviewsModule,
    SearchModule,
    UserModule,
    StatsModule,
    FavoritesModule,
    DashboardModule,
    NotificationsModule,
    MessagesModule,
    AnalyticsModule,
    BountiesModule,
    // 新增模块
    CategoriesModule,
    RecommendModule,
    OrdersModule,
    DevelopersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
