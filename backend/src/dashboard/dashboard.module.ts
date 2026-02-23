import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AgentsModule } from '../agents/agents.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [AgentsModule, PurchasesModule, ReviewsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
