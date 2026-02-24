import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Req,
  UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from '../services/reviews.service';
import {
  CreateReviewDto, UpdateReviewDto, QueryReviewsDto,
  ReviewResponseDto, ReviewListResponseDto, CreateReplyDto,
  ReplyResponseDto, DeveloperReplyDto, ReportReviewDto,
  ReviewStatsDto, AdminQueryReviewsDto, AdminUpdateReviewDto
} from '../dto/review.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { OptionalAuthGuard } from '../../auth/guards/optional-auth.guard';
// import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('评论')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, type: ReviewResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: any,
    @Body() dto: CreateReviewDto
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, type: ReviewListResponseDto })
  // @UseGuards(OptionalAuthGuard)
  async getReviews(
    @Query() dto: QueryReviewsDto,
    @Req() req: any
  ): Promise<ReviewListResponseDto> {
    return this.reviewsService.getReviews(dto, req.user?.id);
  }

  @Get('stats/:agent_id')
  @ApiOperation({ summary: '获取Agent评论统计' })
  @ApiResponse({ status: 200, type: ReviewStatsDto })
  async getStats(@Param('agent_id') agentId: string): Promise<ReviewStatsDto> {
    return this.reviewsService.getStats(agentId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评论详情' })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  // @UseGuards(OptionalAuthGuard)
  async getReview(
    @Param('id') id: string,
    @Req() req: any
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.getReview(id, req.user?.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新评论' })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async delete(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<void> {
    return this.reviewsService.delete(req.user.id, id);
  }

  // ===== 点赞 =====

  @Post(':id/like')
  @ApiOperation({ summary: '点赞评论' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async like(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<void> {
    return this.reviewsService.likeReview(req.user.id, id);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: '取消点赞' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async unlike(
    @Req() req: any,
    @Param('id') id: string
  ): Promise<void> {
    return this.reviewsService.unlikeReview(req.user.id, id);
  }

  // ===== 回复 =====

  @Post(':id/replies')
  @ApiOperation({ summary: '添加回复' })
  @ApiResponse({ status: 201, type: ReplyResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async addReply(
    @Req() req: any,
    @Param('id') reviewId: string,
    @Body() dto: CreateReplyDto
  ): Promise<ReplyResponseDto> {
    return this.reviewsService.addReply(req.user.id, reviewId, dto);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: '获取评论回复列表' })
  @ApiResponse({ status: 200, type: [ReplyResponseDto] })
  // @UseGuards(OptionalAuthGuard)
  async getReplies(
    @Param('id') reviewId: string,
    @Req() req: any
  ): Promise<ReplyResponseDto[]> {
    return this.reviewsService.getReplies(reviewId, req.user?.id);
  }

  @Delete('replies/:reply_id')
  @ApiOperation({ summary: '删除回复' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async deleteReply(
    @Req() req: any,
    @Param('reply_id') replyId: string
  ): Promise<void> {
    return this.reviewsService.deleteReply(req.user.id, replyId);
  }

  // ===== 开发者回复 =====

  @Post(':id/developer-reply')
  @ApiOperation({ summary: '开发者回复评论' })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async developerReply(
    @Req() req: any,
    @Param('id') reviewId: string,
    @Body() dto: DeveloperReplyDto
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.developerReply(req.user.id, reviewId, dto);
  }

  // ===== 举报 =====

  @Post(':id/report')
  @ApiOperation({ summary: '举报评论' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async report(
    @Req() req: any,
    @Param('id') reviewId: string,
    @Body() dto: ReportReviewDto
  ): Promise<void> {
    return this.reviewsService.reportReview(req.user.id, reviewId, dto);
  }

  // ===== 管理员 =====

  @Put('admin/:id')
  @ApiOperation({ summary: '管理员更新评论状态' })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, AdminGuard)
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateReviewDto
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.adminUpdate(id, dto);
  }
}
