import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ReviewsService {
  private reviews: Map<string, Review> = new Map();

  constructor(
    private agentsService: AgentsService,
    private purchasesService: PurchasesService,
  ) {}

  async findByAgent(agentId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((r) => r.agentId === agentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(dto: CreateReviewDto, userId: string): Promise<Review> {
    // 验证 Agent 存在
    await this.agentsService.findOne(dto.agentId);

    // 验证用户已购买
    const purchases = await this.purchasesService.findAll(userId);
    const hasPurchased = purchases.some(
      (p) => p.agentId === dto.agentId && p.status === 'completed',
    );
    if (!hasPurchased) {
      throw new ForbiddenException('You must purchase this agent to review');
    }

    // 检查是否已评论
    const existing = Array.from(this.reviews.values()).find(
      (r) => r.userId === userId && r.agentId === dto.agentId,
    );
    if (existing) {
      throw new BadRequestException('You have already reviewed this agent');
    }

    const now = new Date();
    const review: Review = {
      id: randomUUID(),
      userId,
      agentId: dto.agentId,
      rating: dto.rating,
      content: dto.content,
      createdAt: now,
      updatedAt: now,
    };

    this.reviews.set(review.id, review);
    return review;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = this.reviews.get(id);
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    this.reviews.delete(id);
  }
}
