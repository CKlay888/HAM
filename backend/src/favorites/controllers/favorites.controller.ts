import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from '../services/favorites.service';
import {
  CreateFavoriteGroupDto, UpdateFavoriteGroupDto, FavoriteGroupResponseDto,
  AddFavoriteDto, UpdateFavoriteDto, QueryFavoritesDto,
  FavoriteItemDto, FavoriteListResponseDto, BatchFavoriteDto,
  MoveFavoritesDto, FavoriteStatsDto, CheckFavoriteDto, CheckFavoriteResponseDto
} from '../dto/favorite.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('收藏')
@Controller('favorites')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // ===== 收藏夹分组 =====

  @Post('groups')
  @ApiOperation({ summary: '创建收藏夹分组' })
  @ApiResponse({ status: 201, type: FavoriteGroupResponseDto })
  async createGroup(
    @Req() req: any,
    @Body() dto: CreateFavoriteGroupDto
  ): Promise<FavoriteGroupResponseDto> {
    return this.favoritesService.createGroup(req.user.id, dto);
  }

  @Get('groups')
  @ApiOperation({ summary: '获取收藏夹列表' })
  @ApiResponse({ status: 200, type: [FavoriteGroupResponseDto] })
  async getGroups(@Req() req: any): Promise<FavoriteGroupResponseDto[]> {
    return this.favoritesService.getGroups(req.user.id);
  }

  @Put('groups/:id')
  @ApiOperation({ summary: '更新收藏夹分组' })
  @ApiResponse({ status: 200, type: FavoriteGroupResponseDto })
  async updateGroup(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFavoriteGroupDto
  ): Promise<FavoriteGroupResponseDto> {
    return this.favoritesService.updateGroup(req.user.id, id, dto);
  }

  @Delete('groups/:id')
  @ApiOperation({ summary: '删除收藏夹分组' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGroup(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<void> {
    return this.favoritesService.deleteGroup(req.user.id, id);
  }

  // ===== 收藏操作 =====

  @Post()
  @ApiOperation({ summary: '添加收藏' })
  @ApiResponse({ status: 201, type: FavoriteItemDto })
  async add(
    @Req() req: any,
    @Body() dto: AddFavoriteDto
  ): Promise<FavoriteItemDto> {
    return this.favoritesService.addFavorite(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取收藏列表' })
  @ApiResponse({ status: 200, type: FavoriteListResponseDto })
  async getFavorites(
    @Req() req: any,
    @Query() dto: QueryFavoritesDto
  ): Promise<FavoriteListResponseDto> {
    return this.favoritesService.getFavorites(req.user.id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取收藏统计' })
  @ApiResponse({ status: 200, type: FavoriteStatsDto })
  async getStats(@Req() req: any): Promise<FavoriteStatsDto> {
    return this.favoritesService.getStats(req.user.id);
  }

  @Post('check')
  @ApiOperation({ summary: '检查是否已收藏' })
  @ApiResponse({ status: 200, type: CheckFavoriteResponseDto })
  async check(
    @Req() req: any,
    @Body() dto: CheckFavoriteDto
  ): Promise<CheckFavoriteResponseDto> {
    return this.favoritesService.checkFavorite(req.user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新收藏' })
  @ApiResponse({ status: 200, type: FavoriteItemDto })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFavoriteDto
  ): Promise<FavoriteItemDto> {
    return this.favoritesService.updateFavorite(req.user.id, id, dto);
  }

  @Delete('agent/:agent_id')
  @ApiOperation({ summary: '取消收藏' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: any,
    @Param('agent_id') agentId: string
  ): Promise<void> {
    return this.favoritesService.removeFavorite(req.user.id, agentId);
  }

  // ===== 批量操作 =====

  @Post('batch')
  @ApiOperation({ summary: '批量添加收藏' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async batchAdd(
    @Req() req: any,
    @Body() dto: BatchFavoriteDto
  ): Promise<void> {
    return this.favoritesService.batchAdd(req.user.id, dto);
  }

  @Put('batch/move')
  @ApiOperation({ summary: '批量移动收藏' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async batchMove(
    @Req() req: any,
    @Body() dto: MoveFavoritesDto
  ): Promise<void> {
    return this.favoritesService.batchMove(req.user.id, dto);
  }

  @Delete('batch')
  @ApiOperation({ summary: '批量删除收藏' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async batchRemove(
    @Req() req: any,
    @Body() dto: { agent_ids: string[] }
  ): Promise<void> {
    return this.favoritesService.batchRemove(req.user.id, dto.agent_ids);
  }
}
