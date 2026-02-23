import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PurchasesService } from '../purchases/purchases.service';
import { AgentsService } from '../agents/agents.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RechargeDto } from './dto/recharge.dto';

// 用户余额存储（模拟）
const balances: Map<string, number> = new Map();

// 用户扩展资料
const profiles: Map<string, { bio?: string; avatar?: string }> = new Map();

@Injectable()
export class UserService {
  constructor(
    private usersService: UsersService,
    private purchasesService: PurchasesService,
    private agentsService: AgentsService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const extra = profiles.get(userId) || {};
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      bio: extra.bio || '',
      avatar: extra.avatar || '',
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 更新用户名（如果提供）
    if (dto.username) {
      user.username = dto.username;
      user.updatedAt = new Date();
    }

    // 更新扩展资料
    const extra = profiles.get(userId) || {};
    if (dto.bio !== undefined) extra.bio = dto.bio;
    if (dto.avatar !== undefined) extra.avatar = dto.avatar;
    profiles.set(userId, extra);

    return this.getProfile(userId);
  }

  async getBalance(userId: string) {
    const balance = balances.get(userId) || 0;
    return {
      userId,
      balance,
      currency: 'USD',
    };
  }

  async recharge(userId: string, dto: RechargeDto) {
    const current = balances.get(userId) || 0;
    const newBalance = current + dto.amount;
    balances.set(userId, newBalance);

    return {
      userId,
      amount: dto.amount,
      balance: newBalance,
      currency: 'USD',
      message: 'Recharge successful',
    };
  }

  async getOrders(userId: string) {
    const purchases = await this.purchasesService.findAll(userId);
    
    // 获取 Agent 详情
    const ordersWithAgent = await Promise.all(
      purchases.map(async (p) => {
        try {
          const agent = await this.agentsService.findOne(p.agentId);
          return { ...p, agent: { id: agent.id, name: agent.name } };
        } catch {
          return { ...p, agent: null };
        }
      }),
    );

    return ordersWithAgent;
  }

  async getMyAgents(userId: string) {
    const purchases = await this.purchasesService.findAll(userId);
    const completedPurchases = purchases.filter((p) => p.status === 'completed');

    const agents = await Promise.all(
      completedPurchases.map(async (p) => {
        try {
          return await this.agentsService.findOne(p.agentId);
        } catch {
          return null;
        }
      }),
    );

    return agents.filter((a) => a !== null);
  }
}
