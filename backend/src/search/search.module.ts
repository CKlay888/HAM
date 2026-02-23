import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { AgentsModule } from '../agents/agents.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [AgentsModule, PurchasesModule, ReviewsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
