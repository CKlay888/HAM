import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import {
  CreateCategoryDto, UpdateCategoryDto, QueryCategoriesDto,
  CategoryResponseDto, CategoryTreeResponseDto, CategoryStatsDto
} from '../dto/category.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('分类')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '创建分类（管理员）' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '获取分类列表' })
  @ApiResponse({ status: 200, type: CategoryTreeResponseDto })
  async findAll(@Query() query: QueryCategoriesDto): Promise<CategoryTreeResponseDto> {
    return this.categoriesService.findAll(query);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取完整分类树' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async getTree(@Query('active_only') activeOnly: boolean = true): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getTree(activeOnly);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取分类统计（管理员）' })
  @ApiResponse({ status: 200, type: [CategoryStatsDto] })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async getStats(@Query('category_id') categoryId?: string): Promise<CategoryStatsDto[]> {
    return this.categoriesService.getStats(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分类详情' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async findById(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoriesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新分类（管理员）' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分类（管理员）' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }

  @Put('sort/batch')
  @ApiOperation({ summary: '批量更新排序（管理员）' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async updateSortOrder(
    @Body() items: { id: string; sort_order: number }[]
  ): Promise<void> {
    return this.categoriesService.updateSortOrder(items);
  }
}
