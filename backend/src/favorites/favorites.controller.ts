import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  /**
   * GET /favorites
   * 我的收藏列表
   */
  @Get()
  async findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }

  /**
   * POST /favorites
   * 收藏 Agent
   */
  @Post()
  async create(@Body() dto: CreateFavoriteDto, @Request() req) {
    return this.favoritesService.create(dto, req.user.id);
  }

  /**
   * DELETE /favorites/:id
   * 取消收藏
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.favoritesService.remove(id, req.user.id);
    return { message: 'Favorite removed successfully' };
  }
}
