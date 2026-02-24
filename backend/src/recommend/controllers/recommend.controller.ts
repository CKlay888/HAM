import {
  Controller, Get, Post, Body, Query, Param, Req, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendService } from '../services/recommend.service';
import {
  GetRecommendDto, GetSimilarAgentsDto, PersonalizedRecommendDto,
  RecommendResponseDto, HomeRecommendResponseDto, RecordBehaviorDto
} from '../dto/recommend.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';

@ApiTags('推荐')
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get()
  @ApiOperation({ summary: '获取推荐列表' })
  @ApiResponse({ status: 200, type: RecommendResponseDto })
  async getRecommend(@Query() dto: GetRecommendDto): Promise<RecommendResponseDto> {
    return this.recommendService.getRecommend(dto);
  }

  @Get('home')
  @ApiOperation({ summary: '首页推荐' })
  @ApiResponse({ status: 200, type: HomeRecommendResponseDto })
  // @UseGuards(OptionalAuthGuard)
  async getHomeRecommend(@Req() req: any): Promise<HomeRecommendResponseDto> {
    const userId = req.user?.id;
    return this.recommendService.getHomeRecommend(userId);
  }

  @Get('personalized')
  @ApiOperation({ summary: '个性化推荐（需登录）' })
  @ApiResponse({ status: 200, type: RecommendResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async getPersonalized(
    @Req() req: any,
    @Query() dto: PersonalizedRecommendDto
  ): Promise<RecommendResponseDto> {
    return this.recommendService.getPersonalized(req.user.id, dto);
  }

  @Get('similar/:agent_id')
  @ApiOperation({ summary: '相似Agent推荐' })
  @ApiResponse({ status: 200, type: RecommendResponseDto })
  async getSimilar(
    @Param('agent_id') agentId: string,
    @Query('limit') limit: number = 10
  ): Promise<RecommendResponseDto> {
    return this.recommendService.getSimilar({ agent_id: agentId, limit });
  }

  @Get('bought-also/:agent_id')
  @ApiOperation({ summary: '购买此商品的人还买了' })
  @ApiResponse({ status: 200, type: RecommendResponseDto })
  async getBoughtAlso(
    @Param('agent_id') agentId: string,
    @Query('limit') limit: number = 10
  ): Promise<RecommendResponseDto> {
    return this.recommendService.getBoughtAlso(agentId, limit);
  }

  @Post('behavior')
  @ApiOperation({ summary: '记录用户行为（用于推荐）' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async recordBehavior(
    @Req() req: any,
    @Body() dto: RecordBehaviorDto
  ): Promise<void> {
    return this.recommendService.recordBehavior(req.user.id, dto);
  }
}
