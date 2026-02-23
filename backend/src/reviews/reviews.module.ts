import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AgentsModule } from '../agents/agents.module';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [AgentsModule, PurchasesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
