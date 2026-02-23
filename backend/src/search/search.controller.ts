import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller()
export class SearchController {
  constructor(private searchService: SearchService) {}

  /**
   * GET /agents/search
   * 搜索 Agent（关键词、分类、价格、排序）
   */
  @Get('agents/search')
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }

  /**
   * GET /categories
   * 获取所有分类
   */
  @Get('categories')
  async getCategories() {
    return this.searchService.getCategories();
  }

  /**
   * GET /agents/hot
   * 热门 Agent（按销量）
   */
  @Get('agents/hot')
  async getHotAgents(@Query('limit') limit?: string) {
    return this.searchService.getHotAgents(limit ? parseInt(limit) : 10);
  }

  /**
   * GET /agents/recommended
   * 推荐 Agent
   */
  @Get('agents/recommended')
  async getRecommendedAgents(@Query('limit') limit?: string) {
    return this.searchService.getRecommendedAgents(limit ? parseInt(limit) : 10);
  }
}
