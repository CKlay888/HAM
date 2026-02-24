import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { Review, ReviewReply, ReviewLike, ReviewReport } from '../entities/review.entity';
import { Agent } from '../entities/agent.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, ReviewReply, ReviewLike, ReviewReport, Agent, User
    ])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
