import { 
  Injectable, NotFoundException, BadRequestException, 
  ForbiddenException, ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { 
  Review, ReviewReply, ReviewLike, ReviewReport, ReviewStatus 
} from '../../entities/review.entity';
import { Agent } from '../../entities/agent.entity';
import { User } from '../../entities/user.entity';
import {
  CreateReviewDto, UpdateReviewDto, QueryReviewsDto,
  ReviewResponseDto, ReviewListResponseDto, CreateReplyDto,
  ReplyResponseDto, DeveloperReplyDto, ReportReviewDto,
  ReviewStatsDto, AdminQueryReviewsDto, AdminUpdateReviewDto
} from '../dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewReply)
    private readonly replyRepository: Repository<ReviewReply>,
    @InjectRepository(ReviewLike)
    private readonly likeRepository: Repository<ReviewLike>,
    @InjectRepository(ReviewReport)
    private readonly reportRepository: Repository<ReviewReport>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建评论
   */
  async create(userId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
    // 检查Agent是否存在
    const agent = await this.agentRepository.findOne({
      where: { id: dto.agent_id }
    });
    if (!agent) {
      throw new NotFoundException('Agent不存在');
    }

    // 检查是否已评论
    const existing = await this.reviewRepository.findOne({
      where: { user_id: userId, agent_id: dto.agent_id }
    });
    if (existing) {
      throw new ConflictException('您已经评论过此Agent');
    }

    // TODO: 检查是否购买过（可选）
    // if (dto.order_id) {
    //   const order = await this.orderRepository.findOne({
    //     where: { id: dto.order_id, user_id: userId, agent_id: dto.agent_id }
    //   });
    //   if (!order) {
    //     throw new BadRequestException('订单不存在');
    //   }
    // }

    const review = this.reviewRepository.create({
      user_id: userId,
      agent_id: dto.agent_id,
      order_id: dto.order_id,
      rating: dto.rating,
      content: dto.content,
      images: dto.images,
      is_anonymous: dto.is_anonymous || false
    });

    await this.reviewRepository.save(review);

    // 更新Agent评分
    await this.updateAgentRating(dto.agent_id);

    return this.toResponseDto(review, userId);
  }

  /**
   * 更新评论
   */
  async update(
    userId: string, 
    reviewId: string, 
    dto: UpdateReviewDto
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user_id: userId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    // 检查是否可以修改（例如：24小时内）
    const hoursSinceCreated = 
      (Date.now() - review.created_at.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) {
      throw new BadRequestException('评论发布超过24小时，无法修改');
    }

    Object.assign(review, dto);
    await this.reviewRepository.save(review);

    // 更新Agent评分
    await this.updateAgentRating(review.agent_id);

    return this.toResponseDto(review, userId);
  }

  /**
   * 删除评论
   */
  async delete(userId: string, reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user_id: userId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    const agentId = review.agent_id;
    await this.reviewRepository.remove(review);

    // 更新Agent评分
    await this.updateAgentRating(agentId);
  }

  /**
   * 获取评论列表
   */
  async getReviews(dto: QueryReviewsDto, currentUserId?: string): Promise<ReviewListResponseDto> {
    const { 
      agent_id, user_id, rating, with_images, sort_by,
      page = 1, limit = 20 
    } = dto;

    const queryBuilder = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.status = :status', { status: ReviewStatus.APPROVED });

    if (agent_id) {
      queryBuilder.andWhere('review.agent_id = :agent_id', { agent_id });
    }

    if (user_id) {
      queryBuilder.andWhere('review.user_id = :user_id', { user_id });
    }

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    if (with_images) {
      queryBuilder.andWhere('array_length(review.images, 1) > 0');
    }

    // 排序
    switch (sort_by) {
      case 'oldest':
        queryBuilder.orderBy('review.created_at', 'ASC');
        break;
      case 'rating_high':
        queryBuilder.orderBy('review.rating', 'DESC');
        break;
      case 'rating_low':
        queryBuilder.orderBy('review.rating', 'ASC');
        break;
      case 'helpful':
        queryBuilder.orderBy('review.like_count', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('review.created_at', 'DESC');
        break;
    }

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [reviews, total] = await queryBuilder.getManyAndCount();

    // 获取统计
    let stats: ReviewStatsDto | undefined;
    if (agent_id) {
      stats = await this.getStats(agent_id);
    }

    return {
      data: reviews.map(r => this.toResponseDto(r, currentUserId)),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      stats
    };
  }

  /**
   * 获取评论详情
   */
  async getReview(reviewId: string, currentUserId?: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user']
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }
    return this.toResponseDto(review, currentUserId);
  }

  /**
   * 点赞评论
   */
  async likeReview(userId: string, reviewId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    const existing = await this.likeRepository.findOne({
      where: { user_id: userId, review_id: reviewId }
    });
    if (existing) {
      throw new ConflictException('已经点赞过了');
    }

    const like = this.likeRepository.create({
      user_id: userId,
      review_id: reviewId
    });
    await this.likeRepository.save(like);

    // 更新点赞数
    await this.reviewRepository.increment({ id: reviewId }, 'like_count', 1);
  }

  /**
   * 取消点赞
   */
  async unlikeReview(userId: string, reviewId: string): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user_id: userId, review_id: reviewId }
    });
    if (!like) {
      throw new NotFoundException('未点赞此评论');
    }

    await this.likeRepository.remove(like);
    await this.reviewRepository.decrement({ id: reviewId }, 'like_count', 1);
  }

  // ===== 评论回复 =====

  /**
   * 添加回复
   */
  async addReply(
    userId: string, 
    reviewId: string, 
    dto: CreateReplyDto
  ): Promise<ReplyResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    // 检查父回复
    if (dto.parent_id) {
      const parent = await this.replyRepository.findOne({
        where: { id: dto.parent_id, review_id: reviewId }
      });
      if (!parent) {
        throw new NotFoundException('父回复不存在');
      }
    }

    const reply = this.replyRepository.create({
      review_id: reviewId,
      user_id: userId,
      parent_id: dto.parent_id,
      content: dto.content,
      is_developer: false // TODO: 检查是否是开发者
    });

    await this.replyRepository.save(reply);
    await this.reviewRepository.increment({ id: reviewId }, 'reply_count', 1);

    return this.toReplyResponseDto(reply);
  }

  /**
   * 获取评论的回复列表
   */
  async getReplies(reviewId: string, currentUserId?: string): Promise<ReplyResponseDto[]> {
    const replies = await this.replyRepository.find({
      where: { review_id: reviewId },
      relations: ['user'],
      order: { created_at: 'ASC' }
    });

    return replies.map(r => this.toReplyResponseDto(r, currentUserId));
  }

  /**
   * 删除回复
   */
  async deleteReply(userId: string, replyId: string): Promise<void> {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId, user_id: userId }
    });
    if (!reply) {
      throw new NotFoundException('回复不存在');
    }

    const reviewId = reply.review_id;
    await this.replyRepository.remove(reply);
    await this.reviewRepository.decrement({ id: reviewId }, 'reply_count', 1);
  }

  // ===== 开发者回复 =====

  /**
   * 开发者回复评论
   */
  async developerReply(
    developerId: string, 
    reviewId: string, 
    dto: DeveloperReplyDto
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['agent']
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    // 验证是否是该Agent的开发者
    if (review.agent.creator_id !== developerId) {
      throw new ForbiddenException('您不是此Agent的开发者');
    }

    review.developer_reply = dto.content;
    review.developer_reply_at = new Date();
    await this.reviewRepository.save(review);

    return this.toResponseDto(review);
  }

  // ===== 举报 =====

  /**
   * 举报评论
   */
  async reportReview(
    userId: string, 
    reviewId: string, 
    dto: ReportReviewDto
  ): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    // 检查是否已举报
    const existing = await this.reportRepository.findOne({
      where: { user_id: userId, review_id: reviewId }
    });
    if (existing) {
      throw new ConflictException('已经举报过此评论');
    }

    const report = this.reportRepository.create({
      user_id: userId,
      review_id: reviewId,
      reason: dto.reason,
      description: dto.description
    });

    await this.reportRepository.save(report);
  }

  // ===== 统计 =====

  /**
   * 获取评论统计
   */
  async getStats(agentId: string): Promise<ReviewStatsDto> {
    const reviews = await this.reviewRepository.find({
      where: { agent_id: agentId, status: ReviewStatus.APPROVED }
    });

    const totalCount = reviews.length;
    const avgRating = totalCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0;

    const ratingDistribution = {
      rating_1: reviews.filter(r => r.rating === 1).length,
      rating_2: reviews.filter(r => r.rating === 2).length,
      rating_3: reviews.filter(r => r.rating === 3).length,
      rating_4: reviews.filter(r => r.rating === 4).length,
      rating_5: reviews.filter(r => r.rating === 5).length
    };

    const withImagesCount = reviews.filter(r => r.images && r.images.length > 0).length;
    const repliedCount = reviews.filter(r => r.developer_reply).length;

    return {
      total_count: totalCount,
      avg_rating: Math.round(avgRating * 10) / 10,
      rating_distribution: ratingDistribution,
      with_images_count: withImagesCount,
      replied_count: repliedCount
    };
  }

  // ===== 管理员功能 =====

  /**
   * 管理员更新评论状态
   */
  async adminUpdate(reviewId: string, dto: AdminUpdateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId }
    });
    if (!review) {
      throw new NotFoundException('评论不存在');
    }

    if (dto.status) {
      review.status = dto.status;
    }

    await this.reviewRepository.save(review);
    return this.toResponseDto(review);
  }

  // ===== 私有方法 =====

  private async updateAgentRating(agentId: string): Promise<void> {
    const stats = await this.getStats(agentId);
    await this.agentRepository.update(agentId, {
      value_score: stats.avg_rating
    });
  }

  private toResponseDto(review: Review, currentUserId?: string): ReviewResponseDto {
    const isLiked = false; // TODO: 查询当前用户是否点赞

    return {
      id: review.id,
      user_id: review.user_id,
      user_name: review.is_anonymous ? '匿名用户' : review.user?.username,
      user_avatar: review.is_anonymous ? undefined : review.user?.avatar_url,
      agent_id: review.agent_id,
      rating: review.rating,
      content: review.content,
      images: review.images || [],
      is_anonymous: review.is_anonymous,
      like_count: review.like_count,
      reply_count: review.reply_count,
      is_liked: isLiked,
      developer_reply: review.developer_reply,
      developer_reply_at: review.developer_reply_at,
      created_at: review.created_at
    };
  }

  private toReplyResponseDto(reply: ReviewReply, currentUserId?: string): ReplyResponseDto {
    const isLiked = false; // TODO

    return {
      id: reply.id,
      user_id: reply.user_id,
      user_name: reply.user?.username,
      user_avatar: reply.user?.avatar_url,
      content: reply.content,
      like_count: reply.like_count,
      is_developer: reply.is_developer,
      is_liked: isLiked,
      parent_id: reply.parent_id,
      created_at: reply.created_at
    };
  }
}
