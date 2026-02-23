import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AgentsModule } from '../agents/agents.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [AgentsModule, ReviewsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
