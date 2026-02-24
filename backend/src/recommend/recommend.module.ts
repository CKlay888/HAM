import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendController } from './controllers/recommend.controller';
import { RecommendService } from './services/recommend.service';
import { Agent } from '../entities/agent.entity';
import { Favorite } from '../entities/favorite.entity';
import { Execution } from '../entities/execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Favorite, Execution])],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}
