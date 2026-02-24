import {
  Controller, Get, Post, Delete, Body, Query, Req,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from '../services/search.service';
import {
  SearchAgentsDto, SearchResponseDto, SearchHistoryDto,
  HotSearchDto, SearchSuggestResponseDto, ClearSearchHistoryDto
} from '../dto/search.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';

@ApiTags('搜索')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: '搜索Agent' })
  @ApiResponse({ status: 200, type: SearchResponseDto })
  // @UseGuards(OptionalAuthGuard)
  async search(
    @Query() dto: SearchAgentsDto,
    @Req() req: any
  ): Promise<SearchResponseDto> {
    const userId = req.user?.id || null;
    return this.searchService.search(userId, dto);
  }

  @Get('suggest')
  @ApiOperation({ summary: '搜索建议' })
  @ApiResponse({ status: 200, type: SearchSuggestResponseDto })
  async suggest(@Query('keyword') keyword: string): Promise<SearchSuggestResponseDto> {
    return this.searchService.suggest(keyword);
  }

  @Get('hot')
  @ApiOperation({ summary: '热门搜索' })
  @ApiResponse({ status: 200, type: [HotSearchDto] })
  async getHotSearches(@Query('limit') limit: number = 10): Promise<HotSearchDto[]> {
    return this.searchService.getHotSearches(limit);
  }

  @Get('history')
  @ApiOperation({ summary: '获取搜索历史' })
  @ApiResponse({ status: 200, type: [SearchHistoryDto] })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getHistory(
    @Req() req: any,
    @Query('limit') limit: number = 20
  ): Promise<SearchHistoryDto[]> {
    return this.searchService.getUserHistory(req.user.id, limit);
  }

  @Delete('history')
  @ApiOperation({ summary: '清除搜索历史' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async clearHistory(
    @Req() req: any,
    @Body() dto?: ClearSearchHistoryDto
  ): Promise<void> {
    return this.searchService.clearHistory(req.user.id, dto);
  }
}
