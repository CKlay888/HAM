import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Execution, ExecutionStatus } from './entities/execution.entity';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ExecutionsService {
  private executions: Map<string, Execution> = new Map();

  constructor(
    private agentsService: AgentsService,
    private purchasesService: PurchasesService,
  ) {}

  async findAll(userId: string): Promise<Execution[]> {
    return Array.from(this.executions.values())
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: string, userId: string): Promise<Execution> {
    const execution = this.executions.get(id);
    if (!execution) {
      throw new NotFoundException(`Execution ${id} not found`);
    }
    if (execution.userId !== userId) {
      throw new ForbiddenException('You can only view your own executions');
    }
    return execution;
  }

  async create(dto: CreateExecutionDto, userId: string): Promise<Execution> {
    // 验证 Agent 存在
    const agent = await this.agentsService.findOne(dto.agentId);

    if (!agent.isActive) {
      throw new BadRequestException('Agent is not available');
    }

    // 验证用户已购买（或是 owner）
    if (agent.ownerId !== userId) {
      const purchases = await this.purchasesService.findAll(userId);
      const hasPurchased = purchases.some(
        (p) => p.agentId === dto.agentId && p.status === 'completed',
      );
      if (!hasPurchased) {
        throw new ForbiddenException('You must purchase this agent first');
      }
    }

    const now = new Date();
    const execution: Execution = {
      id: randomUUID(),
      userId,
      agentId: dto.agentId,
      input: dto.input || {},
      status: ExecutionStatus.COMPLETED, // 简化：模拟立即完成
      output: { result: 'Agent executed successfully', timestamp: now },
      startedAt: now,
      completedAt: now,
      createdAt: now,
    };

    this.executions.set(execution.id, execution);
    return execution;
  }
}
