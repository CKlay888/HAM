import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { Agent } from '../entities/agent.entity';
import { SearchHistory, HotSearch } from '../entities/search-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, SearchHistory, HotSearch])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
