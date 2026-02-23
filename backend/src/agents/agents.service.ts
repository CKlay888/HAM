import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AgentsService {
  // 临时内存存储，后续替换为数据库
  private agents: Map<string, Agent> = new Map();

  async findAll(query?: {
    category?: string;
    ownerId?: string;
    isActive?: boolean;
  }): Promise<Agent[]> {
    let results = Array.from(this.agents.values());

    if (query?.category) {
      results = results.filter((a) => a.category === query.category);
    }
    if (query?.ownerId) {
      results = results.filter((a) => a.ownerId === query.ownerId);
    }
    if (query?.isActive !== undefined) {
      results = results.filter((a) => a.isActive === query.isActive);
    }

    return results;
  }

  async findOne(id: string): Promise<Agent> {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`);
    }
    return agent;
  }

  async create(dto: CreateAgentDto, ownerId: string): Promise<Agent> {
    const agent: Agent = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      category: dto.category,
      price: dto.price,
      currency: dto.currency || 'USD',
      ownerId,
      capabilities: dto.capabilities,
      apiEndpoint: dto.apiEndpoint,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  async update(
    id: string,
    dto: UpdateAgentDto,
    userId: string,
  ): Promise<Agent> {
    const agent = await this.findOne(id);

    // 只有 owner 可以修改
    if (agent.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own agents');
    }

    const updated: Agent = {
      ...agent,
      ...dto,
      updatedAt: new Date(),
    };

    this.agents.set(id, updated);
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const agent = await this.findOne(id);

    // 只有 owner 可以删除
    if (agent.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own agents');
    }

    this.agents.delete(id);
  }
}
