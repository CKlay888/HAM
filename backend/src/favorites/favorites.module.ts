import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './services/favorites.service';
import { Favorite, FavoriteGroup } from '../entities/favorite.entity';
import { Agent } from '../entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, FavoriteGroup, Agent])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
