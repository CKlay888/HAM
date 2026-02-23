import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Purchase, PurchaseStatus } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AgentsService } from '../agents/agents.service';
import { randomUUID } from 'crypto';

@Injectable()
export class PurchasesService {
  // 临时内存存储
  private purchases: Map<string, Purchase> = new Map();

  constructor(private agentsService: AgentsService) {}

  async findAll(userId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (p) => p.userId === userId,
    );
  }

  async findOne(id: string, userId: string): Promise<Purchase> {
    const purchase = this.purchases.get(id);
    if (!purchase) {
      throw new NotFoundException(`Purchase ${id} not found`);
    }
    // 只能查看自己的订单
    if (purchase.userId !== userId) {
      throw new ForbiddenException('You can only view your own purchases');
    }
    return purchase;
  }

  async create(dto: CreatePurchaseDto, userId: string): Promise<Purchase> {
    // 验证 Agent 存在
    const agent = await this.agentsService.findOne(dto.agentId);

    if (!agent.isActive) {
      throw new BadRequestException('Agent is not available for purchase');
    }

    // 不能购买自己的 Agent
    if (agent.ownerId === userId) {
      throw new BadRequestException('You cannot purchase your own agent');
    }

    // 检查是否已购买
    const existing = Array.from(this.purchases.values()).find(
      (p) =>
        p.userId === userId &&
        p.agentId === dto.agentId &&
        p.status === PurchaseStatus.COMPLETED,
    );
    if (existing) {
      throw new BadRequestException('You have already purchased this agent');
    }

    const purchase: Purchase = {
      id: randomUUID(),
      userId,
      agentId: dto.agentId,
      amount: agent.price,
      currency: agent.currency,
      status: PurchaseStatus.COMPLETED, // 简化：直接完成
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.purchases.set(purchase.id, purchase);
    return purchase;
  }
}
