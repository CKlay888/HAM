import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  Bounty,
  BountyStatus,
  BountyApplication,
  BountyDelivery,
} from './entities/bounty.entity';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { ApplyBountyDto } from './dto/apply-bounty.dto';
import { DeliverBountyDto } from './dto/deliver-bounty.dto';
import { QueryBountyDto, BountySortBy } from './dto/query-bounty.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class BountiesService {
  private bounties: Map<string, Bounty> = new Map();

  async create(dto: CreateBountyDto, creatorId: string): Promise<Bounty> {
    const now = new Date();
    const bounty: Bounty = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      reward: dto.reward,
      currency: dto.currency || 'USD',
      status: BountyStatus.OPEN,
      creatorId,
      deadline: new Date(dto.deadline),
      category: dto.category,
      requirements: dto.requirements,
      deliverables: dto.deliverables,
      applications: [],
      createdAt: now,
      updatedAt: now,
    };
    this.bounties.set(bounty.id, bounty);
    return bounty;
  }

  async findAll(query: QueryBountyDto) {
    let results = Array.from(this.bounties.values());

    // 关键词搜索
    if (query.q) {
      const keyword = query.q.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.description.toLowerCase().includes(keyword),
      );
    }

    // 分类过滤
    if (query.category) {
      results = results.filter((b) => b.category === query.category);
    }

    // 状态过滤
    if (query.status) {
      results = results.filter((b) => b.status === query.status);
    }

    // 赏金过滤
    if (query.minReward) {
      const min = parseFloat(query.minReward);
      results = results.filter((b) => b.reward >= min);
    }
    if (query.maxReward) {
      const max = parseFloat(query.maxReward);
      results = results.filter((b) => b.reward <= max);
    }

    // 排序
    results = this.sortBounties(results, query.sort);

    // 分页
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const total = results.length;
    const data = results.slice((page - 1) * limit, page * limit);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Bounty> {
    const bounty = this.bounties.get(id);
    if (!bounty) {
      throw new NotFoundException(`Bounty ${id} not found`);
    }
    return bounty;
  }

  async apply(id: string, dto: ApplyBountyDto, applicantId: string) {
    const bounty = await this.findOne(id);

    if (bounty.status !== BountyStatus.OPEN) {
      throw new BadRequestException('Bounty is not open for applications');
    }
    if (bounty.creatorId === applicantId) {
      throw new BadRequestException('Cannot apply to your own bounty');
    }
    if (bounty.applications.some((a) => a.applicantId === applicantId)) {
      throw new BadRequestException('You have already applied');
    }

    const application: BountyApplication = {
      id: randomUUID(),
      bountyId: id,
      applicantId,
      proposal: dto.proposal,
      estimatedDays: dto.estimatedDays,
      status: 'pending',
      createdAt: new Date(),
    };

    bounty.applications.push(application);
    bounty.updatedAt = new Date();
    return application;
  }

  async acceptApplication(
    bountyId: string,
    applicationId: string,
    userId: string,
  ) {
    const bounty = await this.findOne(bountyId);

    if (bounty.creatorId !== userId) {
      throw new ForbiddenException('Only creator can accept applications');
    }
    if (bounty.status !== BountyStatus.OPEN) {
      throw new BadRequestException('Bounty is not open');
    }

    const application = bounty.applications.find((a) => a.id === applicationId);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // 接受该申请，拒绝其他申请
    bounty.applications.forEach((a) => {
      a.status = a.id === applicationId ? 'accepted' : 'rejected';
    });

    bounty.assigneeId = application.applicantId;
    bounty.status = BountyStatus.IN_PROGRESS;
    bounty.updatedAt = new Date();

    return bounty;
  }

  async deliver(id: string, dto: DeliverBountyDto, userId: string) {
    const bounty = await this.findOne(id);

    if (bounty.assigneeId !== userId) {
      throw new ForbiddenException('Only assignee can deliver');
    }
    if (bounty.status !== BountyStatus.IN_PROGRESS) {
      throw new BadRequestException('Bounty is not in progress');
    }

    const delivery: BountyDelivery = {
      id: randomUUID(),
      bountyId: id,
      deliverables: dto.deliverables,
      attachments: dto.attachments,
      notes: dto.notes,
      submittedAt: new Date(),
    };

    bounty.delivery = delivery;
    bounty.status = BountyStatus.DELIVERED;
    bounty.updatedAt = new Date();

    return bounty;
  }

  async complete(id: string, userId: string) {
    const bounty = await this.findOne(id);

    if (bounty.creatorId !== userId) {
      throw new ForbiddenException('Only creator can complete bounty');
    }
    if (bounty.status !== BountyStatus.DELIVERED) {
      throw new BadRequestException('Bounty must be delivered first');
    }

    bounty.status = BountyStatus.COMPLETED;
    bounty.updatedAt = new Date();

    // TODO: 转账奖金给 assignee

    return bounty;
  }

  async cancel(id: string, userId: string) {
    const bounty = await this.findOne(id);

    if (bounty.creatorId !== userId) {
      throw new ForbiddenException('Only creator can cancel bounty');
    }
    if (
      bounty.status === BountyStatus.COMPLETED ||
      bounty.status === BountyStatus.DELIVERED
    ) {
      throw new BadRequestException('Cannot cancel completed or delivered bounty');
    }

    bounty.status = BountyStatus.CANCELLED;
    bounty.updatedAt = new Date();

    return bounty;
  }

  async getMyBounties(userId: string, role: 'creator' | 'assignee') {
    const all = Array.from(this.bounties.values());
    if (role === 'creator') {
      return all.filter((b) => b.creatorId === userId);
    }
    return all.filter((b) => b.assigneeId === userId);
  }

  private sortBounties(bounties: Bounty[], sort?: BountySortBy): Bounty[] {
    switch (sort) {
      case BountySortBy.REWARD_HIGH:
        return bounties.sort((a, b) => b.reward - a.reward);
      case BountySortBy.REWARD_LOW:
        return bounties.sort((a, b) => a.reward - b.reward);
      case BountySortBy.DEADLINE:
        return bounties.sort(
          (a, b) => a.deadline.getTime() - b.deadline.getTime(),
        );
      case BountySortBy.NEWEST:
      default:
        return bounties.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
    }
  }
}
