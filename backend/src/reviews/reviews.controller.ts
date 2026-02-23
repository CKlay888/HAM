import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  /**
   * GET /reviews?agentId=xxx
   * 获取 Agent 评论列表
   */
  @Get()
  async findByAgent(@Query('agentId') agentId: string) {
    if (!agentId) {
      return [];
    }
    return this.reviewsService.findByAgent(agentId);
  }

  /**
   * POST /reviews
   * 发表评论（需要认证，需要已购买）
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(dto, req.user.id);
  }

  /**
   * DELETE /reviews/:id
   * 删除评论（需要认证，仅作者）
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.reviewsService.remove(id, req.user.id);
    return { message: 'Review deleted successfully' };
  }
}
